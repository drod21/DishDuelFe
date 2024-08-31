import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useRouter } from 'expo-router'
import RestaurantMap from '@/components/RestaurantMap'
import FilterModal from '@/components/FilterModal'

// Mock data for restaurants
const mockRestaurants = [
  {
    id: '1',
    name: 'Pizza Place',
    latitude: 37.78825,
    longitude: -122.4324,
    type: 'Italian',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Taco Spot',
    latitude: 37.78925,
    longitude: -122.4344,
    type: 'Mexican',
    rating: 4.0,
  },
  {
    id: '3',
    name: 'Sushi Bar',
    latitude: 37.78725,
    longitude: -122.4304,
    type: 'Japanese',
    rating: 4.8,
  },
]

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState(mockRestaurants)
  const [filters, setFilters] = useState<{
    type: string | null
    rating: number | null
  }>({ type: null, rating: null })
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would fetch restaurants from an API here
    // For now, we'll use the mock data
  }, [])

  const handleApplyFilters = (newFilters: {
    type: string | null
    rating: number | null
  }) => {
    setFilters(newFilters)
  }

  return (
    <View style={styles.container}>
      <RestaurantMap restaurants={restaurants} filters={filters} />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      {isFilterModalVisible && (
        <FilterModal
          onApplyFilters={handleApplyFilters}
          onClose={() => setIsFilterModalVisible(false)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
