import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import RectContext, { RectProvider } from '../RectContext';
import { Rectangle } from '../geometry';
import { RefRegistry } from '../RefRegistry';

type Props = {
    children?: React.ReactNode;
    padding?: number;
    rect: Rectangle;
    style?: StyleProp<ViewStyle>;
};

const CUIAbsoluteBox = ({ children, rect, padding, style }: Props) => {
    // Attaching Reference
    const [isHighlighted, setIsHighlighted] = useState(false);
    const internalRef = useRef<any>(null);

    useImperativeHandle(internalRef, () => ({
        highlight(isOn: boolean = true) {
            setIsHighlighted(isOn);
        },
    }));

    useEffect(() => {
        RefRegistry.addReference(rect.className, rect.id, internalRef.current);
    }, [rect]);
    // End Attaching Reference

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
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'blue' : 'transparent',
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
