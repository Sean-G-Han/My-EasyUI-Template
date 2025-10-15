import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Rectangle } from '../geometry'

type Props = {
    children?: React.ReactNode;
    parent?: Rectangle;
    padding?: number;
    rect: Rectangle
}

const CommonUIRect = ({ children, rect, parent, padding }: Props) => {
    const mainRect = rect.getRect();
    const parentRect = parent?.getRect();
    console.log(`Rendering rect at (${mainRect.x}, ${mainRect.y}) with size (${mainRect.width} x ${mainRect.height})`);
    return (
        <View 
            style={[styles.container, 
            {
                left: mainRect.x - (parentRect?.x || 0),
                top: mainRect.y - (parentRect?.y || 0), 
                width: mainRect.width, 
                height: mainRect.height,
                padding: padding || 0,
                gap: padding || 0,
            }]}>
            {children}
        </View>
    )
}

export default CommonUIRect

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'black',
    }
})