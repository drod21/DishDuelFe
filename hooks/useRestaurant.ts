import { fetchOrCreateRestaurant } from '@/lib/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCurrentSelectedRestaurant } from './useCurrentSelectedRestaurant'

export function useRestaurant() {
  const { selectedRestaurant: restaurant } = useCurrentSelectedRestaurant()
  const query = useSuspenseQuery({
    queryKey: ['restaurant', restaurant?.places_id],
    queryFn: () => fetchOrCreateRestaurant(restaurant!),
  })
  if (query.error && !query.isFetching) {
    throw query.error
  }
  return query
}
