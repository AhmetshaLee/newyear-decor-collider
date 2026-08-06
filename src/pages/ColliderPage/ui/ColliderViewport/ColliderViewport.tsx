import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
} from 'react'
import {
  getViewportCameraOffset,
  ViewportDestinations,
  ViewportNavigation,
  type ViewportPosition,
} from '../ViewportNavigation'

import styles from './ColliderViewport.module.scss'

const PANEL_WIDTH = 1280
const PANEL_HEIGHT = 720
const FIT_PADDING = 0.85
const MIN_USER_ZOOM = 0.9
const MAX_USER_ZOOM = 1.1
const WHEEL_LINE_HEIGHT = 16
const RESIZE_SETTLE_DELAY = 100
const NAVIGATION_DURATION = 560
const ZOOM_DURATION = 240

type ColliderViewportProps = {
  calendarPanel: ReactNode
  children: ReactNode
}

type Point = {
  x: number
  y: number
}

type ViewportRect = {
  width: number
  height: number
}

type ZoomSnapshot = {
  fitScale: number
  scale: number
  userZoom: number
}

type TransformMode = 'navigation' | 'zoom'

function getFitScale(width: number, height: number) {
  const widthRatio = width / PANEL_WIDTH
  const heightRatio = height / PANEL_HEIGHT

  return Math.min(widthRatio, heightRatio) * FIT_PADDING
}

function getNavigationPan(position: ViewportPosition, scale: number): Point {
  if (position === 'center') return { x: 0, y: 0 }

  const cameraOffset = getViewportCameraOffset(position)

  return {
    x: -cameraOffset.x * scale,
    y: -cameraOffset.y * scale,
  }
}

function getCameraTransform({ x, y }: Point) {
  return `translate(${Math.round(x)}px, ${Math.round(y)}px)`
}

function getScaleTransform(scale: number) {
  return `scale(${scale})`
}

