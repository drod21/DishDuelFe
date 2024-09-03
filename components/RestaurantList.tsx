import { Restaurant } from '@/app/store/SelectedRestaurantsStore'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'

const RestaurantList = ({ restaurants }: { restaurants: Restaurant[] }) => {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item: Restaurant) => item.id}
      renderItem={({ item }: { item: Restaurant }) => (
        <ThemedView style={styles.item}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>
          <ThemedText style={styles.mmr}>MMR: {item.mmr}</ThemedText>
        </ThemedView>
      )}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mmr: {
    fontSize: 14,
    color: '#666',
  },
})

export default RestaurantList
