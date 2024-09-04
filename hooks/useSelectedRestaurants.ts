import {
  Restaurant,
  selectedRestaurantsStore,
} from '@/app/store/SelectedRestaurantsStore'
import { useStore } from '@tanstack/react-store'
import { useRestaurant } from './useRestaurant'

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
