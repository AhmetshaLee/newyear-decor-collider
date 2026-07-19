import styles from './ViewportZoomToolbar.module.scss'

type ViewportZoomToolbarProps = {
  className?: string
  userZoomPercent: number
  realScalePercent: number
  canZoomOut: boolean
  canZoomIn: boolean
  onZoomOut: () => void
  onZoomIn: () => void
  onReset: () => void
}

export function ViewportZoomToolbar({
  className,
  userZoomPercent,
  realScalePercent,
  canZoomOut,
  canZoomIn,
  onZoomOut,
  onZoomIn,
  onReset,
}: ViewportZoomToolbarProps) {
  const toolbarClassName =
    className === undefined ? styles.toolbar : `${styles.toolbar} ${className}`

  return (
    <div className={toolbarClassName}>
      <button
        className={styles.button}
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title="Уменьшить масштаб"
      >
        -
      </button>
      <button
        className={styles.button}
        type="button"
        onClick={onReset}
        title="Сбросить масштаб"
      >
        R
      </button>
      <button
        className={styles.button}
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title="Увеличить масштаб"
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
