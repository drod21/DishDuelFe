import React, { useState, useRef, Suspense } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from 'react-native'
import FilterModal from '@/components/FilterModal'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useUserLocationStore } from '../store/UserLocationStore'
import { Icon } from 'react-native-elements'
import { RestaurantDetails } from '@/components/RestaurantDetails'
import {
  Restaurant,
  useCurrentSelectedRestaurant,
  useDetailsPanelState,
  useSelectedRestaurants,
} from '../store/SelectedRestaurantsStore'
import RestaurantMap from '@/components/RestaurantMap'

export default function MapScreen() {
  const [filters, setFilters] = useState<{
    type: string | null
    rating: number | null
    rank: string | null
  }>({ type: null, rating: null, rank: null })
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(true)
  const locationStore = useUserLocationStore()
  const slideAnim = useRef(new Animated.Value(-300)).current
  const { selectedRestaurant, setSelectedRestaurant } =
    useCurrentSelectedRestaurant()
  const { detailsPanelState, openDetailsPanel, closeDetailsPanel } =
    useDetailsPanelState()
  const { addSelectedRestaurant } = useSelectedRestaurants()

  const handleApplyFilters = (newFilters: {
    type: string | null
    rating: number | null
    rank: string | null
  }) => {
    setFilters(newFilters)
  }

  const handlePlaceSelect = (_data: any, details: any) => {
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location
      const newLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
      locationStore.setCoordinates(newLocation)
    }
  }

  const handleRestaurantSelect = (r: Restaurant) => {
    r.places_id = r.id
    setSelectedRestaurant(r)
    openDetailsPanel()
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const handleClosePanel = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedRestaurant(undefined)
      closeDetailsPanel()
    })
  }

  const handleAddToDuelList = () => {
    addSelectedRestaurant()
    handleClosePanel()
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <RestaurantMap
          filters={filters}
          onRestaurantSelect={handleRestaurantSelect}
          handleClosePanel={handleClosePanel}
        />
        {searchVisible && (
          <GooglePlacesAutocomplete
            fetchDetails
            placeholder="Search"
            onPress={handlePlaceSelect}
            query={{
              key: 'AIzaSyBBMKGfb1xBTwVhbyxGYlKyZL5dAmCcO20',
              language: 'en',
            }}
            styles={{
              container: styles.searchContainer,
              listView: styles.listView,
            }}
          />
        )}
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => setSearchVisible(!searchVisible)}
        >
          <Icon color="white" name="search" size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Icon color="white" name="filter-list" size={30} />
        </TouchableOpacity>
        {isFilterModalVisible && (
          <FilterModal
            onApplyFilters={handleApplyFilters}
            onClose={() => setIsFilterModalVisible(false)}
          />
        )}
        <Suspense
          fallback={
            <ActivityIndicator color="#000" size="large" shouldRasterizeIOS />
          }
        >
          <Animated.View
            style={[
              styles.sidePanel,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {detailsPanelState === 'open' && selectedRestaurant && (
              <View style={styles.collapsible}>
                <RestaurantDetails />
                <TouchableOpacity
                  onPress={handleAddToDuelList}
                  style={styles.addButton}
                >
                  <Icon name="add" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleClosePanel}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Suspense>
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
  listView: {
    backgroundColor: 'white',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: '90%',
    zIndex: 1,
    marginHorizontal: 10,
  },
  searchIcon: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    zIndex: 2,
  },
  filterIcon: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    zIndex: 2,
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    zIndex: 3,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: 'rgba(0, 128, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  collapsible: {
    marginTop: 6,
    marginLeft: 24,
  },
})
