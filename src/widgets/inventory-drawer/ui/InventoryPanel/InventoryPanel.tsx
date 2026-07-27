import { useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import {
  DecorationSlot,
  DecorationVisual,
  getDecorationById,
} from '@/entities/decoration'
import {
  calculateDecorationRecycleValue,
  useRecycleInventoryItems,
} from '@/features/recycle-inventory'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'

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

  const inventoryItems = progress.inventory
  const inventoryEntries = inventoryItems.map((item) => ({
    item,
    decoration: getDecorationById(item.decorationId),
  }))
  const recyclableEntries = inventoryEntries.flatMap(({ item, decoration }) =>
    decoration === undefined ? [] : [{ item, decoration }],
  )
  const selectedEntries = recyclableEntries.filter(({ item }) =>
    selectedItemIds.has(item.id),
  )
  const isAllSelected =
    recyclableEntries.length > 0 &&
    selectedEntries.length === recyclableEntries.length
  const recycleShards = selectedEntries.reduce(
    (shards, { decoration }) =>
      shards + calculateDecorationRecycleValue(decoration),
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
        recyclableEntries.length > 0 &&
        recyclableEntries.every(({ item }) => currentIds.has(item.id))

      if (isEveryItemSelected) return new Set<string>()

      return new Set(recyclableEntries.map(({ item }) => item.id))
    })
  }

  const openRecycleConfirmation = () => {
    if (selectedEntries.length === 0) return

    setPendingRecycle({
      itemIds: selectedEntries.map(({ item }) => item.id),
      itemsCount: selectedEntries.length,
      gainedShards: recycleShards,
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
            disabled={recyclableEntries.length === 0}
            onClick={toggleAllSelection}
          >
            {isAllSelected ? 'Снять выбор' : 'Выбрать всё'}
          </button>

          <button
            className={`${styles.actionButton} ${styles.recycleButton}`}
            type="button"
            disabled={selectedEntries.length === 0}
            onClick={openRecycleConfirmation}
          >
            Разбить: +{recycleShards}
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
            {inventoryEntries.map(({ item, decoration }) => {
              const isUnknown = decoration === undefined
              const isSelected = !isUnknown && selectedItemIds.has(item.id)
              const itemName = decoration?.name ?? 'Неизвестное украшение'
              const itemSlotClassName = isSelected
                ? `${styles.itemSlot} ${styles.selectedItemSlot}`
                : styles.itemSlot
              const itemNameClassName =
                decoration === undefined
                  ? `${styles.itemName} ${styles.unknownItemName}`
                  : styles.itemName

              return (
                <button
                  className={styles.itemControl}
                  disabled={isUnknown}
                  key={item.id}
                  onClick={() => toggleItemSelection(item.id)}
                  title={itemName}
                  type="button"
                >
                  <DecorationSlot
                    className={itemSlotClassName}
                    level={decoration?.level}
                  >
                    <DecorationVisual decoration={decoration} />
                    <span className={itemNameClassName}>{itemName}</span>
                    <span className={styles.checkmark}>✓</span>
                  </DecorationSlot>
                </button>
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
