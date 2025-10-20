import React, { useRef, useState } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import CUIRect from './EasyUI/CommonUI/CUIRect';
import { Rectangle } from './EasyUI/geometry';
import CUISideBar from './EasyUI/CommonUI/CUISideBar';
import CUIMenuButton from './EasyUI/CommonUI/CUISideBarBtn';
import CUIVBox from './EasyUI/CommonUI/CUIVBox';
import CUIScrollBox from './EasyUI/CommonUI/CUIScrollBox';
import CUIScrollBoxItem from './EasyUI/CommonUI/CUIScrollBoxItem';
import CUIRelativeBox from './EasyUI/CommonUI/CUIRelativeBox';
import CUIButton from './EasyUI/CommonUI/CUITextButton';

export default function Example() {
    const [expanded, setExpanded] = useState(false);
    const sidebarWidth = useRef(new Animated.Value(60)).current;

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
    const sidebarRect = Rectangle.create({
        rectSides: [[root, "left"]],
        growDirection: "right",
        growSize: sidebarWidth,
    });
    const contentRect = Rectangle.create({
        rectSides: [[root, "right"], [sidebarRect, "right"], [root, "top"], [root, "bottom"]],
    });

    return (
        <CUIRect rect={root}>
            <CUIVBox rect={sidebarRect} cellHeight={60} style={{ backgroundColor: 'black' }}>
                <CUIMenuButton alignment="left" padding={15} fontSize={14} text="Menu" displayWidth={100} iconName="menu" colour='white' onPress={toggle} />
                <CUIMenuButton alignment="left" padding={15} fontSize={14} text="Attendance" displayWidth={100} iconName="timer" colour='white' onPress={() => {console.log('Attendance pressed')}} />
                <CUIMenuButton alignment="left" padding={15} fontSize={14} text="Home" displayWidth={100} iconName="home" colour='white' onPress={() => {console.log('Menu pressed')}} />
            </CUIVBox>
            <CUIScrollBox rect={contentRect} style={{ backgroundColor: '#f0f0f0' }}>
                <CUIScrollBoxItem height={200} factory={(selfRect) => {
                    const childRect = Rectangle.create({
                        rectCorners: [[selfRect, "top-left"]],
                        refCorner: "top-left",
                        size: { width: 100, height: 100 },
                    });
                    const childElement = (
                        <CUIButton text="Click Me" onPress={() => {console.log('Button in ScrollBoxItem pressed')}} />
                    );
                    return [{ rect: childRect, element: childElement }];
                }} />
            </CUIScrollBox>
        </CUIRect>
    );
}