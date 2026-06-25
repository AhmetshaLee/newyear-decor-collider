import { useState, type CSSProperties } from 'react'

import styles from './RotorAnchorSwitch.module.scss'

export type RotorAnchorSwitchArc = {
  radius: number
  startAngle: number
  endAngle: number
}

export type RotorAnchorSwitchItem<TValue extends string> = {
  value: TValue
  icon: string
}

type RotorAnchorSwitchProps<TValue extends string> = {
  arc: RotorAnchorSwitchArc
  className?: string
  items: RotorAnchorSwitchItem<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
}

const ITEM_RADIUS_OFFSET = 32
const FULL_CIRCLE = 360
const FULL_CIRCLE_EPSILON = 0.001

function getPoint(angle: number, radius: number) {
  const angleRadians = (angle * Math.PI) / 180

  return {
    x: Math.cos(angleRadians) * radius,
    y: Math.sin(angleRadians) * radius,
  }
}

function isFullCircle(startAngle: number, endAngle: number) {
  const span = Math.abs(endAngle - startAngle)

  return span > 0 && Math.abs(span % FULL_CIRCLE) < FULL_CIRCLE_EPSILON
}

function getDirectedSpan(arc: RotorAnchorSwitchArc) {
  const span = arc.endAngle - arc.startAngle

  if (isFullCircle(arc.startAngle, arc.endAngle)) {
    return span >= 0 ? FULL_CIRCLE : -FULL_CIRCLE
  }

  return span
}

function getStepAngle(
  index: number,
  count: number,
  arc: RotorAnchorSwitchArc,
) {
  if (count <= 1) {
    return arc.startAngle
  }

  const span = getDirectedSpan(arc)
  const divisor = isFullCircle(arc.startAngle, arc.endAngle)
    ? count
    : count - 1

  return arc.startAngle + (span / divisor) * index
}

function getArcPath(arc: RotorAnchorSwitchArc) {
  const span = getDirectedSpan(arc)
  const startPoint = getPoint(arc.startAngle, arc.radius)
  const sweepFlag = span >= 0 ? 1 : 0

  if (isFullCircle(arc.startAngle, arc.endAngle)) {
    const middlePoint = getPoint(
      arc.startAngle + span / 2,
      arc.radius,
    )

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

export function RotorAnchorSwitch<TValue extends string>({
  arc,
  className,
  items,
  value,
  onValueChange,
}: RotorAnchorSwitchProps<TValue>) {
  const [rotationOffset, setRotationOffset] = useState(0)

  const selectedIndex = items.findIndex((item) => item.value === value)
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0
  const selectedAngle = getStepAngle(safeSelectedIndex, items.length, arc)
  const isClosedArc = isFullCircle(arc.startAngle, arc.endAngle)
  const itemRadius = arc.radius + ITEM_RADIUS_OFFSET
  const knobAngle = selectedAngle + (isClosedArc ? rotationOffset : 0)

  const selectItem = (itemIndex: number) => {
    const item = items[itemIndex]

    if (!item) {
      return
    }

    if (isClosedArc && items.length > 1) {
      if (itemIndex < safeSelectedIndex) {
        setRotationOffset(
          (currentOffset) => currentOffset + getDirectedSpan(arc),
        )
      }
    }

    onValueChange(item.value)
  }

  const selectNextItem = () => {
    if (items.length === 0) {
      return
    }

    selectItem((safeSelectedIndex + 1) % items.length)
  }

  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
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

      {items.map((item, itemIndex) => {
        const tickAngle = getStepAngle(itemIndex, items.length, arc)
        const tickPoint = getPoint(tickAngle, arc.radius)

        return (
          <span
            className={styles.tick}
            key={item.value}
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

      {items.map((item, itemIndex) => {
        const itemAngle = getStepAngle(itemIndex, items.length, arc)
        const itemPoint = getPoint(itemAngle, itemRadius)
        const isSelected = item.value === value

        return (
          <button
            className={`${styles.item} ${isSelected ? styles.activeItem : ''}`}
            key={item.value}
            type="button"
            style={
              {
                '--item-x': `${itemPoint.x}px`,
                '--item-y': `${itemPoint.y}px`,
              } as CSSProperties
            }
            onClick={() => selectItem(itemIndex)}
          >
            <span className={styles.itemGlyph}>{item.icon}</span>
          </button>
        )
      })}

      <button
        className={styles.knob}
        type="button"
        onClick={selectNextItem}
      >
        <span className={styles.pointer} />
      </button>
    </div>
  )
}
