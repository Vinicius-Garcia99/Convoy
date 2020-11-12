import React, { useEffect } from 'react'
import { SafeAreaView, Image, TouchableOpacity, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Logo from './Images/Logo.png'
import * as Facebook from 'expo-facebook'
import Axios from 'axios'
import { api } from './services/api'

export default ({ navigation = {} }) => {
  const { navigate } = navigation

  useEffect(() => {
    (async () => {
      try {
        await Facebook.initializeAsync({ appId: '2671989139727599' })
      } catch (error) {
        console.log({ error })
      }
    })()
  }, [])

  async function login() {
    try {
      const { token = '' } = await Facebook.logInWithReadPermissionsAsync()
      const { data = {} } = await Axios.get(`https://graph.facebook.com/me?access_token=${token}`)
      const { data: userData } = await api.post('/auth', data)

      navigate('Home', { ...userData })
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* <View style={{ marginTop: 100, marginBottom: 200 }}> */}
      <View style={{ marginTop: '10%', marginBottom: '20%' }}>
      <Image source={Logo} />
      </View>
      <Icon.Button name='google' backgroundColor="#f71010" children='Entrar com o Google   ' onPress={() => console.log('Agente')} />
      <View style={{ marginVertical: 10 }}>
        <Icon.Button name='facebook' backgroundColor="#3b5998" children='Entrar com o Facebook' onPress={() => login()} />
      </View>
      <Icon.Button name='user' backgroundColor="#111" children='Entrar como Agente      ' onPress={() => navigate('LoginAgent')} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    display: 'flex',
    alignItems: 'center'
  }
})