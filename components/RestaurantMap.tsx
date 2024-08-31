import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  rating: number;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
  filters: {
    type: string | null;
    rating: number | null;
  };
}

export default function RestaurantMap({ restaurants, filters }: RestaurantMapProps) {
  const router = useRouter();
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow the app to use location services for this app.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newUserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newUserLocation);
      setMapRegion({
        ...newUserLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Fetch nearby restaurants when user location is obtained
      fetchNearbyRestaurants(newUserLocation);
    })();
  }, []);

  const fetchNearbyRestaurants = async (location: { latitude: number; longitude: number }) => {
    // Replace YOUR_API_KEY with your actual Google Places API key
    const apiKey = 'AIzaSyBBMKGfb1xBTwVhbyxGYlKyZL5dAmCcO20';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=1500&type=restaurant&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) {
        const newRestaurants: Restaurant[] = data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          type: place.types[0],
          rating: place.rating || 0,
        }));
        setFilteredRestaurants(newRestaurants);
      }
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
    }
  };

  useEffect(() => {
    setFilteredRestaurants(
      restaurants.filter((restaurant) => {
        const typeMatch = !filters.type || restaurant.type === filters.type;
        const ratingMatch = !filters.rating || restaurant.rating >= filters.rating;
        return typeMatch && ratingMatch;
      })
    );
  }, [restaurants, filters]);

  const handleMarkerPress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        region={mapRegion}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
          />
        )}
        {filteredRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.name}
            description={`Type: ${restaurant.type}, Rating: ${restaurant.rating}`}
            onPress={() => handleMarkerPress(restaurant.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
