import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { ViewportZoomToolbar } from '../ViewportZoomToolbar'

import styles from './ColliderViewport.module.scss'

const PANEL_WIDTH = 1280
const PANEL_HEIGHT = 720
const FIT_PADDING = 0.92
const MIN_SCALE = 0.5
const MAX_SCALE = 2
const USER_ZOOM_STEP = 0.1
const MIN_USER_ZOOM = 0.5
const MAX_USER_ZOOM = 2
const WHEEL_ZOOM_SENSITIVITY = 0.001
const MAX_WHEEL_DELTA = 100
const WHEEL_LINE_HEIGHT = 16
const WHEEL_COMPOSITING_IDLE = 180
const PAN_BLOCKING_SELECTOR =
  'button, a, input, select, textarea, dialog, [contenteditable="true"]'

type ColliderViewportProps = {
  children: ReactNode
}

type Point = {
  x: number
  y: number
}

type Drag = Point & {
  pointerId: number
}

type ViewportRect = Point & {
  width: number
  height: number
}

type PendingWheel = Point & {
  delta: number
}

function clampScale(scale: number) {
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE)
}

function clampUserZoom(zoom: number) {
  return Math.min(Math.max(zoom, MIN_USER_ZOOM), MAX_USER_ZOOM)
}

function getFitScale(width: number, height: number) {
  const widthRatio = width / PANEL_WIDTH
  const heightRatio = height / PANEL_HEIGHT
  const scaleToFitPanel = Math.min(widthRatio, heightRatio)

  return clampScale(scaleToFitPanel * FIT_PADDING)
}

function getPanelTransform({ x, y }: Point, scale: number) {
  return `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`
}

