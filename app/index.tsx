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
    const child = XYWH.attachRigidTo(
        XYWH.create(0, 0, BoxSize.MEDIUM, BoxSize.SMALL, XYWH.referencePoint.TOP_LEFT), 
        XYWH.referencePoint.CENTER, 
        parent, 
        XYWH.referencePoint.CENTER,
    );
    const cornerTL = XYWH.attachFlexTo(
        parent,
        XYWH.referencePoint.TOP_LEFT,
        child,
        XYWH.referencePoint.TOP_LEFT,
        XYWH.createPos(30, 30),
        XYWH.createPos(-30, -30)
    );
    const miniSideMenu = XYWH.attachFlexTo(
        cornerTL,
        XYWH.referencePoint.TOP_RIGHT,
        cornerTL,
        XYWH.referencePoint.BOTTOM_RIGHT,
        XYWH.createPos(0, 0),
        XYWH.createPos(0, 0),
        "LEFT",
        100
    );
    const cornerTR = XYWH.attachFlexTo(
        parent,
        XYWH.referencePoint.TOP_RIGHT,
        child,
        XYWH.referencePoint.TOP_RIGHT,
        XYWH.createPos(-30, 30),
        XYWH.createPos(30, -30)
    );
    const cornerBL = XYWH.attachFlexTo(
        parent,
        XYWH.referencePoint.BOTTOM_LEFT,
        child,
        XYWH.referencePoint.BOTTOM_LEFT,
        XYWH.createPos(30, -30),
        XYWH.createPos(-30, 30)
    );
    const cornerBR = XYWH.attachFlexTo(
        parent,
        XYWH.referencePoint.BOTTOM_RIGHT,
        child,
        XYWH.referencePoint.BOTTOM_RIGHT,
        XYWH.createPos(-30, -30),
        XYWH.createPos(30, 30)
    );


    return (
        <CommonUIRigidBox xywh={parent}>
            <CommonUIRigidBox padding={20} xywh={child}>
                <CommonUITextField placeholder='Username'/>
                <CommonUITextField placeholder='Password' type='password'/>
                <CommonUIButton text='Login' onPress={() => {}}/>
            </CommonUIRigidBox>
            
            <CommonUIRigidBox xywh={cornerTL} style={{backgroundColor: 'white'}}/>
                <CommonUIRigidBox xywh={miniSideMenu} style={{backgroundColor: 'lightgrey'}}/>

            <CommonUIRigidBox xywh={cornerTR} style={{backgroundColor: 'grey'}}/>
            <CommonUIRigidBox xywh={cornerBL} style={{backgroundColor: 'grey'}}/>
            <CommonUIRigidBox xywh={cornerBR} style={{backgroundColor: 'grey'}}/>
        </CommonUIRigidBox>
    )
}

export default Home;