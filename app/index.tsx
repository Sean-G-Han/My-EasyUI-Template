import { StyleSheet, Text, View } from 'react-native'
import "expo-router/entry"
import React from 'react'
import CommonUITextField from './CommonUI/CommonUITextField'
import CommonUIButton from './CommonUI/CommonUIButton'
import CommonUIBox, { BoxSize } from './CommonUI/CommonUIBox'

const Home = () => {
  return (
    <View style={styles.container}>
        <CommonUIBox width={BoxSize.SHRINK} height={BoxSize.SHRINK} padding={10}>
            <CommonUITextField placeholder="Enter text here" type='email' width={300}/>
            <CommonUIButton text='Submit' onPress={() => alert('Button Pressed')} type='primary' width={100}/>
        </CommonUIBox> 
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});