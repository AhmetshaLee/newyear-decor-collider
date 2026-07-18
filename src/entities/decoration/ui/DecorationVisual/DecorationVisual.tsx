import type { Decoration } from '../../model/decorationsRegistry'

import styles from './DecorationVisual.module.scss'

type DecorationVisualProps = {
  decoration: Decoration | undefined
  className?: string
}

function getFallbackSymbol(decoration: Decoration | undefined) {
  if (decoration === undefined) return '?'

  return (
    Array.from(decoration.name.trim())[0]?.toLocaleUpperCase('ru-RU') ?? '?'
  )
}

export function DecorationVisual({
  decoration,
  className,
}: DecorationVisualProps) {
  const visualClassName =
    className === undefined ? styles.visual : `${styles.visual} ${className}`

  return (
    <span className={visualClassName}>{getFallbackSymbol(decoration)}</span>
  )
}
