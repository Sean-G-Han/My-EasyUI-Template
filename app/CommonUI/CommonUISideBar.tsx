import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../EasyUI/RectContext';
import { AnimNum, Rectangle, Side } from '../EasyUI/geometry';
import CommonUIRect from './CommonUIRect';

type Props = {
    direction?: 'left' | 'right';
    width?: AnimNum;
    cellHeight?: AnimNum;
    children?: React.ReactNode;
}

const CommonUISideBar = ({ direction, width, cellHeight, children }: Props) => {
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
            <CommonUIRect rect={sidebarRect}>
                {rectArray && rectArray.map((rect, index) => (
                    <CommonUIRect rect={rect}>
                        {React.Children.toArray(children)[index]}
                    </CommonUIRect>
                ))}
            </CommonUIRect>
        </RectProvider>
    )
}

export default CommonUISideBar

const styles = StyleSheet.create({})