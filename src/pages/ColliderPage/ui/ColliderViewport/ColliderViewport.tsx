import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
const MAX_SCALE = 1.25
const BUTTON_ZOOM_FACTOR = 1.2
const WHEEL_ZOOM_SENSITIVITY = 0.002
const MAX_WHEEL_DELTA = 100
const WHEEL_LINE_HEIGHT = 16
const WHEEL_COMPOSITING_IDLE = 180
const RESIZE_SETTLE_DELAY = 100
const MIN_VISIBLE_PANEL_RATIO = 0.25
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

type ZoomSnapshot = {
  fitScale: number
  scale: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function clampScale(scale: number) {
  return clamp(scale, MIN_SCALE, MAX_SCALE)
}

function getFitScale(width: number, height: number) {
  const widthRatio = width / PANEL_WIDTH
  const heightRatio = height / PANEL_HEIGHT
  const scaleToFitPanel = Math.min(widthRatio, heightRatio)

  return clamp(scaleToFitPanel * FIT_PADDING, MIN_SCALE, MAX_SCALE)
}

function getPanelTransform({ x, y }: Point, scale: number) {
  return `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`
}

function getConstrainedPan(pan: Point, viewport: ViewportRect, scale: number) {
  const panelWidth = PANEL_WIDTH * scale
  const panelHeight = PANEL_HEIGHT * scale
  const minVisibleWidth =
    Math.min(panelWidth, viewport.width) * MIN_VISIBLE_PANEL_RATIO
  const minVisibleHeight =
    Math.min(panelHeight, viewport.height) * MIN_VISIBLE_PANEL_RATIO
  const maxX = (viewport.width + panelWidth) / 2 - minVisibleWidth
  const maxY = (viewport.height + panelHeight) / 2 - minVisibleHeight

  return {
    x: Math.min(Math.max(pan.x, -maxX), maxX),
    y: Math.min(Math.max(pan.y, -maxY), maxY),
  }
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
  const zoomRef = useRef<ZoomSnapshot>({
    fitScale: 1,
    scale: 1,
  })
  const viewportRectRef = useRef<ViewportRect>({
    x: 0,
    y: 0,
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
  })
  const pendingWheelRef = useRef<PendingWheel | null>(null)
  const wheelFrameRef = useRef<number | null>(null)
  const wheelIdleRef = useRef<number | null>(null)
  const [zoom, setZoom] = useState<ZoomSnapshot>({
    fitScale: 1,
    scale: 1,
  })

  const updateFitScale = useCallback(() => {
    const viewportElement = viewportRef.current

    if (!viewportElement) return

    const viewportRect = viewportElement.getBoundingClientRect()
    const { width, height } = viewportRect
    const nextFitScale = getFitScale(width, height)
    const userZoom = zoomRef.current.scale / zoomRef.current.fitScale
    const nextScale = clampScale(nextFitScale * userZoom)
    const nextZoom = {
      fitScale: nextFitScale,
      scale: nextScale,
    }

    viewportRectRef.current = {
      x: viewportRect.left,
      y: viewportRect.top,
      width,
      height,
    }
    const nextPan = getConstrainedPan(
      panRef.current,
      viewportRectRef.current,
      nextScale,
    )

    panRef.current = nextPan
    zoomRef.current = nextZoom
    setZoom(nextZoom)
    panelRef.current?.style.setProperty(
      'transform',
      getPanelTransform(nextPan, nextScale),
    )

    return nextFitScale
  }, [])

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

    const { scale } = zoomRef.current
    const nextPan = getConstrainedPan(
      {
        x: panRef.current.x + event.clientX - drag.x,
        y: panRef.current.y + event.clientY - drag.y,
      },
      viewportRectRef.current,
      scale,
    )

    panRef.current = nextPan
    drag.x = event.clientX
    drag.y = event.clientY
    panel.style.transform = getPanelTransform(nextPan, scale)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return

    dragRef.current = null
    delete event.currentTarget.dataset.panning
  }

  const changeZoom = useCallback((scale: number, anchor: Point) => {
    const currentZoom = zoomRef.current
    const nextScale = clampScale(scale)

    if (currentZoom.scale === nextScale) return

    const nextZoom = {
      fitScale: currentZoom.fitScale,
      scale: nextScale,
    }

    const nextPan = getConstrainedPan(
      getAnchoredPan(panRef.current, anchor, currentZoom.scale, nextScale),
      viewportRectRef.current,
      nextScale,
    )

    panRef.current = nextPan
    zoomRef.current = nextZoom
    panelRef.current?.style.setProperty(
      'transform',
      getPanelTransform(nextPan, nextScale),
    )
    setZoom(nextZoom)
  }, [])

  const applyPendingWheel = useCallback(() => {
    wheelFrameRef.current = null

    const pendingWheel = pendingWheelRef.current

    pendingWheelRef.current = null

    if (pendingWheel === null) return

    const wheelDelta = clamp(
      pendingWheel.delta,
      -MAX_WHEEL_DELTA,
      MAX_WHEEL_DELTA,
    )
    const nextScale =
      zoomRef.current.scale * 2 ** (-wheelDelta * WHEEL_ZOOM_SENSITIVITY)
    const viewportRect = viewportRectRef.current
    const anchor = {
      x: pendingWheel.x - viewportRect.x - viewportRect.width / 2,
      y: pendingWheel.y - viewportRect.y - viewportRect.height / 2,
    }

    changeZoom(nextScale, anchor)
  }, [changeZoom])

  const clearPendingWheelInput = () => {
    if (wheelFrameRef.current !== null) {
      window.cancelAnimationFrame(wheelFrameRef.current)
      wheelFrameRef.current = null
    }

    pendingWheelRef.current = null
  }

  const zoomOut = () => {
    clearPendingWheelInput()
    changeZoom(zoomRef.current.scale / BUTTON_ZOOM_FACTOR, { x: 0, y: 0 })
  }

  const zoomIn = () => {
    clearPendingWheelInput()
    changeZoom(zoomRef.current.scale * BUTTON_ZOOM_FACTOR, { x: 0, y: 0 })
  }

  const resetView = () => {
    clearPendingWheelInput()

    if (wheelIdleRef.current !== null) {
      window.clearTimeout(wheelIdleRef.current)
      wheelIdleRef.current = null
      delete viewportRef.current?.dataset.zooming
    }

    const nextFitScale = updateFitScale() ?? zoomRef.current.fitScale
    const nextZoom = {
      fitScale: nextFitScale,
      scale: nextFitScale,
    }

    panRef.current = { x: 0, y: 0 }
    zoomRef.current = nextZoom
    setZoom(nextZoom)
    panelRef.current?.style.setProperty(
      'transform',
      getPanelTransform(panRef.current, nextFitScale),
    )
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
            zoomPercent={Math.round(zoom.scale * 100)}
            canZoomOut={zoom.scale > MIN_SCALE}
            canZoomIn={zoom.scale < MAX_SCALE}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
            onReset={resetView}
          />
        </div>
      </div>
    </div>
  )
}
