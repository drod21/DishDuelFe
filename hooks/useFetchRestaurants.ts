import { Restaurant } from '@/app/store/SelectedRestaurantsStore'
import {
  Coordinates,
  useUserLocationStore,
} from '@/app/store/UserLocationStore'
import { useQuery } from '@tanstack/react-query'

const fetchNearbyRestaurants = async (location: {
  latitude: number
  longitude: number
}) => {
  // Replace YOUR_API_KEY with your actual Google Places API key
  const apiKey = 'AIzaSyBBMKGfb1xBTwVhbyxGYlKyZL5dAmCcO20'
  const params = new URLSearchParams({
    location: `${location.latitude},${location.longitude}`,
    key: apiKey,
    keyword: 'restaurant',
    type: 'restaurant',
    radius: '1000',
  })
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`

  try {
    const response = await fetch(url)
    const data = (await response.json()) as { results: Restaurant[] }
    if (data.results) {
      const newRestaurants: Restaurant[] = data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        type: place.types[0],
        address: place.vicinity,
        rating: place.rating ?? 0,
      }))
      return newRestaurants
    }
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error)
  }
}

const queryKey = (loc: Coordinates) => ['restaurants', loc]

export const useFetchRestaurants = () => {
  const location = useUserLocationStore()

  return useQuery({
    queryKey: queryKey(location.coordinates),
    queryFn: () => fetchNearbyRestaurants(location.coordinates),
  })
}
