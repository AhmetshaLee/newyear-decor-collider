import styles from './ColliderPage.module.scss'

export function ColliderPage() {
  return (
    <main className={styles.page}>
      <section className={styles.device}>
        <h1 className={styles.title}>ColliderPage</h1>

        <div className={styles.legs} aria-hidden="true">
          <span className={styles.leg} />
          <span className={styles.leg} />
        </div>
      </section>
    </main>
  )
}