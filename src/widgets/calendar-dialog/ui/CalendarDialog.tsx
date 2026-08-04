import { BaseDialog } from '@/shared/ui/BaseDialog'

import styles from './CalendarDialog.module.scss'

type CalendarDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function CalendarDialog({ isOpen, onClose }: CalendarDialogProps) {
  return (
    <BaseDialog
      contentClassName={styles.content}
      isOpen={isOpen}
      onClose={onClose}
    >
      <section aria-label="Календарь" className={styles.calendarField} />
    </BaseDialog>
  )
}
