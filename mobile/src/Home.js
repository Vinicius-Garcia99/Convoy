import React, { useState, useEffect, useReducer } from 'react'
import { SafeAreaView, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { Modal, Portal, Provider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Facebook from 'expo-facebook'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import { api } from './services/api'
import dayjs from 'dayjs'
import MapView, { Marker } from 'react-native-maps'
import io from 'socket.io-client'
import Police from './Images/Police.png'

export default ({ navigation = {}, route = {} }) => {
  const { _id, name, type } = route.params || {}
  const { navigate } = navigation
  const [showMap, setShowMap] = useState(false)
  const [visible, setvisible] = useState(false)
  const [logoutVisible, setLogoutVisible] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [triggeredAlertVisible, setTriggeredAlertVisible] = useState(false)
  const [reportInput, setReportInput] = useState('')
  const [reports, setReports] = useState([])
  const [coords, setCoords] = useState({})
  const [triggeredAlerts, setTriggeredAlerts] = useState([])
  const [copsCoords, setCopsCoords] = useState()
  console.disableYellowBox = true
  
  useEffect(() => {
    async function loadData() {
      await getReports()
      await getLocationAsync()
    }
    loadData()
    registerSockets()
  }, [])

  function registerSockets() {
    const socket = io('http://192.168.15.5:3333')

    socket.on('alert', handleTriggeredAlert)
    socket.on('answer', setCopsCoords)
  }

  function handleTriggeredAlert(alert = {}) {
    setTriggeredAlerts(prev => [...prev, alert])
  }

  useEffect(() => {
    console.log({ triggeredAlerts })
    if (!!triggeredAlerts.length && type === 'agent') {
      toggleTriggeredAlertVisible()
    }
  }, [triggeredAlerts])

  async function getReports() {
    try {
      const { data } = await api.get('/getReports', { params: { _id, type } })
      setReports(data)
    } catch (error) {
      console.log({ error })
    }
  }

  function toggleVisible() {
    setvisible(!visible)
    setReportInput('')
  }

  function toggleLogoutVisible() {
    setLogoutVisible(!logoutVisible)
  }

  function toggleAlertVisible() {
    setAlertVisible(!alertVisible)
  }

  function toggleTriggeredAlertVisible() {
    setTriggeredAlertVisible(!triggeredAlertVisible)
  }

  async function handleAddReport() {
    try {
      await api.post('/addReport', { reportInput, _id, name })
      await getReports()
      toggleVisible()
    } catch (error) {
      console.log({ error })
    }
  }

  async function handleLogout() {
    try {
      if (type === 'user')
        await Facebook.logOutAsync()

      setReports([])
      setAlertVisible(false)
      setLogoutVisible(false)
      setvisible(false)
      navigate('Login')
    } catch (error) {
      console.log({ error })
    }
  }

  async function handleAlert() {
    try {
      const { longitude, latitude } = coords || {}
      await api.post('/addAlert', { longitude, latitude, _id })

      setAlertVisible(false)
      setShowMap(true)
    } catch (error) {
      console.log({ error })
    }
  }

  async function getLocationAsync() {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true }) || {}
        const { longitude, latitude } = coords

        setCoords({ longitude, latitude })
      } else { 
        throw new Error('Location permission not granted');
      }
    } catch (error) {
      console.log({ error })
    }
  }

  async function handleAnswerAlert() {
    const [alert] = triggeredAlerts
    const { data = {} } = await api.post('/answerAlert', { alert, coords }) || {}
  }

  return (
    <>
      <SafeAreaView style={{ backgroundColor: '#333', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {showMap && coords.latitude && coords.longitude ? (
          <MapView
            style={{ width: '100%', height: '90%' }}
            initialRegion={{
              latitude: coords.latitude || 0,
              longitude: coords.longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          // />
          >
            <Marker coordinate={coords} {...{ image: type === 'agent' ? Police : undefined }} />
            {!!triggeredAlerts.length && triggeredAlerts.map(({ latitude, longitude }) => <Marker coordinate={{ latitude, longitude }} />)}
            {type === 'user' && !!copsCoords && <Marker image={Police} coordinate={copsCoords} />}
          </MapView>
        ) : (
          <>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
              <Text children='Denúncias' style={{ fontSize: 34, fontWeight: '700', color: '#f71010' }} />
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0 }}>
              {!!reports.length ? (
                reports.map(({ text = '', user = {}, createdAt }, index) => (
                  <View key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 10, marginTop: 20 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Text children={user.name || '-'} style={{ color: '#fff', fontWeight: '700', fontSize: 16 }} />
                      <Text children={dayjs(createdAt).format('DD/MM/YYYY [ás] HH:mm')} style={{ color: '#fff' }} />
                    </View>
                    <Text children={text} style={{ width: '70%', fontSize: 18, color: '#000' }} />
                  </View>
                ))
              ) : (
                <View style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Nenhuma denúncia encontrada.' style={{ fontSize: 28, textAlign: 'center', color: '#fff' }} />
                </View>
              )}
            </ScrollView>
          </>
        )}
        <View style={{ backgroundColor: '#222', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => !!showMap ? setShowMap(false) : (type === 'user' && toggleVisible() )}>
            <Icon name='report' style={{ fontSize: 40, color: '#fff' }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name={type === 'agent' ? 'explore' : 'record-voice-over'} onPress={() => type === 'agent' ? setShowMap(true) : toggleAlertVisible()} style={{ fontSize: 40, color: type === 'agent' ? '#fff' : '#f71010' }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name='exit-to-app' style={{ fontSize: 40, color: '#fff' }} onPress={toggleLogoutVisible} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Provider>
        <Portal>
          <Modal visible={visible} onDismiss={toggleVisible}>
            <View style={{ backgroundColor: '#333', marginHorizontal: 20, padding: 20, borderRadius: 10 }}>
              <Text style={{ color: '#f71010', fontSize: 20, fontWeight: '700' }} children='Denúncia' />
              <TextInput multiline placeholderTextColor='#fff' placeholder='Inserir Denúncia' style={{ color: '#fff', marginVertical: 20, borderBottomWidth: 2, borderBottomColor: '#fff', paddingBottom: 5}} autoCapitalize='none' autoCorrect={false} value={reportInput} onChangeText={setReportInput} />
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={handleAddReport} style={{ padding: 10, backgroundColor: '#f71010', borderRadius: 10, width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Adicionar Denúncia' style={{ color: '#fff', fontWeight: '800' }} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={logoutVisible} onDismiss={toggleLogoutVisible}>
            <View style={{ backgroundColor: '#333', marginHorizontal: 20, padding: 20, borderRadius: 10 }}>
              <Text style={{ color: '#f71010', fontSize: 20, fontWeight: '700' }} children='Deseja Sair?' />
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
                <TouchableOpacity onPress={toggleLogoutVisible} style={{ padding: 10, backgroundColor: '#222', borderRadius: 10, width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Não' style={{ color: '#fff', fontWeight: '700', fontSize: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={{ padding: 10, backgroundColor: '#f71010', borderRadius: 10, width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Sim' style={{ color: '#fff', fontWeight: '700', fontSize: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={alertVisible} onDismiss={toggleAlertVisible}>
            <View style={{ backgroundColor: '#333', marginHorizontal: 20, padding: 20, borderRadius: 10 }}>
              <Text style={{ color: '#f71010', fontSize: 20, fontWeight: '700' }} children='Deseja confirmar pedido de ajuda?' />
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
                <TouchableOpacity onPress={toggleAlertVisible} style={{ padding: 10, backgroundColor: '#222', borderRadius: 10, width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Não' style={{ color: '#fff', fontWeight: '700', fontSize: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => !!coords ? await handleAlert() : ''} style={{ padding: 10, backgroundColor: '#f71010', borderRadius: 10, width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Sim' style={{ color: '#fff', fontWeight: '700', fontSize: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={triggeredAlertVisible} onDismiss={toggleTriggeredAlertVisible}>
            <View style={{ backgroundColor: '#333', marginHorizontal: 20, padding: 20, borderRadius: 10 }}>
              <Text style={{ color: '#f71010', fontSize: 20, fontWeight: '700', marginVertical: 20 }} children='Um alerta de perigo foi disparado!' />
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={async () => {
                  toggleTriggeredAlertVisible()
                  await handleAnswerAlert()
                  setShowMap(true)
                }} style={{ padding: 10, backgroundColor: '#f71010', borderRadius: 10, width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text children='Visualizar' style={{ color: '#fff', fontWeight: '700', fontSize: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
    </>
  )
}