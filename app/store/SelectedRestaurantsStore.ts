import { rankColors } from '@/utils/rankCalculator'
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import { useRestaurant } from '@/hooks/useRestaurant'

type DetailsPanelState = 'open' | 'closed'
export interface Restaurant {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  rating: number
  address: string
  mmr?: number
  rank?: keyof typeof rankColors
  places_id?: string
}

interface SelectedRestaurantsState {
  selectedRestaurants: Restaurant[]
  currentSelectedRestaurant?: Restaurant
  detailsPanelState: DetailsPanelState
}

const initialState: SelectedRestaurantsState = {
  detailsPanelState: 'closed',
  selectedRestaurants: [],
  currentSelectedRestaurant: undefined,
}

export const selectedRestaurantsStore = new Store(initialState)

const setDetailsPanelState = (detailsPanelState: 'open' | 'closed') => {
  selectedRestaurantsStore.setState((prev) => ({
    ...prev,
    detailsPanelState,
  }))
}

export const useDetailsPanelState = () => {
  const detailsPanelState = useStore(
    selectedRestaurantsStore,
    (state) => state.detailsPanelState,
  )

  return {
    detailsPanelState,
    openDetailsPanel: () => setDetailsPanelState('open'),
    closeDetailsPanel: () => setDetailsPanelState('closed'),
  }
}
