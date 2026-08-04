import { ColliderPanel } from './ui/ColliderPanel'
import { ColliderViewport } from './ui/ColliderViewport'
import { useColliderPanel } from './model/useColliderPanel'
import { InventoryDrawer } from '@/widgets/inventory-drawer'
import { CollectionDrawer } from '@/widgets/collection-drawer'
import { CalendarDialog } from '@/widgets/calendar-dialog'

export function ColliderPage() {
  const { activePanel, closePanel, openPanel } = useColliderPanel()

  return (
    <>
      <ColliderViewport>
        <ColliderPanel
          onOpenCalendar={() => openPanel('calendar')}
          onOpenCollection={() => openPanel('collection')}
          onOpenInventory={() => openPanel('inventory')}
        />
      </ColliderViewport>

      <InventoryDrawer
        isOpen={activePanel === 'inventory'}
        onClose={closePanel}
      />

      <CollectionDrawer
        isOpen={activePanel === 'collection'}
        onClose={closePanel}
      />

      <CalendarDialog
        isOpen={activePanel === 'calendar'}
        onClose={closePanel}
      />
    </>
  )
}
