import { useMemo, useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import { useRecycleInventoryItems } from '@/features/recycle-inventory'
import { DECORATIONS_REGISTRY } from '@/shared/lib/decorations'
import { calculateRecycleShards } from '@/shared/lib/inventory'
import { InventoryDecoration } from '../InventoryDecoration'
import { InventorySlot } from '../InventorySlot'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'

import styles from './InventoryPanel.module.scss'

type PendingRecycle = {
  itemIds: readonly string[]
  itemsCount: number
  gainedShards: number
}

export function InventoryPanel() {
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
  const totalItemsCount = inventoryItems.length
  const visibleItemsCount = inventoryItems.length
  const userShards = progress.userShards

  const selectedItems = inventoryItems.filter((item) =>
    selectedItemIds.has(item.id),
  )
  const isAllSelected =
    inventoryItems.length > 0 && selectedItems.length === inventoryItems.length

  const selectAllButtonClassName = isAllSelected
    ? `${styles.selectAllButton} ${styles.selectAllActive}`
    : styles.selectAllButton

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

      if (isEveryItemSelected) {
        return new Set<string>()
      }

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
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <div className={styles.summary}>
            <div className={styles.shardsCounter}>
              Осколков в наличии: {userShards}
            </div>

            <p className={styles.hint}>
              Вам хватает осколков на создание нового украшения.
            </p>
          </div>

          <div className={styles.actionBar}>
            <button
              type="button"
              className={selectAllButtonClassName}
              onClick={toggleAllSelection}
              disabled={inventoryItems.length === 0}
            >
              Выбрать все украшения
            </button>

            <button
              type="button"
              className={styles.recycleButton}
              onClick={openRecycleConfirmation}
              disabled={selectedItems.length === 0}
            >
              + Осколков: {recycleShardsPreview}
            </button>

            <div className={styles.itemsCounter}>
              <button type="button" className={styles.filterButton} disabled>
                ▾
              </button>
              <span>
                Показано: {visibleItemsCount} / {totalItemsCount}
              </span>
            </div>
          </div>
        </header>

        <div className={styles.box}>
          <div className={styles.gridScroller}>
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
        </div>
      </div>

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
