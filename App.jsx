import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MainApp from './src/Components/MainApp'
import SplashScreen from 'react-native-splash-screen'

const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({})