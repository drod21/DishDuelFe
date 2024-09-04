import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location'
import {
  type Coordinates,
  store,
  useUserLocationStore,
} from '@/app/store/UserLocationStore'
import { useEffect } from 'react'

const defaultCoordinates = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
export const locationReqKey = ['getPermission']
export const queryKey = ['userLocation']

export const useRequestLocation = () => {
  useEffect(() => {}, [])
  const query = useQuery({
    queryKey: locationReqKey,
    queryFn: async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      return status
    },
  })

  return query
}

const requestLocation = async (
  permissionStatus?: 'granted' | 'undetermined' | 'denied',
): Promise<Coordinates> => {
  if (permissionStatus !== 'granted') {
    return defaultCoordinates
  }

  let location = await Location.getCurrentPositionAsync()

  const userLocation = {
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
    latitudeDelta: defaultCoordinates.latitudeDelta,
    longitudeDelta: defaultCoordinates.longitudeDelta,
  }
  store.setState((prev) => ({ ...prev, userCoordinates: userLocation }))

  return userLocation
}

export const useUserLocation = () => {
  const { data } = useRequestLocation()
  console.log(data)
  const query = useQuery({
    queryKey,
    queryFn: () => requestLocation(data),
    enabled: data != null && data === Location.PermissionStatus.GRANTED,
    placeholderData: defaultCoordinates,
  })

  return query
}
