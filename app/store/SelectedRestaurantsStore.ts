import { fetchOrCreateRestaurant } from '@/lib/api'
import { rankColors } from '@/utils/rankCalculator'
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import { client } from '../_layout'
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

const addSelectedRestaurant = (restaurant: Restaurant) => {
  const currRestaurants = [
    ...selectedRestaurantsStore.state.selectedRestaurants,
  ]
  currRestaurants.push(restaurant)

  selectedRestaurantsStore.setState((prev) => ({
    ...prev,
    selectedRestaurants: currRestaurants,
  }))
}

const removeSelectedRestaurant = (restaurantId: string) => {
  const updatedRestaurants =
    selectedRestaurantsStore.state.selectedRestaurants.filter(
      (restaurant) => restaurant.id !== restaurantId,
    )

  selectedRestaurantsStore.setState((prev) => ({
    ...prev,
    selectedRestaurants: updatedRestaurants,
  }))
}

const setSelectedRestaurant = async (
  currentSelectedRestaurant?: Restaurant,
) => {
  selectedRestaurantsStore.setState((prev) => ({
    ...prev,
    currentSelectedRestaurant,
  }))
}

const setDetailsPanelState = (detailsPanelState: 'open' | 'closed') => {
  selectedRestaurantsStore.setState((prev) => ({
    ...prev,
    detailsPanelState,
  }))
}

// hooks
export const useCurrentSelectedRestaurant = () => {
  const selectedRestaurant = useStore(
    selectedRestaurantsStore,
    (state) => state.currentSelectedRestaurant,
  )

  return {
    selectedRestaurant,
    setSelectedRestaurant,
  }
}

export const useSelectedRestaurants = () => {
  const { data } = useRestaurant()
  const selectedRestaurants = useStore(
    selectedRestaurantsStore,
    (state) => state.selectedRestaurants,
  )

  return {
    selectedRestaurants,
    addSelectedRestaurant: () => addSelectedRestaurant(data),
    removeSelectedRestaurant: () =>
      removeSelectedRestaurant(data.places_id ?? data.id),
  }
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
