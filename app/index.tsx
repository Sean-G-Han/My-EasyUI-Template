import React, { useRef, useState } from 'react';
import { Button, Animated, useWindowDimensions } from 'react-native';
import CommonUIRect from './CommonUI/CommonUIRect';
import { Rectangle } from './geometry';

export default function SidebarExample() {
    const [expanded, setExpanded] = useState(false);
    const sidebarWidth = useRef(new Animated.Value(100)).current;

    const toggle = () => {
        Animated.timing(sidebarWidth, {
        toValue: expanded ? 100 : 300,
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
        size: { width: sidebarWidth, height: window.height - 20},
        pos: { x: 0, y: 0 },
    });
    const contentRect = Rectangle.create({
        size: { width: Animated.subtract(root.size.width, sidebarWidth), height: window.height },
        pos: { x: sidebarWidth, y: 0 },
    });

    return (
        <>
        <CommonUIRect rect={root}>
            <CommonUIRect rect={sidebarRect}>
                <Button title="Toggle" onPress={toggle} />
                <CommonUIRect rect={contentRect} />
            </CommonUIRect>
        </CommonUIRect>
        </>
    );
}
