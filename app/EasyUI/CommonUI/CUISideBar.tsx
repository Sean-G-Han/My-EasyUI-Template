import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../RectContext';
import { AnimNum, Rectangle, Side } from '../geometry';
import CUIRect from './CUIRect';

type Props = {
    direction?: 'left' | 'right';
    width?: AnimNum;
    cellHeight?: AnimNum;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const CUISideBar = ({ direction, width, cellHeight, children, style }: Props) => {
    const { x, y, parent } = React.useContext(RectContext);
    const sidebarRect = Rectangle.create({
        rectSides: [[parent!, direction === 'left' ? 'left' : 'right']],
        growDirection: direction === 'left' ? 'right' : 'left',
        growSize: width ? width : 300
    });
    let topElement: Rectangle = sidebarRect
    const rectArray = React.Children.map(children, (child) => {
        let rectSide: [Rectangle, Side] = [topElement, 'bottom'];

        if (topElement === sidebarRect)
            rectSide = [topElement, 'top'];

        let rect = Rectangle.create({
            rectSides: [rectSide],
            growDirection: 'down',
            growSize: cellHeight ? cellHeight : 100
        });
        topElement = rect;
        return rect;
    });

    return (
        <RectProvider value={{ x: x, y: y, parent: parent }}>
            <CUIRect rect={sidebarRect} style={style}>
                {rectArray && rectArray.map((rect, index) => (
                    <CUIRect rect={rect} key={index}>
                        {React.Children.toArray(children)[index]}
                    </CUIRect>
                ))}
            </CUIRect>
        </RectProvider>
    )
}

export default CUISideBar

const styles = StyleSheet.create({})