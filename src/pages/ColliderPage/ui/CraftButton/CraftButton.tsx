import styles from './CraftButton.module.scss'

type CraftButtonProps = {
  isDisabled?: boolean
  onClick?: () => void
}

export function CraftButton({ isDisabled = false, onClick }: CraftButtonProps) {
  const buttonClassName = isDisabled
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
      aria-disabled={isDisabled}
      onClick={handleClick}
    />
  )
}