function normalizeWheelDelta(event: WheelEvent, viewportHeight: number) {
  const modeMultiplier =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? WHEEL_LINE_HEIGHT
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? viewportHeight
        : 1

  return event.deltaY * modeMultiplier
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ColliderViewport({
  calendarPanel,
  children,
}: ColliderViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<ViewportPosition>('center')
  const zoomAnchorRef = useRef<Point>({ x: 0, y: 0 })
  const zoomRef = useRef<ZoomSnapshot>({
    fitScale: 1,
    scale: 1,
    userZoom: 1,
  })
  const viewportRectRef = useRef<ViewportRect>({
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
  })
  const pendingWheelDeltaRef = useRef(0)
  const wheelFrameRef = useRef<number | null>(null)
  const zoomTimerRef = useRef<number | null>(null)
  const navigationTimerRef = useRef<number | null>(null)
  const navigationLockedRef = useRef(false)
  const [position, setPosition] = useState<ViewportPosition>('center')
  const [isNavigationLocked, setIsNavigationLocked] = useState(false)

  const applyViewTransform = useCallback(
    (
      nextPosition: ViewportPosition,
      scale: number,
      mode: TransformMode = 'navigation',
    ) => {
      let pan: Point

      if (nextPosition === 'center') {
        pan = { x: 0, y: 0 }
        zoomAnchorRef.current = { x: 0, y: 0 }
      } else {
        const cameraOffset = getViewportCameraOffset(nextPosition)

        if (mode === 'zoom') {
          pan = {
            x: zoomAnchorRef.current.x - cameraOffset.x * scale,
            y: zoomAnchorRef.current.y - cameraOffset.y * scale,
          }
        } else {
          pan = getNavigationPan(nextPosition, scale)
          zoomAnchorRef.current = {
            x: pan.x + cameraOffset.x * scale,
            y: pan.y + cameraOffset.y * scale,
          }
        }
      }

      cameraRef.current?.style.setProperty('transform', getCameraTransform(pan))
      scaleRef.current?.style.setProperty('transform', getScaleTransform(scale))
    },
    [],
  )

  const updateFitScale = useCallback(() => {
    const viewportElement = viewportRef.current

    if (viewportElement === null) return

    const viewportRect = viewportElement.getBoundingClientRect()
    const { width, height } = viewportRect
    const nextFitScale = getFitScale(width, height)
    const nextScale = nextFitScale * zoomRef.current.userZoom

    viewportRectRef.current = { width, height }
    zoomRef.current = {
      fitScale: nextFitScale,
      scale: nextScale,
      userZoom: zoomRef.current.userZoom,
    }
    applyViewTransform(positionRef.current, nextScale)
  }, [applyViewTransform])

  const finishNavigation = useCallback(() => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current)
      navigationTimerRef.current = null
    }

    navigationLockedRef.current = false
    setIsNavigationLocked(false)

    if (cameraRef.current !== null) {
      delete cameraRef.current.dataset.navigating
    }
  }, [])

  const clearPendingWheelInput = useCallback(() => {
    if (wheelFrameRef.current !== null) {
      window.cancelAnimationFrame(wheelFrameRef.current)
      wheelFrameRef.current = null
    }

    pendingWheelDeltaRef.current = 0
  }, [])

  const finishZoom = useCallback(() => {
    if (zoomTimerRef.current !== null) {
      window.clearTimeout(zoomTimerRef.current)
      zoomTimerRef.current = null
    }

    if (scaleRef.current !== null) {
      delete scaleRef.current.dataset.zooming
    }

    if (cameraRef.current !== null) {
      delete cameraRef.current.dataset.zooming
    }
  }, [])

  const applyPendingWheel = useCallback(() => {
    wheelFrameRef.current = null

    const wheelDelta = pendingWheelDeltaRef.current
    pendingWheelDeltaRef.current = 0

    if (wheelDelta === 0) return

    const currentZoom = zoomRef.current
    const nextUserZoom = wheelDelta > 0 ? MIN_USER_ZOOM : MAX_USER_ZOOM

    if (nextUserZoom === currentZoom.userZoom) return

    const nextScale = currentZoom.fitScale * nextUserZoom

    zoomRef.current = {
      fitScale: currentZoom.fitScale,
      scale: nextScale,
      userZoom: nextUserZoom,
    }

    if (scaleRef.current !== null) {
      scaleRef.current.dataset.zooming = ''
    }

    if (cameraRef.current !== null) {
      cameraRef.current.dataset.zooming = ''
    }

    applyViewTransform(positionRef.current, nextScale, 'zoom')

    if (zoomTimerRef.current !== null) {
      window.clearTimeout(zoomTimerRef.current)
    }

    zoomTimerRef.current = window.setTimeout(finishZoom, ZOOM_DURATION + 50)
  }, [applyViewTransform, finishZoom])

  const handleNavigate = (nextPosition: ViewportPosition) => {
    if (navigationLockedRef.current || nextPosition === positionRef.current) {
      return
    }

    clearPendingWheelInput()
    finishZoom()

    positionRef.current = nextPosition
    setPosition(nextPosition)

    if (prefersReducedMotion()) {
      applyViewTransform(nextPosition, zoomRef.current.scale)
      return
    }

    navigationLockedRef.current = true
    setIsNavigationLocked(true)

    if (cameraRef.current !== null) {
      cameraRef.current.dataset.navigating = ''
    }

    applyViewTransform(nextPosition, zoomRef.current.scale)
    navigationTimerRef.current = window.setTimeout(
      finishNavigation,
      NAVIGATION_DURATION + 100,
    )
  }

  const handleCameraTransitionEnd = (
    event: TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'transform'
    ) {
      return
    }

    finishNavigation()
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current

    if (viewport === null) return

    updateFitScale()

    let resizeTimer: number | null = null
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer)
      }

      resizeTimer = window.setTimeout(() => {
        resizeTimer = null
        finishNavigation()
        updateFitScale()
      }, RESIZE_SETTLE_DELAY)
    })

    resizeObserver.observe(viewport)

    return () => {
      resizeObserver.disconnect()

      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer)
      }
    }
  }, [finishNavigation, updateFitScale])

  useEffect(() => {
    const viewport = viewportRef.current

    if (viewport === null) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      if (navigationLockedRef.current) return

      const wheelDelta = normalizeWheelDelta(
        event,
        viewportRectRef.current.height,
      )

      if (wheelDelta === 0) return

      pendingWheelDeltaRef.current += wheelDelta

      if (wheelFrameRef.current === null) {
        wheelFrameRef.current = window.requestAnimationFrame(applyPendingWheel)
      }
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      viewport.removeEventListener('wheel', handleWheel)
      clearPendingWheelInput()
    }
  }, [applyPendingWheel, clearPendingWheelInput])

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current)
      }

      if (zoomTimerRef.current !== null) {
        window.clearTimeout(zoomTimerRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.viewport} ref={viewportRef}>
      <div
        className={styles.cameraLayer}
        ref={cameraRef}
        onTransitionEnd={handleCameraTransitionEnd}
      >
        <div className={styles.scaleLayer} ref={scaleRef}>
          <div className={styles.colliderFrame}>{children}</div>
          <ViewportDestinations calendarPanel={calendarPanel} />
        </div>
      </div>

      <ViewportNavigation
        isLocked={isNavigationLocked}
        position={position}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
