import { Animated, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import RectContext from '../RectContext';
import { AnimMath, Rectangle } from '../geometry';
import CUIRect from './CUIRect';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    alignment: 'left' | 'right';
    padding?: number;
    iconName: string;
    text?: string;
    fontSize?: number;
    colour?: string;
    displayWidth?: number;
    onPress: () => void;
}

const CUISideBarBtn = ({ alignment, iconName, text, displayWidth, onPress, padding = 10, fontSize=12, colour='black' }: Props) => {
    const { x, y, parent } = React.useContext(RectContext);
    if (!parent) return null;

    const corner = alignment === 'left' ? 'top-left' : 'top-right';
    const refCorner = alignment === 'left' ? 'top-left' : 'top-right';
    const dimension = parent.getXYWH().height;

    const buttonContainer = Rectangle.create({
        rectCorners: [[parent, corner]],
        refCorner: refCorner,
        size: {width: dimension, height: dimension},
    });

    const textContainer = Rectangle.create({
        rectSides: alignment === 'left' ? 
        [[buttonContainer, 'top'], [buttonContainer, 'bottom'], [buttonContainer, 'right'], [parent, "right"]] :
        [[buttonContainer, 'top'], [buttonContainer, 'bottom'], [parent, 'left'], [buttonContainer, "left"]],
    });

    const widthAnim = textContainer.getXYWH().width;

    const opacity = AnimMath.toAnimated(widthAnim).interpolate({
        inputRange: [0, (displayWidth || 0) * 0.75, displayWidth || 0],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
    });
    return (
        <CUIRect rect={buttonContainer}>
            <TouchableOpacity onPress={onPress} style={padding ? { padding } : {}}>
                <Ionicons name={iconName as any} size={AnimMath.toNumber(dimension) - 2*(padding || 0)} color={colour}/>
                <CUIRect rect={textContainer}>
                    <Animated.View style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                        <Animated.Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            width: displayWidth,
                            opacity: opacity,
                            fontSize: fontSize,
                            textAlign: alignment,
                            color: colour,
                        }}
                        >
                        {text}
                        </Animated.Text>                    
                    </Animated.View>
                </CUIRect>
            </TouchableOpacity>
        </CUIRect>
    )
}

export default CUISideBarBtn

const styles = StyleSheet.create({})