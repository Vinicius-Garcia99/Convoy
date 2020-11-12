import React, { useState } from 'react'
import { SafeAreaView, Image, TouchableOpacity, StyleSheet, View, TextInput, Text } from 'react-native'
import Logo from './Images/Logo.png'
import { api } from './services/api'

export default ({ navigation = {} }) => {
  const { navigate } = navigation
  const [name, setName] = useState('')

  async function handleLogin() {
    try {
      const { data: userData } = await api.post('/auth', { name })
      setName('')
      navigate('Home', { ...userData })
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ marginTop: 100, marginBottom: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Image source={Logo} />
        <View style={{ width: '65%' }}>
          <TextInput value={name} onChangeText={setName} autoCapitalize='none' autoCorrect={false} placeholderTextColor='#fff' placeholder='Nome de Usuário' style={{ padding: 10, borderWidth: 2, marginBottom: 10, borderRadius: 10, borderColor: '#f71010', color: '#fff'  }} />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10, backgroundColor: '#111' }} onPress={() => navigate('Login')}>
              <Text children='Voltar' style={{ fontWeight: '700', color: '#fff' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10, backgroundColor: '#f71010' }} onPress={handleLogin}>
              <Text children='Logar' style={{ fontWeight: '700', color: '#fff' }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    display: 'flex'
  }
})