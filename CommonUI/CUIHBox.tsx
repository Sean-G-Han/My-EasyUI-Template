import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../RectContext';
import { AnimNum, Rectangle, Side } from '../geometry';
import CUIAbsoluteBox from './CUIAbsoluteBox';

type Props = {
    rect: Rectangle;
    cellWidth?: AnimNum;
    children?: React.ReactNode;
    reverse?: boolean;
    style?: StyleProp<ViewStyle>;
}

const CUIHBox = ({ rect, cellWidth, children, style, reverse = false }: Props) => {
    const { x, y, parent } = React.useContext(RectContext);

    let main = rect
    let firstElement: Rectangle = main;
    const rectArray = React.Children.map(children, (child) => {
        let rectSide: [Rectangle, Side] = [firstElement, reverse ? 'left' : 'right'];

        if (firstElement === main)
            rectSide = [firstElement, reverse ? 'right' : 'left'];

        let rect = Rectangle.create({
            rectSides: [rectSide],
            growDirection: reverse ? 'left' : 'right',
            growSize: cellWidth ? cellWidth : 100
        });
        firstElement = rect;
        return rect;
    });

    return (
        <RectProvider value={{ x: x, y: y, parent: parent }}>
            <CUIAbsoluteBox rect={rect}>
                {rectArray && rectArray.map((rect, index) => (
                    <CUIAbsoluteBox rect={rect} key={index}>
                        {React.Children.toArray(children)[index]}
                    </CUIAbsoluteBox>
                ))}
            </CUIAbsoluteBox>
        </RectProvider>
    )
}

export default CUIHBox