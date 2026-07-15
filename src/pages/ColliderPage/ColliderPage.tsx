import { useNavigate } from 'react-router'
import { ColliderPanel } from './ui/ColliderPanel'
import { ColliderViewport } from './ui/ColliderViewport'
import { useColliderPanel } from './model/useColliderPanel'
import { InventoryDrawer } from '@/widgets/inventory-drawer'

export function ColliderPage() {
  const navigate = useNavigate()
  const { closePanel, isInventoryOpen, openInventory } = useColliderPanel()

  // TODO: убрать после добавления панели коллекций
  const openLegacyCollection = () => {
    navigate('/collection')
  }

  return (
    <>
      <ColliderViewport>
        <ColliderPanel
          onOpenCollection={openLegacyCollection}
          onOpenInventory={openInventory}
        />
      </ColliderViewport>

      <InventoryDrawer isOpen={isInventoryOpen} onClose={closePanel} />
    </>
  )
}
