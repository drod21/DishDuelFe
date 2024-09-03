import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Slider from '@react-native-community/slider'

interface FilterModalProps {
  onApplyFilters: (filters: {
    type: string | null
    rating: number | null
    rank: string | null
  }) => void
  onClose: () => void
}

const ranks = [
  'All',
  'Unranked',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Quartz',
]
const restaurantTypes = [
  'All',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'American',
]
export default function FilterModal({
  onApplyFilters,
  onClose,
}: FilterModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedRank, setSelectedRank] = useState<string | null>(null)

  const handleApplyFilters = () => {
    onApplyFilters({
      type: selectedType === 'All' ? null : selectedType,
      rating: selectedRating,
      rank: selectedRank === 'All' ? null : selectedRank,
    })
    onClose()
  }

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Filter Restaurants</Text>

      <Text style={styles.label}>Restaurant Type</Text>
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
        style={styles.picker}
      >
        {restaurantTypes.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      <Text style={styles.label}>Minimum Rating</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={0.5}
        value={selectedRating || 1}
        onValueChange={(value) => setSelectedRating(value)}
      />
      <Text style={styles.ratingText}>
        {selectedRating ? selectedRating.toFixed(1) : 'Any'}
      </Text>

      <Text style={styles.label}>Minimum Rank</Text>
      <Picker
        selectedValue={selectedRank}
        onValueChange={(itemValue) => setSelectedRank(itemValue)}
        style={styles.picker}
      >
        {ranks.map((rank) => (
          <Picker.Item key={rank} label={rank} value={rank} />
        ))}
      </Picker>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleApplyFilters}>
          <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ratingText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
