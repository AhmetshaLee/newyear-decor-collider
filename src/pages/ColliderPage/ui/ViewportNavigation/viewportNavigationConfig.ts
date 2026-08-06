export type ViewportPosition = 'center' | 'top' | 'right' | 'bottom' | 'left'

export type ViewportDirection = Exclude<ViewportPosition, 'center'>

type Point = {
  x: number
  y: number
}

type DestinationConfig = {
  label: string
  ariaLabel: string
  offset: Point
  cameraOffset: Point
  width: number
  height: number
}

export const VIEWPORT_DIRECTIONS = [
  'top',
  'right',
  'bottom',
  'left',
] as const satisfies readonly ViewportDirection[]

export const DESTINATION_CONFIG = {
  top: {
    label: '?',
    ariaLabel: 'Перейти к верхней панели',
    offset: { x: 0, y: -758 },
    cameraOffset: { x: 0, y: -758 },
    width: 1000,
    height: 520,
  },
  right: {
    label: 'Календарь',
    ariaLabel: 'Перейти к панели календаря',
    offset: { x: 1138, y: 180 },
    cameraOffset: { x: 1138, y: 0 },
    width: 720,
    height: 360,
  },
  bottom: {
    label: '?',
    ariaLabel: 'Перейти к нижней панели',
    offset: { x: 0, y: 758 },
    cameraOffset: { x: 0, y: 758 },
    width: 1000,
    height: 520,
  },
  left: {
    label: 'Ёлка',
    ariaLabel: 'Перейти к панели ёлки',
    offset: { x: -1258, y: 0 },
    cameraOffset: { x: -1258, y: 0 },
    width: 960,
    height: 720,
  },
} as const satisfies Record<ViewportDirection, DestinationConfig>

export function getViewportDestinationOffset(
  position: ViewportDirection,
): Point {
  return DESTINATION_CONFIG[position].offset
}

export function getViewportCameraOffset(position: ViewportDirection): Point {
  return DESTINATION_CONFIG[position].cameraOffset
}
