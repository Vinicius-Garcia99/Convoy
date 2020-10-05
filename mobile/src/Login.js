import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Logo from './Images/Logo.png'
import * as Facebook from 'expo-facebook'
import Axios from 'axios'

export default ({ navigation = {} }) => {
  const { navigate } = navigation
  const [status, setStatus] = useState('Não Logado')
  const [username, setUsername] = useState('')
  useEffect(() => {
    console.log({ navigation })

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
      const { token = '' } = await Facebook.logInWithReadPermissionsAsync()

      if (!!token)
        setStatus('Logado')

      const { data = {} } = await Axios.get(`https://graph.facebook.com/me?access_token=${token}`)

      setUsername(data.name)

      
      await Axios.post('http://localhost:3333/auth', data)
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity onPress={() => navigate('Home')}>
        <Image source={Logo} style={{ marginTop: 100, marginBottom: 250 }} />
      </TouchableOpacity>
      <Icon.Button name='facebook' backgroundColor="#3b5998" children='Entrar com o Facebook' onPress={() => login()} />

      <Text style={{ marginTop: 20 }} children={`Status: ${status}`} />
      {username ? <Text children={`Nome do usuário: ${username}`} /> : undefined}
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