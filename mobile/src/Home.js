import React from 'react'
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'

export default ({ navigation = {} }) => {
  const { navigate } = navigation

  async function getLocationAsync() {
    try {
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        console.log({ location: await Location.getCurrentPositionAsync({ enableHighAccuracy: true }) })
        return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      } else {
        throw new Error('Location permission not granted');
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <MapView
          style={{ width: '100%', height: '100%' }}
          initialRegion={{
            "latitude": -23.2097758,
            "longitude": -46.7652368,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => console.log(getLocationAsync())} style={{ width: 70, height: 70, backgroundColor: 'blue' }} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 30,
  },
  header: {
    width: '100%',
    height: '90%',
  },
  footer: {
    width: '100%',
    height: '10%',
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})