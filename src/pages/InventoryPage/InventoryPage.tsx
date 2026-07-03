import { usePlayerProgress } from '@/entities/player-progress'
import { DECORATIONS_REGISTRY } from '@/shared/lib/decorations'
import { useMemo } from 'react'

export function InventoryPage() {
  const { progress } = usePlayerProgress()

  const decorationsById = useMemo(() => {
    return new Map(
      DECORATIONS_REGISTRY.map((decoration) => [decoration.id, decoration]),
    )
  }, [])

  return (
    <main>
      <h1>Инвентарь</h1>
      {progress.inventory.length === 0 ? (
        <p>В инвентаре пока нет созданных украшений.</p>
      ) : (
        <ul>
          {progress.inventory.map((item) => {
            const decoration = decorationsById.get(item.decorationId)

            return (
              <li key={item.id}>
                {decoration === undefined ? (
                  <>
                    <h2>Неизвестное украшение</h2>
                    <p>ID из реестра: {item.decorationId}</p>
                  </>
                ) : (
                  <>
                    <h2>{decoration.name}</h2>
                    <p>{decoration.description}</p>
                    <p>Альбом: {decoration.album}</p>
                    <p>Уровень: {decoration.level}</p>
                    <p>Тип: {decoration.type}</p>
                  </>
                )}

                <p>Создано: {new Date(item.timestamp).toLocaleString()}</p>
                <p>Стоимость крафта: {item.craftCost}</p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
