import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Rectangle } from '../geometry'
import RectContext, { RectProvider } from './RectContext';

type Props = {
    children?: React.ReactNode;
    padding?: number;
    rect: Rectangle
}

const CommonUIRect = ({ children, rect, padding }: Props) => {
    const mainRect = rect.getRect();
    const parentRect = React.useContext(RectContext);
    console.log(`Rendering rect at (${mainRect.x}, ${mainRect.y}) with size (${mainRect.width} x ${mainRect.height})`);
    return (
        <RectProvider value={{x: mainRect.x, y: mainRect.y}}>
            <View 
                style={[styles.container, 
                {
                    left: mainRect.x - (parentRect.x || 0),
                    top: mainRect.y - (parentRect.y || 0), 
                    width: mainRect.width, 
                    height: mainRect.height,
                    padding: padding || 0,
                    gap: padding || 0,
                }]}>
                {children}
            </View>
        </RectProvider>
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