import React, { useRef, useState } from 'react';
import { Button, Animated, useWindowDimensions } from 'react-native';
import CommonUIRect from './CommonUI/CommonUIRect';
import { Rectangle } from './geometry';
import CommonUIButton from './CommonUI/CommonUIButton';

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
        size: { width: sidebarWidth, height: window.height},
        pos: { x: 0, y: 0 },
    });
    const contentRect = Rectangle.create({
        size: { width: Animated.subtract(root.size.width, sidebarWidth), height: window.height },
        pos: { x: sidebarWidth, y: 0 },
    });

    const child = Rectangle.create({
        size: { width: 50, height: 50 },
        rectCorners: [[contentRect, "bottom-right"]],
        ref: "bottom-right",
    });

    const child2 = Rectangle.create({
        size: { width: 50, height: 50 },
        rectCorners: [[contentRect, "top-left"]],
        ref: "top-left",
    });

    const child3 = Rectangle.create({
        rectSides: [[child, "left"], [child2, "right"], [child2, "bottom"], [child, "top"]],
    });

    return (
        <>
        <CommonUIRect rect={root}>
            <CommonUIRect rect={sidebarRect}>
                <CommonUIButton text="Toggle" onPress={toggle} />
                <CommonUIRect rect={contentRect}>
                    <CommonUIRect rect={child} />
                    <CommonUIRect rect={child2} />
                    <CommonUIRect rect={child3} />
                </CommonUIRect>
            </CommonUIRect>
        </CommonUIRect>
        </>
    );
}
