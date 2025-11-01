// CUI/CUIAbsoluteBox.tsx
import React from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import RectContext, { RectProvider } from '../RectContext';
import { Rectangle } from '../geometry';

type Props = {
    children?: React.ReactNode;
    padding?: number;
    name?: string;
    rect: Rectangle;
    style?: StyleProp<ViewStyle>;
};

const CUIAbsoluteBox = ({ children, rect, padding, name, style }: Props) => {
    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);
    const mainStyle = {
        position: 'absolute' as const,
        left: Animated.subtract(mainXYWH.x, parent.x || 0),
        top: Animated.subtract(mainXYWH.y, parent.y || 0),
        width: mainXYWH.width,
        height: mainXYWH.height,
        padding: padding || 0,
        gap: padding || 0,
    };
    return (
        <RectProvider value={{ x: mainXYWH.x, y: mainXYWH.y, parent: rect }}>
            <Animated.View style={[ mainStyle, style ]}>
                {children}
            </Animated.View>
        </RectProvider>
    );
};

export default CUIAbsoluteBox;
