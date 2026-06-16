import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import styles from './ColliderPage.module.scss'

const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 720
const FIT_PADDING = 0.92
const MIN_SCALE = 0.5
const MAX_SCALE = 2
const USER_ZOOM_STEP = 0.1
const MIN_USER_ZOOM = 0.5
const MAX_USER_ZOOM = 2

function clampScale(scale: number) {
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE)
}

function clampUserZoom(zoom: number) {
  const roundedZoom = Number(zoom.toFixed(1))

  return Math.min(Math.max(roundedZoom, MIN_USER_ZOOM), MAX_USER_ZOOM)
}

function getFitScale(width: number, height: number) {
  const widthRatio = width / FRAME_WIDTH
  const heightRatio = height / FRAME_HEIGHT
  const scaleToFitFrame = Math.min(widthRatio, heightRatio)

  return clampScale(scaleToFitFrame * FIT_PADDING)
}

export function ColliderPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [fitScale, setFitScale] = useState(1)
  const [userZoom, setUserZoom] = useState(1)

  const updateFitScale = () => {
    const pageElement = pageRef.current

    if (!pageElement) {
      return
    }

    const { width, height } = pageElement.getBoundingClientRect()

    setFitScale(getFitScale(width, height))
  }

  
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
  }, [])
  
  return (
    <div className={styles.page} ref={pageRef}>
      <div
        className={styles.frameLayer}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <section className={styles.colliderFrame}>
          <h1 className={styles.title}>ColliderPage</h1>
        </section>
      </div>

      <div className={styles.overlay}>
        <div
          className={styles.zoomToolbar}
          aria-label="Collider viewport controls"
        >
          <button
            className={styles.zoomButton}
            type="button"
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            title="Zoom out"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            className={styles.zoomButton}
            type="button"
            onClick={resetZoom}
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            R
          </button>
          <button
            className={styles.zoomButton}
            type="button"
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            title="Zoom in"
            aria-label="Zoom in"
          >
            +
          </button>
          <span className={styles.zoomValue}>
            <span>{Math.round(userZoom * 100)}%</span>
            <span className={styles.realZoomValue}>
              [{Math.round(scale * 100)}%]
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
