import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../RectContext';
import { AnimNum, Rectangle, Side } from '../geometry';
import CUIAbsoluteBox from './CUIAbsoluteBox';

type Props = {
    rect: Rectangle;
    cellHeight?: AnimNum;
    children?: React.ReactNode;
    reverse?: boolean;
    style?: StyleProp<ViewStyle>;
}

const CUIVBox = ({ rect, cellHeight, children, style, reverse = false }: Props) => {
    const { x, y, parent } = React.useContext(RectContext);

    let main = rect
    let topElement: Rectangle = main;
    const rectArray = React.Children.map(children, (child) => {
        let rectSide: [Rectangle, Side] = [topElement, reverse ? 'top' : 'bottom'];

        if (topElement === main)
            rectSide = [topElement, reverse ? 'bottom' : 'top'];

        let rect = Rectangle.create({
            rectSides: [rectSide],
            growDirection: reverse ? 'top' : 'bottom',
            growSize: cellHeight ? cellHeight : 100
        });
        topElement = rect;
        return rect;
    });

    return (
        <RectProvider value={{ x: x, y: y, parent: parent }}>
            <CUIAbsoluteBox rect={rect} style={style}>
                {rectArray && rectArray.map((rect, index) => (
                    <CUIAbsoluteBox rect={rect} key={index}>
                        {React.Children.toArray(children)[index]}
                    </CUIAbsoluteBox>
                ))}
            </CUIAbsoluteBox>
        </RectProvider>
    )
}

export default CUIVBox;