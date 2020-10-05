import React, { useEffect } from 'react'
import { SafeAreaView, Text, Button } from 'react-native'
import * as Facebook from 'expo-facebook'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

export default () => {
  useEffect(() => {
    async function setupApp() {
      try {
        await Facebook.initializeAsync({ appId: '2671989139727599' })
      } catch (error) {
        console.log({ error })
      }
    }
    setupApp()
  })

  async function login() {
    try {
      console.log({ login: await Facebook.logInWithReadPermissionsAsync() })
    } catch (error) {
      console.log({ error })
    }
  }

  async function logout() {
    try {
      console.log({ logout: await Facebook.logOutAsync() })
    } catch (error) {
      console.log({ error })
    }
  }

  async function isAuthenticated() {
    try {
      const auth = await Facebook.getAuthenticationCredentialAsync()

      console.log({ auth })
    } catch (error) {
      console.log({ error })
    }
  }

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
    <SafeAreaView>
      <Text>
        vish kk
      </Text>

      <Button title='login' onPress={() => login()} />
      <Button title='logout' onPress={() => logout()} />
      <Button title='auth' onPress={() => isAuthenticated()} />
      <Button title='Permission Location' onPress={() => console.log(getLocationAsync())} />
    </SafeAreaView>
  )
}