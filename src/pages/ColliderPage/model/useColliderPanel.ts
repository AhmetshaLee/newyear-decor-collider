import { useSearchParams } from 'react-router'

const INVENTORY_PANEL = 'inventory'

export function useColliderPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isInventoryOpen = searchParams.get('panel') === INVENTORY_PANEL

  const openInventory = () => {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('panel', INVENTORY_PANEL)
    setSearchParams(nextSearchParams)
  }

  const closePanel = () => {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.delete('panel')
    setSearchParams(nextSearchParams, { replace: true })
  }

  return {
    closePanel,
    isInventoryOpen,
    openInventory,
  }
}
