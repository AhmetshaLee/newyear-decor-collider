import { useState, type CSSProperties, type ReactNode } from 'react'

import styles from './RotarySwitch.module.scss'

export type RotarySwitchArc = {
  radius: number
  startAngle: number
  endAngle: number
}

type RotarySwitchProps<TValue extends string> = {
  arc: RotarySwitchArc
  className?: string
  isDisabled?: boolean
  values: readonly TValue[]
  value: TValue
  onValueChange: (value: TValue) => void
  renderValue: (value: TValue) => ReactNode
}

const ITEM_RADIUS_OFFSET = 32
const FULL_CIRCLE = 360
const FULL_CIRCLE_EPSILON = 0.001
const VERTICAL_AXIS_EPSILON = 0.001

function getPoint(angle: number, radius: number) {
  const angleRadians = (angle * Math.PI) / 180

  return {
    x: Math.cos(angleRadians) * radius,
    y: Math.sin(angleRadians) * radius,
  }
}

function getItemGrowthClass(itemX: number) {
  if (Math.abs(itemX) < VERTICAL_AXIS_EPSILON) {
    return styles.growCenter
  }

  return itemX > 0 ? styles.growRight : styles.growLeft
}

function isFullCircle(startAngle: number, endAngle: number) {
  const span = Math.abs(endAngle - startAngle)

  return span > 0 && Math.abs(span % FULL_CIRCLE) < FULL_CIRCLE_EPSILON
}

function getDirectedSpan(arc: RotarySwitchArc) {
  const span = arc.endAngle - arc.startAngle

  if (isFullCircle(arc.startAngle, arc.endAngle)) {
    return span >= 0 ? FULL_CIRCLE : -FULL_CIRCLE
  }

  return span
}

function getStepAngle(index: number, count: number, arc: RotarySwitchArc) {
  if (count <= 1) {
    return arc.startAngle
  }

  const span = getDirectedSpan(arc)
  const divisor = isFullCircle(arc.startAngle, arc.endAngle) ? count : count - 1

  return arc.startAngle + (span / divisor) * index
}

function getArcPath(arc: RotarySwitchArc) {
  const span = getDirectedSpan(arc)
  const startPoint = getPoint(arc.startAngle, arc.radius)
  const sweepFlag = span >= 0 ? 1 : 0

  if (isFullCircle(arc.startAngle, arc.endAngle)) {
    const middlePoint = getPoint(arc.startAngle + span / 2, arc.radius)

    return [
      `M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)}`,
      `A ${arc.radius} ${arc.radius} 0 1 ${sweepFlag}`,
      `${middlePoint.x.toFixed(2)} ${middlePoint.y.toFixed(2)}`,
      `A ${arc.radius} ${arc.radius} 0 1 ${sweepFlag}`,
      `${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)}`,
    ].join(' ')
  }

  const endPoint = getPoint(arc.startAngle + span, arc.radius)
  const largeArcFlag = Math.abs(span) > 180 ? 1 : 0

  return [
    `M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)}`,
    `A ${arc.radius} ${arc.radius} 0 ${largeArcFlag} ${sweepFlag}`,
    `${endPoint.x.toFixed(2)} ${endPoint.y.toFixed(2)}`,
  ].join(' ')
}

export function RotarySwitch<TValue extends string>({
  arc,
  className,
  isDisabled = false,
  values,
  value,
  onValueChange,
  renderValue,
}: RotarySwitchProps<TValue>) {
  const [rotationOffset, setRotationOffset] = useState(0)

  const selectedIndex = values.findIndex((itemValue) => itemValue === value)
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0
  const selectedAngle = getStepAngle(safeSelectedIndex, values.length, arc)
  const isClosedArc = isFullCircle(arc.startAngle, arc.endAngle)
  const itemRadius = arc.radius + ITEM_RADIUS_OFFSET
  const knobAngle = selectedAngle + (isClosedArc ? rotationOffset : 0)

  const selectItem = (itemIndex: number) => {
    if (isDisabled) {
      return
    }

    const itemValue = values[itemIndex]

    if (itemValue === undefined) {
      return
    }

    if (isClosedArc && values.length > 1) {
      if (itemIndex < safeSelectedIndex) {
        setRotationOffset(
          (currentOffset) => currentOffset + getDirectedSpan(arc),
        )
      }
    }

    onValueChange(itemValue)
  }

  const selectNextItem = () => {
    if (isDisabled) {
      return
    }

    if (values.length === 0) {
      return
    }

    selectItem((safeSelectedIndex + 1) % values.length)
  }

  return (
    <div
      className={`${styles.root} ${isDisabled ? styles.disabledRoot : ''} ${
        className ?? ''
      }`}
      style={
        {
          '--arc-size': `${arc.radius * 2}px`,
          '--knob-angle': `${knobAngle + 90}deg`,
        } as CSSProperties
      }
    >
      <svg
        className={styles.arcLayer}
        viewBox={`${-arc.radius} ${-arc.radius} ${arc.radius * 2} ${
          arc.radius * 2
        }`}
      >
        <path className={styles.arc} d={getArcPath(arc)} />
      </svg>

      {values.map((itemValue, itemIndex) => {
        const tickAngle = getStepAngle(itemIndex, values.length, arc)
        const tickPoint = getPoint(tickAngle, arc.radius)

        return (
          <span
            className={styles.tick}
            key={itemValue}
            style={
              {
                '--tick-angle': `${tickAngle}deg`,
                '--tick-x': `${tickPoint.x}px`,
                '--tick-y': `${tickPoint.y}px`,
              } as CSSProperties
            }
          />
        )
      })}

      {values.map((itemValue, itemIndex) => {
        const itemAngle = getStepAngle(itemIndex, values.length, arc)
        const itemPoint = getPoint(itemAngle, itemRadius)
        const isSelected = itemValue === value

        return (
          <div
            className={`${styles.itemAnchor} ${getItemGrowthClass(
              itemPoint.x,
            )}`}
            key={itemValue}
            style={
              {
                '--item-x': `${itemPoint.x}px`,
                '--item-y': `${itemPoint.y}px`,
              } as CSSProperties
            }
          >
            <button
              className={`${styles.item} ${
                isSelected ? styles.activeItem : ''
              }`}
              disabled={isDisabled}
              type="button"
              onClick={() => selectItem(itemIndex)}
            >
              <span className={styles.itemContent}>
                {renderValue(itemValue)}
              </span>
            </button>
          </div>
        )
      })}

      <button
        className={styles.knob}
        disabled={isDisabled}
        type="button"
        onClick={selectNextItem}
      >
        <span className={styles.pointer} />
      </button>
    </div>
  )
}
