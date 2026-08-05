import type { CSSProperties } from 'react'
import {
  DESTINATION_CONFIG,
  VIEWPORT_DIRECTIONS,
  type ViewportDirection,
  type ViewportPosition,
} from './viewportNavigationConfig'

import styles from './ViewportNavigation.module.scss'

type ViewportNavigationProps = {
  position: ViewportPosition
  isLocked: boolean
  onNavigate: (position: ViewportPosition) => void
}

type DestinationStyle = CSSProperties &
  Record<
    | '--destination-x'
    | '--destination-y'
    | '--destination-width'
    | '--destination-height',
    string
  >

function getReturnDirection(position: ViewportDirection): ViewportDirection {
  if (position === 'top') return 'bottom'
  if (position === 'right') return 'left'
  if (position === 'bottom') return 'top'

  return 'right'
}

export function ViewportDestinations() {
  return (
    <div aria-hidden="true" className={styles.destinations}>
      {VIEWPORT_DIRECTIONS.map((direction) => {
        const config = DESTINATION_CONFIG[direction]
        const destinationStyle: DestinationStyle = {
          '--destination-x': `${config.offset.x}px`,
          '--destination-y': `${config.offset.y}px`,
          '--destination-width': `${config.width}px`,
          '--destination-height': `${config.height}px`,
        }

        return (
          <div
            className={styles.destination}
            data-direction={direction}
            key={direction}
            style={destinationStyle}
          >
            <span className={styles.destinationLabel}>{config.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ViewportNavigation({
  position,
  isLocked,
  onNavigate,
}: ViewportNavigationProps) {
  const visibleDirections =
    position === 'center' ? VIEWPORT_DIRECTIONS : [getReturnDirection(position)]

  return (
    <nav aria-label="Навигация по панелям" className={styles.navigation}>
      {VIEWPORT_DIRECTIONS.map((direction) => {
        const isVisible = visibleDirections.includes(direction)
        const isReturning = position !== 'center'

        if (!isVisible) return null

        return (
          <button
            aria-label={
              isReturning
                ? 'Вернуться к коллайдеру'
                : DESTINATION_CONFIG[direction].ariaLabel
            }
            className={styles.button}
            data-direction={direction}
            key={direction}
            type="button"
            disabled={isLocked}
            onClick={() => onNavigate(isReturning ? 'center' : direction)}
          >
            <span aria-hidden="true" className={styles.chevron} />
          </button>
        )
      })}
    </nav>
  )
}
