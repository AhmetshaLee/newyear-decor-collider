import { useSearchParams } from 'react-router'

export type ColliderPanelName = 'inventory' | 'collection'

function getColliderPanelName(value: string | null): ColliderPanelName | null {
  if (value === 'inventory' || value === 'collection') {
    return value
  }

  return null
}

export function useColliderPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activePanel = getColliderPanelName(searchParams.get('panel'))

  const openPanel = (panel: ColliderPanelName) => {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('panel', panel)
    setSearchParams(nextSearchParams)
  }

  const closePanel = () => {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.delete('panel')
    setSearchParams(nextSearchParams, { replace: true })
  }

  return {
    activePanel,
    closePanel,
    openPanel,
  }
}
