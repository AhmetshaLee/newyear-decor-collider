import { BaseDrawer } from '@/shared/ui/BaseDrawer'
import { InventoryPanel } from './InventoryPanel'

import styles from './InventoryDrawer.module.scss'

type InventoryDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function InventoryDrawer({ isOpen, onClose }: InventoryDrawerProps) {
  return (
    <BaseDrawer
      contentClassName={styles.drawerContent}
      isOpen={isOpen}
      side="bottom"
      onClose={onClose}
    >
      <InventoryPanel onClose={onClose} />
    </BaseDrawer>
  )
}
