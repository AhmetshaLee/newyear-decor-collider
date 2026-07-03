import { useMemo, useState } from 'react'
import { usePlayerProgress } from '@/entities/player-progress'
import {
  DECORATION_ALBUM_LABELS,
  DECORATION_ALBUM_VALUES,
  DECORATIONS_REGISTRY,
  type DecorationAlbum,
} from '@/shared/lib/decorations'

export function CollectionPage() {
  const { progress } = usePlayerProgress()
  const [selectedAlbum, setSelectedAlbum] = useState<DecorationAlbum>('classic')

  const unlockedCollectionIdSet = useMemo(() => {
    return new Set(progress.unlockedCollectionIds)
  }, [progress.unlockedCollectionIds])

  const totalDecorationsCount = DECORATIONS_REGISTRY.length
  const totalUnlockedCount = DECORATIONS_REGISTRY.filter((decoration) =>
    unlockedCollectionIdSet.has(decoration.id),
  ).length

  const selectedAlbumDecorations = DECORATIONS_REGISTRY.filter(
    (decoration) => decoration.album === selectedAlbum,
  )
  const selectedAlbumUnlockedCount = selectedAlbumDecorations.filter(
    (decoration) => unlockedCollectionIdSet.has(decoration.id),
  ).length
  const selectedAlbumProgressPercent =
    selectedAlbumDecorations.length === 0
      ? 0
      : Math.round(
          (selectedAlbumUnlockedCount / selectedAlbumDecorations.length) * 100,
        )

  return (
    <>
      <nav aria-label="Альбомы коллекции">
        {DECORATION_ALBUM_VALUES.map((album) => (
          <button
            key={album}
            type="button"
            onClick={() => setSelectedAlbum(album)}
            aria-pressed={selectedAlbum === album}
          >
            {DECORATION_ALBUM_LABELS[album]}
          </button>
        ))}
      </nav>

      <section aria-label="Прогресс коллекции">
        <p>
          Общий прогресс: {totalUnlockedCount} / {totalDecorationsCount}
        </p>
        <p>
          Прогресс альбома: {selectedAlbumUnlockedCount} /{' '}
          {selectedAlbumDecorations.length}
        </p>
        <p>Заполнение страницы: {selectedAlbumProgressPercent}%</p>
      </section>

      {selectedAlbumDecorations.length === 0 ? (
        <p>В этом альбоме пока нет утвержденных украшений.</p>
      ) : (
        <ul>
          {selectedAlbumDecorations.map((decoration) => {
            const isUnlocked = unlockedCollectionIdSet.has(decoration.id)

            return (
              <li key={decoration.id}>
                {isUnlocked ? (
                  <>
                    <h2>{decoration.name}</h2>
                    <p>{decoration.description}</p>
                    <p>Уровень: {decoration.level}</p>
                    <p>Тип: {decoration.type}</p>
                  </>
                ) : (
                  <>
                    <h2>Закрытая позиция</h2>
                    <p>
                      Создайте это украшение в Коллайдере, чтобы открыть
                      описание.
                    </p>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
