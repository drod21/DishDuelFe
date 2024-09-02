import React, { useMemo } from 'react'
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps'
import { useFetchRestaurants } from '@/hooks/useFetchRestaurants'
import { useUserLocationStore } from '@/app/store/UserLocationStore'

export interface Restaurant {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  rating: number
}

interface RestaurantMapProps {
  filters: {
    type: string | null
    rating: number | null
  }
}

export default function RestaurantMap({ filters }: RestaurantMapProps) {
  const location = useUserLocationStore()
  const mapRegion = location.canUseUserLocation
    ? location.userLocation
    : location.defaultCoordinates
  const restaurants = useFetchRestaurants()

  const filteredRestaurants = useMemo(() => {
    return (
      restaurants.data?.filter((restaurant) => {
        const typeMatch = !filters.type || restaurant.type === filters.type
        const ratingMatch =
          !filters.rating || restaurant.rating >= filters.rating
        return typeMatch && ratingMatch
      }) ?? []
    )
  }, [restaurants, filters])

  const handleMarkerPress = (restaurantId: string) => {
    // TODO: handle this
    // router.push(``);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          style={styles.map}
          region={mapRegion}
        >
          {location.canUseUserLocation && (
            <Marker
              coordinate={mapRegion}
              title="You are here"
              pinColor="blue"
            />
          )}
          {filteredRestaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              description={`Type: ${restaurant.type}, Rating: ${restaurant.rating}`}
              onPress={() => handleMarkerPress(restaurant.id)}
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})
