import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location'
import {
  type Coordinates,
  useUserLocationStore,
} from '@/app/store/UserLocationStore'

const defaultCoordinates = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
export const locationReqKey = ['getPermission']
export const queryKey = ['userLocation']

export const useRequestLocation = () => {
  const userLocationStore = useUserLocationStore()
  const query = useQuery({
    queryKey: locationReqKey,
    queryFn: async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      return status
    },
  })

  if (query.isSuccess && query.data === Location.PermissionStatus.GRANTED) {
    userLocationStore.setCanUseUserLocation(true)
  }

  return query
}

const requestLocation = async (): Promise<Coordinates> => {
  let location = await Location.getCurrentPositionAsync({})

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: defaultCoordinates.latitudeDelta,
    longitudeDelta: defaultCoordinates.longitudeDelta,
  }
}

export const useUserLocation = () => {
  const userLocationStore = useUserLocationStore()

  const query = useQuery({
    queryKey,
    queryFn: requestLocation,
    enabled: userLocationStore.canUseUserLocation,
  })

  if (query.status === 'success') {
    userLocationStore.setUserLocation(query.data)
  }

  return query
}