function getAnchoredPan(
  pan: Point,
  anchor: Point,
  currentScale: number,
  nextScale: number,
) {
  const scaleRatio = nextScale / currentScale

  return {
    x: anchor.x - (anchor.x - pan.x) * scaleRatio,
    y: anchor.y - (anchor.y - pan.y) * scaleRatio,
  }
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

function blocksPanning(target: EventTarget) {
  return (
    target instanceof Element && target.closest(PAN_BLOCKING_SELECTOR) !== null
  )
}

export function ColliderViewport({ children }: ColliderViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panRef = useRef<Point>({ x: 0, y: 0 })
  const dragRef = useRef<Drag | null>(null)
  const fitScaleRef = useRef(1)
  const userZoomRef = useRef(1)
  const viewportRectRef = useRef<ViewportRect>({
    x: 0,
    y: 0,
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
  })
  const pendingWheelRef = useRef<PendingWheel | null>(null)
  const wheelFrameRef = useRef<number | null>(null)
  const wheelIdleRef = useRef<number | null>(null)
  const [fitScale, setFitScale] = useState(1)
  const [userZoom, setUserZoom] = useState(1)

  const updateFitScale = useCallback(() => {
    const viewportElement = viewportRef.current

    if (!viewportElement) return

    const viewportRect = viewportElement.getBoundingClientRect()
    const { width, height } = viewportRect
    const nextFitScale = getFitScale(width, height)

    viewportRectRef.current = {
      x: viewportRect.left,
      y: viewportRect.top,
      width,
      height,
    }
    fitScaleRef.current = nextFitScale
    setFitScale(nextFitScale)
    panelRef.current?.style.setProperty(
      'transform',
      getPanelTransform(
        panRef.current,
        clampScale(nextFitScale * userZoomRef.current),
      ),
    )

    return nextFitScale
  }, [])

  const scale = useMemo(
    () => clampScale(fitScale * userZoom),
    [fitScale, userZoom],
  )

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || blocksPanning(event.target)) return

    event.currentTarget.dataset.panning = ''
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const panel = panelRef.current

    if (drag === null || drag.pointerId !== event.pointerId || panel === null) {
      return
    }

    panRef.current.x += event.clientX - drag.x
    panRef.current.y += event.clientY - drag.y
    drag.x = event.clientX
    drag.y = event.clientY
    panel.style.transform = getPanelTransform(
      panRef.current,
      clampScale(fitScaleRef.current * userZoomRef.current),
    )
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return

    dragRef.current = null
    delete event.currentTarget.dataset.panning
  }

  const changeZoom = useCallback((nextZoom: number, anchor: Point) => {
    const clampedZoom = clampUserZoom(nextZoom)
    const currentScale = clampScale(fitScaleRef.current * userZoomRef.current)
    const nextScale = clampScale(fitScaleRef.current * clampedZoom)

    if (currentScale === nextScale) return

    const nextPan = getAnchoredPan(
      panRef.current,
      anchor,
      currentScale,
      nextScale,
    )

    panRef.current = nextPan
    userZoomRef.current = clampedZoom
    panelRef.current?.style.setProperty(
      'transform',
      getPanelTransform(nextPan, nextScale),
    )
    setUserZoom(clampedZoom)
  }, [])

  const applyPendingWheel = useCallback(() => {
    wheelFrameRef.current = null

    const pendingWheel = pendingWheelRef.current

    pendingWheelRef.current = null

    if (pendingWheel === null) return

    const wheelDelta = Math.min(
      Math.max(pendingWheel.delta, -MAX_WHEEL_DELTA),
      MAX_WHEEL_DELTA,
    )
    const zoomFactor = Math.exp(-wheelDelta * WHEEL_ZOOM_SENSITIVITY)
    const viewportRect = viewportRectRef.current
    const anchor = {
      x: pendingWheel.x - viewportRect.x - viewportRect.width / 2,
      y: pendingWheel.y - viewportRect.y - viewportRect.height / 2,
    }

    changeZoom(userZoomRef.current * zoomFactor, anchor)
  }, [changeZoom])

  const zoomOut = () => {
    changeZoom(Number((userZoomRef.current - USER_ZOOM_STEP).toFixed(3)), {
      x: 0,
      y: 0,
    })
  }

  const zoomIn = () => {
    changeZoom(Number((userZoomRef.current + USER_ZOOM_STEP).toFixed(3)), {
      x: 0,
      y: 0,
    })
  }

  const resetView = () => {
    if (wheelFrameRef.current !== null) {
      window.cancelAnimationFrame(wheelFrameRef.current)
      wheelFrameRef.current = null
      pendingWheelRef.current = null
    }

    if (wheelIdleRef.current !== null) {
      window.clearTimeout(wheelIdleRef.current)
      wheelIdleRef.current = null
      delete viewportRef.current?.dataset.zooming
    }

    const nextFitScale = updateFitScale() ?? fitScaleRef.current

    panRef.current = { x: 0, y: 0 }
    userZoomRef.current = 1
    setUserZoom(1)
    panelRef.current?.style.setProperty(
      'transform',
      getPanelTransform(panRef.current, nextFitScale),
    )
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current

    if (viewport === null) return

    updateFitScale()

    const resizeObserver = new ResizeObserver(() => updateFitScale())

    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [updateFitScale])

  useEffect(() => {
    const viewport = viewportRef.current

    if (viewport === null) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      const wheelDelta = normalizeWheelDelta(
        event,
        viewportRectRef.current.height,
      )

      if (wheelDelta === 0) return

      if (!viewport.hasAttribute('data-zooming')) {
        viewport.dataset.zooming = ''
      }

      if (wheelIdleRef.current !== null) {
        window.clearTimeout(wheelIdleRef.current)
      }

      wheelIdleRef.current = window.setTimeout(() => {
        delete viewport.dataset.zooming
        wheelIdleRef.current = null
      }, WHEEL_COMPOSITING_IDLE)

      const pendingWheel = pendingWheelRef.current

      pendingWheelRef.current = {
        x: event.clientX,
        y: event.clientY,
        delta: (pendingWheel?.delta ?? 0) + wheelDelta,
      }

      if (wheelFrameRef.current === null) {
        wheelFrameRef.current = window.requestAnimationFrame(applyPendingWheel)
      }
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      viewport.removeEventListener('wheel', handleWheel)

      if (wheelFrameRef.current !== null) {
        window.cancelAnimationFrame(wheelFrameRef.current)
        wheelFrameRef.current = null
      }

      if (wheelIdleRef.current !== null) {
        window.clearTimeout(wheelIdleRef.current)
        wheelIdleRef.current = null
      }

      pendingWheelRef.current = null
      delete viewport.dataset.zooming
    }
  }, [applyPendingWheel])

  return (
    <div
      className={styles.viewport}
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={viewportRef}
    >
      <div className={styles.panelLayer} ref={panelRef}>
        {children}
      </div>

      <div
        className={styles.overlay}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className={styles.overlayControls}>
          <ViewportZoomToolbar
            className={styles.zoomToolbar}
            userZoomPercent={Math.round(userZoom * 100)}
            realScalePercent={Math.round(scale * 100)}
            canZoomOut={scale > MIN_SCALE}
            canZoomIn={scale < MAX_SCALE}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
            onReset={resetView}
          />
        </div>
      </div>
    </div>
  )
}
