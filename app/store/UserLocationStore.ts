import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'

const latitudeDelta = 0.0922
const longitudeDelta = 0.0421

export type Coordinates = {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

const defaultCoordinates: Coordinates = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta,
  longitudeDelta,
}

export const store = new Store({
  coordinates: defaultCoordinates,
  defaultCoordinates,
  userCoordinates: {} as Coordinates,
  canUseUserLocation: false,
})
const setCanUseUserLocation = (canUseUserLocation: boolean) => {
  store.setState((state) => ({ ...state, canUseUserLocation }))
}

const setUserLocation = (location: Coordinates) => {
  store.setState((state) => ({
    ...state,
    userLocation: location,
    coordinates: location,
  }))
}

const setCoordinates = (location: Coordinates) => {
  store.setState((state) => ({ ...state, coordinates: location }))
}
export const useUserLocationStore = () => {
  const userLocation = useStore(store, (state) => state.userCoordinates)
  const defaultCoordinates = useStore(
    store,
    (state) => state.defaultCoordinates,
  )
  const canUseUserLocation = useStore(
    store,
    (state) => state.canUseUserLocation,
  )

  return {
    coordinates: useStore(store, (state) => state.coordinates),
    canUseUserLocation,
    setCoordinates,
    userLocation,
    defaultCoordinates,
    setUserLocation,
    setCanUseUserLocation,
  }
}
