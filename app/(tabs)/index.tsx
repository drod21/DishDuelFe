import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import RestaurantMap from '@/components/RestaurantMap'
import FilterModal from '@/components/FilterModal'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useUserLocationStore } from '../store/UserLocationStore'
import { Icon } from 'react-native-elements'

export default function MapScreen() {
  const [filters, setFilters] = useState<{
    type: string | null
    rating: number | null
  }>({ type: null, rating: null })
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(true)
  const locationStore = useUserLocationStore()

  const handleApplyFilters = (newFilters: {
    type: string | null
    rating: number | null
  }) => {
    setFilters(newFilters)
  }

  const handlePlaceSelect = (_data: any, details: any) => {
    const { lat, lng } = details.geometry.location
    locationStore.setUserLocation({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <RestaurantMap filters={filters} />
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
})
