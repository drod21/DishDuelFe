import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location'
import {
  type Coordinates,
  store,
  useUserLocationStore,
} from '@/app/store/UserLocationStore'
import { Platform } from 'react-native'

const defaultCoordinates = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
export const locationReqKey = ['getPermission']
export const queryKey = ['userLocation']

export const getUserLocationPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync()
  if (foregroundStatus === 'granted' && Platform.OS === 'android') {
    const { status } = await Location.requestBackgroundPermissionsAsync()

    return status === Location.PermissionStatus.GRANTED
      ? status
      : foregroundStatus
  }

  return foregroundStatus
}

export const requestLocation = async (): Promise<Coordinates> => {
  const permissionStatus = await getUserLocationPermissions()
  if (permissionStatus !== 'granted') {
    return defaultCoordinates
  }

  let location = await Location.getCurrentPositionAsync()

  const userLocation = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: defaultCoordinates.latitudeDelta,
    longitudeDelta: defaultCoordinates.longitudeDelta,
  }

  return userLocation
}

export const useUserLocation = () => {
  const query = useQuery({
    queryKey,
    queryFn: requestLocation,
  })
  const locationStore = useUserLocationStore()

  if (query.data && query.data.latitude && query.data.longitude) {
    store.batch(() => {
      store.setState((prev) => ({
        ...prev,
        coordinates: query.data,
        userCoordinates: query.data,
        canUseUserLocation: true,
      }))
    })
  }

  return query
}
