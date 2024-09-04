import React, { Suspense, useMemo } from 'react'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps'
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { useUserLocationStore } from '@/app/store/UserLocationStore'
import {
  Restaurant,
  useDetailsPanelState,
} from '@/app/store/SelectedRestaurantsStore'
import { useSelectedRestaurants } from '@/hooks/useSelectedRestaurants'
import { useFetchRestaurants } from '@/hooks/useFetchRestaurants'
import { useDebounce } from '@/hooks/useDebounce'

interface RestaurantMapProps {
  filters: {
    type: string | null
    rating: number | null
    rank: string | null
  }
  onRestaurantSelect: (restaurant: Restaurant) => void
  handleClosePanel: () => void
}

const RestaurantMap = ({
  filters,
  onRestaurantSelect,
  handleClosePanel,
}: RestaurantMapProps) => {
  const location = useUserLocationStore()
  const { selectedRestaurants } = useSelectedRestaurants()
  const { detailsPanelState } = useDetailsPanelState()

  const mapRegion = location.coordinates
  const restaurants = useFetchRestaurants()

  const onRegionChangeComplete = useDebounce((region: Region) => {
    location.setCoordinates({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    })
  }, 300)

  const filteredRestaurants = useMemo(() => {
    return (
      restaurants.data?.filter((restaurant) => {
        const typeMatch = !filters.type || restaurant.type === filters.type
        const ratingMatch =
          !filters.rating || restaurant.rating >= filters.rating
        const rankMatch = !filters.rank || restaurant.rank === filters.rank
        return typeMatch && ratingMatch && rankMatch
      }) ?? []
    )
  }, [restaurants, filters])

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MapView
            onPress={(_e) => {
              detailsPanelState === 'open' ? handleClosePanel() : null
            }}
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            <Marker
              coordinate={location.userLocation}
              title="You are here"
              pinColor="blue"
            />
            {filteredRestaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}
                title={restaurant.name}
                description={`Type: ${restaurant.type}, Rating: ${restaurant.rating}`}
                onPress={() => onRestaurantSelect(restaurant)}
                pinColor={
                  selectedRestaurants.some((r) => r.id === restaurant.id)
                    ? 'green'
                    : 'red'
                }
              />
            ))}
          </MapView>
        </View>
      </SafeAreaView>
    </Suspense>
  )
}

export default RestaurantMap

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
