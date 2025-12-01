import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import RectContext, { RectProvider } from '../RectContext';
import { Rectangle } from '../geometry';
import { RefRegistry } from '../RefRegistry';
import { SignalObject } from '../signal';

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

    useEffect(() => {
        RefRegistry.addReference(rect.className, rect.id, internalRef.current);

        return () => {
            RefRegistry.removeReference(rect.className, rect.id);
        }   
    }, [rect]);
    // End Attaching Reference

    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);
    let translateStyle = {};
    let sizeStyle = {};
    if ( mainXYWH.x !== 0 || mainXYWH.y !== 0) {
        let left = mainXYWH.x - parent.x;
        let top = mainXYWH.y - parent.y;
        translateStyle = {
            left: left,
            top: top,
        };
    }
    if (mainXYWH.width !== 0 && mainXYWH.height !== 0) {
        let width = mainXYWH.width;
        let height = mainXYWH.height;
        sizeStyle = {
            width: width,
            height: height,
        };
    }
    const mainStyle = {
        position: mainXYWH.x || mainXYWH.y ? 'absolute' as const : undefined,
        padding: padding || 0,
        gap: padding || 0,
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'blue' : 'transparent',
    };



    return (
        <RectProvider value={{ x: mainXYWH.x, y: mainXYWH.y, parent: rect }}>
            <View style={[ mainStyle, translateStyle, sizeStyle, style ]}>
                {children}
            </View>
        </RectProvider>
    );
};

export default CUIAbsoluteBox;
