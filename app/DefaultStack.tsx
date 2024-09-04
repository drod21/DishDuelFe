import { Stack } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { Suspense } from 'react'

export const DefaultStack = () => {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
    </Suspense>
  )
}
