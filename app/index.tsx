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
  const lefteye = XYWH.attachTo(
    XYWH.create(0, 0, 50, 50, XYWH.referencePoint.TOP_LEFT),
    XYWH.referencePoint.BOTTOM_LEFT,
    child,
    XYWH.referencePoint.TOP_LEFT,
    0,
    -30
  );
  const leftPupil = XYWH.attachTo(
    XYWH.create(0, 0, 20, 20, XYWH.referencePoint.TOP_LEFT),
    XYWH.referencePoint.CENTER,
    lefteye,
    XYWH.referencePoint.CENTER
  );
  const righteye = XYWH.attachTo( 
    XYWH.create(0, 0, 50, 50, XYWH.referencePoint.TOP_LEFT),
    XYWH.referencePoint.BOTTOM_RIGHT,
    child,
    XYWH.referencePoint.TOP_RIGHT,
    0,
    -30
  );
  const rightPupil = XYWH.attachTo(
    XYWH.create(0, 0, 20, 20, XYWH.referencePoint.TOP_LEFT),
    XYWH.referencePoint.CENTER,
    righteye,
    XYWH.referencePoint.CENTER
  );
  return (
    <CommonUIRigidBox xywh={parent}>
      <CommonUIRigidBox padding={10} xywh={child}>
        <CommonUITextField placeholder='Username'/>
        <CommonUITextField placeholder='Password'/>
        <CommonUIButton text='Login' onPress={() => {}}/>
      </CommonUIRigidBox>
      <CommonUIRigidBox xywh={lefteye} />
      <CommonUIRigidBox xywh={righteye} />
      <CommonUIRigidBox xywh={leftPupil} style={{ backgroundColor: 'black' }} />
      <CommonUIRigidBox xywh={rightPupil} style={{ backgroundColor: 'black' }} />
    </CommonUIRigidBox>
  )
}

export default Home;