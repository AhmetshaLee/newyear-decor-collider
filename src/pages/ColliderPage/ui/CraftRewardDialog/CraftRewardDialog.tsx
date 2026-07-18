import {
  DecorationSlot,
  DecorationVisual,
  type Decoration,
} from '@/entities/decoration'
import { RewardDialog } from '@/shared/ui/RewardDialog'

import styles from './CraftRewardDialog.module.scss'

type CraftRewardDialogProps = {
  decoration: Decoration
  onClose: () => void
}

export function CraftRewardDialog({
  decoration,
  onClose,
}: CraftRewardDialogProps) {
  return (
    <RewardDialog
      isOpen={true}
      onClose={onClose}
      title="Украшение создано"
      visualSlot={
        <DecorationSlot className={styles.preview} level={decoration.level}>
          <DecorationVisual decoration={decoration} />
        </DecorationSlot>
      }
      actionsSlot={
        <button type="button" className={styles.takeButton} onClick={onClose}>
          Забрать
        </button>
      }
    >
      <p className={styles.name}>{decoration.name}</p>
    </RewardDialog>
  )
}
