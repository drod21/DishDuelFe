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
  defaultCoordinates,
  userCoordinates: {} as Coordinates,
  canUseUserLocation: false,
})

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
  const setCanUseUserLocation = (canUseUserLocation: boolean) => {
    store.setState((state) => ({ ...state, canUseUserLocation }))
  }

  const setUserLocation = (location: Coordinates) => {
    store.setState((state) => ({ ...state, userLocation: location }))
  }

  return {
    canUseUserLocation,
    userLocation,
    defaultCoordinates,
    setUserLocation,
    setCanUseUserLocation,
  }
}
