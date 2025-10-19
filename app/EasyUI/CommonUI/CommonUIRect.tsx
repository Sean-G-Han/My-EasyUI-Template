// CommonUI/CommonUIRect.tsx
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import RectContext, { RectProvider } from '../RectContext';
import { AnimMath, Rectangle } from '../geometry';

type Props = {
    children?: React.ReactNode;
    padding?: number;
    name?: string;
    rect: Rectangle;
};

const CommonUIRect = ({ children, rect, padding, name }: Props) => {
    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);
    console.log(`
Rendering Rect: ${name || 'unnamed'} 
Position: (${AnimMath.toNumber(mainXYWH.x)}, ${AnimMath.toNumber(mainXYWH.y)})
Size: (${AnimMath.toNumber(mainXYWH.width)} x ${AnimMath.toNumber(mainXYWH.height)})
    `);
    return (
        <RectProvider value={{ x: mainXYWH.x, y: mainXYWH.y, parent: rect }}>
            <Animated.View
                style={[
                styles.container,
                    {
                        left: Animated.subtract(mainXYWH.x, parent.x || 0),
                        top: Animated.subtract(mainXYWH.y, parent.y || 0),
                        width: mainXYWH.width,
                        height: mainXYWH.height,
                        padding: padding || 0,
                        gap: padding || 0,
                    },
                ]}
            >
                {children}
            </Animated.View>
        </RectProvider>
    );
};

export default CommonUIRect;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'black',
    },
});
