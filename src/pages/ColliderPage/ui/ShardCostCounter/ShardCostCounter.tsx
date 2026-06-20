import styles from './ShardCostCounter.module.scss'

type ShardCostCounterProps = {
  value: number
}

const formatCostValue = (value: number) => {
  const normalizedValue = Math.max(0, Math.floor(value))

  return normalizedValue.toString().padStart(4, '0')
}

const getFirstActiveDigitIndex = (formattedValue: string) => {
  const firstNonZeroDigitIndex = formattedValue.search(/[1-9]/)

  return firstNonZeroDigitIndex === -1
    ? formattedValue.length - 1
    : firstNonZeroDigitIndex
}

export function ShardCostCounter({ value }: ShardCostCounterProps) {
  const formattedValue = formatCostValue(value)
  const firstActiveDigitIndex = getFirstActiveDigitIndex(formattedValue)

  return (
    <div className={styles.counter}>
      <div className={styles.display}>
        {formattedValue.split('').map((digit, digitIndex) => (
          <span className={styles.digitSlot} key={`${digit}-${digitIndex}`}>
            <span
              className={`${styles.digit} ${digitIndex < firstActiveDigitIndex ? styles.zeroDigit : styles.activeDigit}`}
            >
              {digit}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
