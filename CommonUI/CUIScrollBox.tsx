import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import RectContext, { RectProvider } from '../RectContext';
import { Rectangle } from '../geometry';
import { RefRegistry } from '../RefRegistry';
import { SignalObject } from '../signal';

type Props = {
    children?: React.ReactNode;
    padding?: number;
    rect: Rectangle;
    style?: StyleProp<ViewStyle>;
    horizontal?: boolean;
    showsScrollIndicators?: boolean;
};

const CUIScrollBox = ({ children, rect, padding, style, horizontal, showsScrollIndicators}: Props) => {

    const [isHighlighted, setIsHighlighted] = useState(false);
    const internalRef = useRef<any>(null);

    useImperativeHandle(internalRef, () => ({
        receiveSignal(signal: SignalObject) {
            switch (signal.key) {
                case 'highlight':
                    setIsHighlighted(!signal.value);
                    break;
                default:
                    break;
            }
        }
    }));

    // Register reference
    useEffect(() => {
        RefRegistry.addReference(rect.className, rect.id, internalRef.current);
        return () => RefRegistry.removeReference(rect.className, rect.id);
    }, [rect]);

    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);

    let translateStyle = {};
    let sizeStyle = {};

    if (mainXYWH.x !== 0 && mainXYWH.y !== 0) {
        translateStyle = {
            left: mainXYWH.x - parent.x,
            top: mainXYWH.y - parent.y,
        };
    }

    if (mainXYWH.width !== 0 && mainXYWH.height !== 0) {
        sizeStyle = {
            width: mainXYWH.width,
            height: mainXYWH.height,
        };
    }

    const mainStyle = {
        position: mainXYWH.x && mainXYWH.y ? 'absolute' as const : undefined,
        padding: padding || 0,
        gap: padding || 0,
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'blue' : 'transparent',
    };

    return (
        <RectProvider value={{ x: mainXYWH.x, y: mainXYWH.y, parent: rect }}>
            <ScrollView
                ref={internalRef}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={showsScrollIndicators}
                showsVerticalScrollIndicator={showsScrollIndicators}
                contentContainerStyle={{ padding: padding || 0, gap: padding || 0 }}
                style={[mainStyle, translateStyle, sizeStyle, style]}
            >
                {children}
            </ScrollView>
        </RectProvider>
    );
};

export default CUIScrollBox;
