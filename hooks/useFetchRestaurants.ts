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
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=1500&type=restaurant&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.results) {
      const newRestaurants: Restaurant[] = data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        type: place.types[0],
        rating: place.rating || 0,
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
