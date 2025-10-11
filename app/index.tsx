import { useWindowDimensions } from 'react-native'
import "expo-router/entry"
import React from 'react'
import CommonUITextField from './CommonUI/CommonUITextField'
import CommonUIButton from './CommonUI/CommonUIButton'
import { BoxSize } from './CommonUI/CommonUIBox'
import CommonUIRigidBox from './CommonUI/CommonUIRigidBox'

import * as XYWH from "./xywh";

const Home = () => {
  const window = useWindowDimensions();
  const parent = XYWH.create(0, 0, window.width, window.height, XYWH.referencePoint.TOP_LEFT);
  const child = XYWH.attachTo(
    XYWH.create(0, 0, BoxSize.MEDIUM, BoxSize.SMALL, XYWH.referencePoint.TOP_LEFT), 
    XYWH.referencePoint.CENTER, 
    parent, 
    XYWH.referencePoint.CENTER
  );
  return (
    <CommonUIRigidBox xywh={parent}>
      <CommonUIRigidBox padding={10} xywh={child}>
        <CommonUITextField placeholder='Username'/>
        <CommonUITextField placeholder='Password'/>
        <CommonUIButton text='Login' onPress={() => {}}/>
      </CommonUIRigidBox>
    </CommonUIRigidBox>
  )
}

export default Home;