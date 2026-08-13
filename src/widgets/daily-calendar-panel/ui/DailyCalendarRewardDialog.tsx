import { RewardDialog } from '@/shared/ui/RewardDialog'
import { ShardIcon } from '@/shared/ui/ShardIcon'
import styles from './DailyCalendarRewardDialog.module.scss'

type DailyCalendarRewardDialogProps = {
  amount: number
  onClose: () => void
}

export function DailyCalendarRewardDialog({
  amount,
  onClose,
}: DailyCalendarRewardDialogProps) {
  return (
    <RewardDialog
      actionsSlot={
        <button
          className={styles.button}
          type="button"
          onClick={onClose}
        >
          Забрать
        </button>
      }
      isOpen={true}
      onClose={onClose}
      title="Награда получена"
      visualSlot={
        <span className={styles.visual}>
          <ShardIcon className={styles.icon} />
        </span>
      }
    >
      <p className={styles.amount}>+{amount} осколков</p>
    </RewardDialog>
  )
}
