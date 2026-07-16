import { BaseDrawer } from '@/shared/ui/BaseDrawer'
import { CollectionPanel } from './CollectionPanel'

import styles from './CollectionDrawer.module.scss'

type CollectionDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CollectionDrawer({ isOpen, onClose }: CollectionDrawerProps) {
  return (
    <BaseDrawer
      contentClassName={styles.drawerContent}
      isOpen={isOpen}
      side="right"
      onClose={onClose}
    >
      <CollectionPanel onClose={onClose} />
    </BaseDrawer>
  )
}
