import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ViewportZoomToolbar } from '../ViewportZoomToolbar'
import { RouteNavigationToolbar } from '@/shared/ui/RouteNavigationToolbar'

import styles from './ColliderViewport.module.scss'

const PANEL_WIDTH = 1280
const PANEL_HEIGHT = 720
const FIT_PADDING = 0.92
const MIN_SCALE = 0.5
const MAX_SCALE = 2
const USER_ZOOM_STEP = 0.1
const MIN_USER_ZOOM = 0.5
const MAX_USER_ZOOM = 2

type ColliderViewportProps = {
  children: ReactNode
}

function clampScale(scale: number) {
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE)
}

function clampUserZoom(zoom: number) {
  const roundedZoom = Number(zoom.toFixed(1))

  return Math.min(Math.max(roundedZoom, MIN_USER_ZOOM), MAX_USER_ZOOM)
}

function getFitScale(width: number, height: number) {
  const widthRatio = width / PANEL_WIDTH
  const heightRatio = height / PANEL_HEIGHT
  const scaleToFitPanel = Math.min(widthRatio, heightRatio)

  return clampScale(scaleToFitPanel * FIT_PADDING)
}

export function ColliderViewport({ children }: ColliderViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [fitScale, setFitScale] = useState(1)
  const [userZoom, setUserZoom] = useState(1)

  const updateFitScale = useCallback(() => {
    const viewportElement = viewportRef.current

    if (!viewportElement) {
      return
    }

    const { width, height } = viewportElement.getBoundingClientRect()

    setFitScale(getFitScale(width, height))
  }, [])

  const scale = useMemo(
    () => clampScale(fitScale * userZoom),
    [fitScale, userZoom],
  )

  const zoomOut = () => {
    setUserZoom((currentZoom) => clampUserZoom(currentZoom - USER_ZOOM_STEP))
  }

  const zoomIn = () => {
    setUserZoom((currentZoom) => clampUserZoom(currentZoom + USER_ZOOM_STEP))
  }

  const resetZoom = () => {
    updateFitScale()
    setUserZoom(1)
  }

  useLayoutEffect(() => {
    updateFitScale()
  }, [updateFitScale])

  return (
    <div className={styles.viewport} ref={viewportRef}>
      <div
        className={styles.panelLayer}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>

      <div className={styles.overlay}>
        <div className={styles.overlayControls}>
          <RouteNavigationToolbar className={styles.routeNavigationToolbar} />
          <ViewportZoomToolbar
            className={styles.zoomToolbar}
            userZoomPercent={Math.round(userZoom * 100)}
            realScalePercent={Math.round(scale * 100)}
            canZoomOut={scale > MIN_SCALE}
            canZoomIn={scale < MAX_SCALE}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
            onReset={resetZoom}
          />
        </div>
      </div>
    </div>
  )
}
