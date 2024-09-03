import React, { Suspense } from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { rankColors } from '@/utils/rankCalculator'
import { useRestaurant } from '@/hooks/useRestaurant'

export function RestaurantDetails() {
  const { data: restaurant, error, isFetching } = useRestaurant()

  return (
    <Suspense
      fallback={
        <ActivityIndicator color="#000" size="large" shouldRasterizeIOS />
      }
    >
      <View style={styles.container}>
        <Text style={styles.header}>{restaurant.name}</Text>
        {restaurant.rank != null && (
          <Text style={[styles.rank, { color: rankColors[restaurant.rank] }]}>
            {restaurant.rank}
          </Text>
        )}
        <Text>Type: {restaurant.type}</Text>
        <Text>Rating: {restaurant.rating}</Text>
        <Text>Address: {restaurant.address}</Text>
        {restaurant.mmr != null && <Text>MMR: {restaurant.mmr}</Text>}
      </View>
    </Suspense>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
  },
  container: {
    padding: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
