import { type Restaurant } from '@/app/store/SelectedRestaurantsStore'
import { useRestaurant } from './useRestaurant'

export function useRestaurantSelector() {
  const { data: supabaseRestaurant, isFetching, error } = useRestaurant()

  if (error && !isFetching) {
    throw error
  }

  return supabaseRestaurant
}

export function useRestaurantMMR() {
  const { data } = useRestaurant()

  return { mmr: data?.mmr, rank: data?.rank }
}
