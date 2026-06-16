import styles from './ColliderZoomToolbar.module.scss'

type ColliderZoomToolbarProps = {
  userZoomPercent: number
  realScalePercent: number
  canZoomOut: boolean
  canZoomIn: boolean
  onZoomOut: () => void
  onZoomIn: () => void
  onReset: () => void
}

export function ColliderZoomToolbar({
  userZoomPercent,
  realScalePercent,
  canZoomOut,
  canZoomIn,
  onZoomOut,
  onZoomIn,
  onReset,
}: ColliderZoomToolbarProps) {
  return (
    <div className={styles.toolbar} aria-label="Collider viewport controls">
      <button
        className={styles.button}
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title="Zoom out"
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        className={styles.button}
        type="button"
        onClick={onReset}
        title="Reset zoom"
        aria-label="Reset zoom"
      >
        R
      </button>
      <button
        className={styles.button}
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title="Zoom in"
        aria-label="Zoom in"
      >
        +
      </button>
      <span className={styles.zoomValue}>
        <span>{userZoomPercent}%</span>
        <span className={styles.realZoomValue}>[{realScalePercent}%]</span>
      </span>
    </div>
  )
}
