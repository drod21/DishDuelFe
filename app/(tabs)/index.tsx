import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useRouter } from 'expo-router'
import RestaurantMap from '@/components/RestaurantMap'
import FilterModal from '@/components/FilterModal'

export interface Restaurant {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  rating: number
}

export default function MapScreen() {
  const [filters, setFilters] = useState<{
    type: string | null
    rating: number | null
  }>({ type: null, rating: null })
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const router = useRouter()

  const handleApplyFilters = (newFilters: {
    type: string | null
    rating: number | null
  }) => {
    setFilters(newFilters)
  }

  return (
    <View style={styles.container}>
      <RestaurantMap filters={filters} />
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
