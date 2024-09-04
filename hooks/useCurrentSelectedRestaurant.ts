import {
  Restaurant,
  selectedRestaurantsStore,
} from '@/app/store/SelectedRestaurantsStore'
import { useStore } from '@tanstack/react-store'

const setSelectedRestaurant = async (
  currentSelectedRestaurant?: Restaurant,
) => {
  selectedRestaurantsStore.setState((prev) => ({
    ...prev,
    currentSelectedRestaurant,
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
