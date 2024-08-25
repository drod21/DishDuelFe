import { FlatList, View, Text, StyleSheet } from 'react-native'

interface Restaurant {
  id: string
  name: string
  mmr: number
}

const RestaurantList = ({ restaurants }: { restaurants: Restaurant[] }) => {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item: Restaurant) => item.id}
      renderItem={({ item }: { item: Restaurant }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.mmr}>MMR: {item.mmr}</Text>
        </View>
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
