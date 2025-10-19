import React, { useRef, useState } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import CUIRect from './EasyUI/CommonUI/CUIRect';
import { Rectangle } from './EasyUI/geometry';
import CUISideBar from './EasyUI/CommonUI/CUISideBar';
import CUIMenuButton from './EasyUI/CommonUI/CUISideBarBtn';

export default function Example() {
    const [expanded, setExpanded] = useState(false);
    const sidebarWidth = useRef(new Animated.Value(70)).current;

    const toggle = () => {
        Animated.timing(sidebarWidth, {
            toValue: expanded ? 60 : 150,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setExpanded(!expanded);
    };

    const window = useWindowDimensions();
    const root = Rectangle.create({
        size: {width: window.width, height: window.height},
        pos: {x: 0, y: 0},
    });


    return (
        <CUIRect rect={root}>
            <CUISideBar direction="left" width={sidebarWidth} cellHeight={60} style={{ backgroundColor: 'lightgray' }}>
                <CUIMenuButton alignment="left" padding={15} fontSize={14} text="Menu" displayWidth={100} iconName="menu" onPress={toggle} />
                <CUIMenuButton alignment="left" padding={15} fontSize={14} text="Attendance" displayWidth={100} iconName="timer" onPress={() => {console.log('Attendance pressed')}} />
                <CUIMenuButton alignment="left" padding={15} fontSize={14} text="Home" displayWidth={100} iconName="home" onPress={() => {console.log('Menu pressed')}} />
            </CUISideBar>
        </CUIRect>
    );
}