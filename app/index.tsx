import React, { useRef, useState } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox';
import { Rectangle } from './EasyUI/geometry';
import CUIVBox from './EasyUI/CommonUI/CUIVBox';
import CUIScrollBox from './EasyUI/CommonUI/CUIScrollBox';
import CUIScrollBoxItem from './EasyUI/CommonUI/CUIScrollBoxItem';
import CUIRelativeBox from './EasyUI/CommonUI/CUIRelativeBox';
import CUITextField from './EasyUI/CommonUI/CUITextField';
import CUITextButton from './EasyUI/CommonUI/CUITextButton';

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

    const scrollItemFunc = (selfRect: Rectangle) => {
        const childRect = Rectangle.create({
            rectCorners: [[selfRect, "top-left"]],
            refCorner: "top-left",
            size: { width: 50, height: 50 },
        });
        const childRect2 = Rectangle.create({
            rectCorners: [[selfRect, "bottom-right"]],
            refCorner: "bottom-right",
            size: { width: 50, height: 50 },
        });
        const childRect3 = Rectangle.create({
            rectCorners: [[childRect, "bottom-right"], [childRect2, "top-left"]],
        });
        const mainElement = (
            <>
                <CUITextField />
                <CUITextButton text="Click Me" onPress={toggle} />
            </>
        );
        return [{ rect: childRect }, { rect: childRect2 }, { rect: childRect3, element: mainElement }];
    };

    return (
        <CUIAbsoluteBox rect={root}>
            <CUIVBox rect={sidebarRect} cellHeight={60} style={{ backgroundColor: 'black' }}>

            </CUIVBox>
            <CUIScrollBox rect={contentRect} style={{ backgroundColor: '#f0f0f0' }}>
                <CUIScrollBoxItem height={200} factory={scrollItemFunc}/>
                <CUIScrollBoxItem height={200} factory={scrollItemFunc}/>
                <CUIScrollBoxItem height={200} factory={scrollItemFunc}/>
                <CUIScrollBoxItem height={200} factory={scrollItemFunc}/>
                <CUIScrollBoxItem height={200} factory={scrollItemFunc}/>
                <CUIScrollBoxItem height={200} factory={scrollItemFunc}/>
            </CUIScrollBox>
        </CUIAbsoluteBox>
    );
}