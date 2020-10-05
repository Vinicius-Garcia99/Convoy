import 'react-native-gesture-handler'
import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './src/Login'
import Home from './src/Home'

export default function App() {
  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='TesteDois' component={TesteDois} />
        <Stack.Screen name='TesteTres' component={TesteTres} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const TesteUm = () => <TouchableOpacity children={<Text children='TesteUm' />} />
const TesteDois = () => <TouchableOpacity children={<Text children='TesteDois' />} />
const TesteTres = () => <TouchableOpacity children={<Text children='TesteTres' />} />