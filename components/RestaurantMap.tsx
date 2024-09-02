import React, { useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  Modal,
  Text,
  Button,
} from 'react-native'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps'
import { useFetchRestaurants } from '@/hooks/useFetchRestaurants'
import { useUserLocationStore } from '@/app/store/UserLocationStore'
import {
  selectedRestaurantsStore,
  Restaurant as SelectedRestaurant,
} from '@/app/store/SelectedRestaurantsStore'

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
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

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

  const handleMarkerPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setModalVisible(true)
  }

  const handleConfirmAdd = () => {
    if (selectedRestaurant) {
      selectedRestaurantsStore.setState((state) => ({
        selectedRestaurants: [...state.selectedRestaurants, selectedRestaurant],
      }))
    }
    setModalVisible(false)
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
              onPress={(_val) => handleMarkerPress(restaurant)}
            />
          ))}
        </MapView>
        {selectedRestaurant && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{selectedRestaurant.name}</Text>
              <Text>Type: {selectedRestaurant.type}</Text>
              <Text>Rating: {selectedRestaurant.rating}</Text>
              <Button title="Add to Duel List" onPress={handleConfirmAdd} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </Modal>
        )}
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
