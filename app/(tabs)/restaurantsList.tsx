import Ionicons from '@expo/vector-icons/Ionicons'
import { StyleSheet, Image, Platform, ActivityIndicator } from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import RestaurantList from '@/components/RestaurantList'
import { usePrefetchQuery, useQuery } from '@tanstack/react-query'
import { fetchAllRestaurants } from '@/lib/api'
import { Restaurant } from '../store/SelectedRestaurantsStore'

export default function TabTwoScreen() {
  const { data, isSuccess } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: () => fetchAllRestaurants(),
  })

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        {!isSuccess ? (
          <ActivityIndicator />
        ) : (
          <RestaurantList restaurants={data} />
        )}
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
})
