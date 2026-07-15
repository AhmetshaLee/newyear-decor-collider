import { useMemo, useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import { useRecycleInventoryItems } from '@/features/recycle-inventory'
import { DECORATIONS_REGISTRY } from '@/shared/lib/decorations'
import { calculateRecycleShards } from '@/shared/lib/inventory'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { InventoryDecoration } from '../InventoryDecoration'
import { InventorySlot } from '../InventorySlot'

import styles from './InventoryPanel.module.scss'

type InventoryPanelProps = {
  onClose: () => void
}

type PendingRecycle = {
  itemIds: readonly string[]
  itemsCount: number
  gainedShards: number
}

export function InventoryPanel({ onClose }: InventoryPanelProps) {
  const { progress } = usePlayerProgress()
  const { recycleItems } = useRecycleInventoryItems()
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    () => new Set<string>(),
  )
  const [pendingRecycle, setPendingRecycle] = useState<PendingRecycle | null>(
    null,
  )

  const decorationsById = useMemo(() => {
    return new Map(
      DECORATIONS_REGISTRY.map((decoration) => [decoration.id, decoration]),
    )
  }, [])

  const inventoryItems = progress.inventory
  const selectedItems = inventoryItems.filter((item) =>
    selectedItemIds.has(item.id),
  )

  const isAllSelected =
    inventoryItems.length > 0 && selectedItems.length === inventoryItems.length

  const recycleShardsPreview = selectedItems.reduce(
    (sum, item) => sum + calculateRecycleShards(item.craftCost),
    0,
  )

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(itemId)) nextIds.delete(itemId)
      else nextIds.add(itemId)

      return nextIds
    })
  }

  const toggleAllSelection = () => {
    setSelectedItemIds((currentIds) => {
      const isEveryItemSelected =
        inventoryItems.length > 0 &&
        inventoryItems.every((item) => currentIds.has(item.id))

      if (isEveryItemSelected) return new Set<string>()

      return new Set(inventoryItems.map((item) => item.id))
    })
  }

  const openRecycleConfirmation = () => {
    if (selectedItems.length === 0) return

    setPendingRecycle({
      itemIds: selectedItems.map((item) => item.id),
      itemsCount: selectedItems.length,
      gainedShards: recycleShardsPreview,
    })
  }

  const closeRecycleConfirmation = () => {
    setPendingRecycle(null)
  }

  const confirmRecycleSelectedItems = () => {
    if (pendingRecycle === null) return

    const result = recycleItems(pendingRecycle.itemIds)

    if (result.status === 'success') {
      setSelectedItemIds(new Set<string>())
    }

    setPendingRecycle(null)
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.info}>
          <h2 className={styles.title}>Инвентарь</h2>
          <span>Осколки: {progress.userShards}</span>
          <span>Украшений: {inventoryItems.length}</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            type="button"
            disabled={inventoryItems.length === 0}
            onClick={toggleAllSelection}
          >
            {isAllSelected ? 'Снять выбор' : 'Выбрать всё'}
          </button>

          <button
            className={`${styles.actionButton} ${styles.recycleButton}`}
            type="button"
            disabled={selectedItems.length === 0}
            onClick={openRecycleConfirmation}
          >
            Разбить: +{recycleShardsPreview}
          </button>

          <button
            className={styles.actionButton}
            type="button"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {inventoryItems.length === 0 ? (
          <p className={styles.emptyState}>
            В инвентаре пока нет созданных украшений.
          </p>
        ) : (
          <div className={styles.grid}>
            {inventoryItems.map((item) => {
              const decoration = decorationsById.get(item.decorationId)

              return (
                <InventorySlot
                  key={item.id}
                  decoration={decoration}
                  isSelected={selectedItemIds.has(item.id)}
                  onToggle={() => toggleItemSelection(item.id)}
                >
                  <InventoryDecoration decoration={decoration} />
                </InventorySlot>
              )
            })}
          </div>
        )}
      </div>

      <footer className={styles.footer} />

      {pendingRecycle !== null && (
        <ConfirmDialog
          confirmLabel="Разбить"
          isOpen={true}
          onCancel={closeRecycleConfirmation}
          onConfirm={confirmRecycleSelectedItems}
          title="Разбить выбранные украшения?"
        >
          <p>Выбрано украшений: {pendingRecycle.itemsCount}</p>
          <p>Будет начислено осколков: {pendingRecycle.gainedShards}</p>
          <p>Это действие нельзя отменить.</p>
        </ConfirmDialog>
      )}
    </section>
  )
}
