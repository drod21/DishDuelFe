import { Restaurant } from '@/app/store/SelectedRestaurantsStore'
import { calculateRank } from '@/utils/rankCalculator'
import { supabase } from './supabase'

export async function fetchAllRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase.from('Restaurants').select()

  if (error) {
    throw error
  }

  return data
}

export async function fetchOrCreateRestaurant(
  restaurant: Restaurant,
): Promise<Restaurant> {
  if (!restaurant) {
    return {} as Restaurant
  }
  const { data, error } = await supabase
    .from('Restaurants')
    .select('*')
    .eq('places_id', restaurant.places_id)
    .single()

  if (error && error.code === 'PGRST116') {
    const insertedData = {
      name: restaurant.name,
      type: restaurant.type,
      longitude: restaurant.longitude,
      latitude: restaurant.latitude,
      places_id: restaurant.places_id,
      rating: restaurant.rating,
      mmr: 0, // Default MMR
    }
    // Restaurant not found, insert it
    const { error: insertError } = await supabase
      .from('Restaurants')
      .insert(insertedData)
      .single()
    const { data } = await supabase
      .from('Restaurants')
      .select('*')
      .eq('places_id', restaurant.places_id)
      .single()

    if (insertError) throw insertError
    return { ...data, rank: calculateRank(0) }
  } else if (error) {
    throw error
  }

  return { ...data, rank: calculateRank(data.mmr) }
}
