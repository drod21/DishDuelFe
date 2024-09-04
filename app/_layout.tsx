import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useColorScheme } from '@/hooks/useColorScheme'
import { fetchAllRestaurants } from '@/lib/api'
import { DefaultStack } from './DefaultStack'
import {
  getUserLocationPermissions,
  locationReqKey,
  queryKey,
  requestLocation,
} from '@/hooks/useUserLocation'
export const client = new QueryClient()

const prefetches = async () => {
  await client.prefetchQuery({
    queryKey: ['restaurants'],
    queryFn: () => fetchAllRestaurants(),
  })

  const userLocation = requestLocation()
  client.setQueryData(queryKey, userLocation)
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
    prefetches()
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={client}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <DefaultStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
