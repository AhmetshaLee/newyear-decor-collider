import styles from './InventoryPanel.module.scss'

export function InventoryPanel() {
  return (
    <section className={styles.panel} aria-label="Инвентарь украшений">
      <header className={styles.topBar}>
        <div className={styles.shardsCounter}>
          Осколков в наличии: <span aria-hidden="true">💎</span> 0
        </div>

        <div className={styles.itemsCounter}>
          <button
            type="button"
            className={styles.filterButton}
            disabled
            aria-label="Фильтр инвентаря"
          >
            ▾
          </button>
          <span>Показано: 0 / 0</span>
        </div>
      </header>

      <div className={styles.gridScroller}>
        <p className={styles.emptyState}>
          В инвентаре пока нет созданных украшений.
        </p>
      </div>

      <footer className={styles.actionBar}>
        <p className={styles.hint}>
          Вам хватает осколков на создание нового украшения.
        </p>

        <button
          type="button"
          className={styles.selectAllButton}
          disabled
          aria-pressed="false"
        >
          Выбрать все украшения
        </button>

        <button type="button" className={styles.recycleButton} disabled>
          + Осколков: 0
        </button>
      </footer>
    </section>
  )
}
