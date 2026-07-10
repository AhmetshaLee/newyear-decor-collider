import styles from './CraftButton.module.scss'

type CraftButtonProps = {
  isDisabled?: boolean
  isUnavailable?: boolean
  onClick?: () => void
}

export function CraftButton({
  isDisabled = false,
  isUnavailable,
  onClick,
}: CraftButtonProps) {
  const isVisuallyDisabled = isDisabled || isUnavailable

  const buttonClassName = isVisuallyDisabled
    ? `${styles.button} ${styles.disabled}`
    : styles.button

  const handleClick = () => {
    if (isDisabled) return

    onClick?.()
  }

  return (
    <button
      className={buttonClassName}
      type="button"
      aria-disabled={isVisuallyDisabled}
      onClick={handleClick}
    />
  )
}
