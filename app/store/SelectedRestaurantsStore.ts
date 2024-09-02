import { Store } from '@tanstack/store'

export interface Restaurant {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  rating: number
}

interface SelectedRestaurantsState {
  selectedRestaurants: Restaurant[]
}

const initialState: SelectedRestaurantsState = {
  selectedRestaurants: [],
}

export const selectedRestaurantsStore = new Store(initialState)
