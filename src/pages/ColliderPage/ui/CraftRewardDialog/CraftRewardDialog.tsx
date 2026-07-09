import type { Decoration } from '@/shared/lib/decorations'
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
        <div className={styles.preview} data-decoration-type={decoration.type}>
          <span className={styles.previewSymbol}>
            {decoration.name.slice(0, 1)}
          </span>
        </div>
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
