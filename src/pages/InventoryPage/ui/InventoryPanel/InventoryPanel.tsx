import { useMemo, useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import { useRecycleInventoryItems } from '@/features/recycle-inventory'
import { DECORATIONS_REGISTRY } from '@/shared/lib/decorations'
import { calculateRecycleShards } from '@/shared/lib/inventory'
import { InventoryDecoration } from '../InventoryDecoration'
import { InventorySlot } from '../InventorySlot'

import styles from './InventoryPanel.module.scss'

export function InventoryPanel() {
  const { progress } = usePlayerProgress()
  const { recycleItems } = useRecycleInventoryItems()
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    () => new Set<string>(),
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

  const handleRecycleSelectedItems = () => {
    if (selectedItems.length === 0) return

    const result = recycleItems(selectedItems.map((item) => item.id))

    if (result.status === 'success') {
      setSelectedItemIds(new Set<string>())
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <div className={styles.shardsCounter}>
            Осколков в наличии: {userShards}
          </div>

          <div className={styles.itemsCounter}>
            <button type="button" className={styles.filterButton} disabled>
              ▾
            </button>
            <span>
              Показано: {visibleItemsCount} / {totalItemsCount}
            </span>
          </div>
        </header>

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

        <footer className={styles.actionBar}>
          <p className={styles.hint}>
            Вам хватает осколков на создание нового украшения.
          </p>

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
            onClick={handleRecycleSelectedItems}
            disabled={selectedItems.length === 0}
          >
            + Осколков: {recycleShardsPreview}
          </button>
        </footer>
      </div>
    </section>
  )
}
