import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../RectContext';
import { AnimNum, Rectangle, Side } from '../geometry';
import CUIVBox from './CUIVBox';

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

    return (
        <RectProvider value={{ x: x, y: y, parent: parent }}>
            <CUIVBox rect={sidebarRect} cellHeight={cellHeight} style={style}>
                {children}
            </CUIVBox>
        </RectProvider>
    )
}

export default CUISideBar

const styles = StyleSheet.create({})