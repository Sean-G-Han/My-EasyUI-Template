// CommonUI/CommonUIRect.tsx
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import RectContext, { RectProvider } from '../RectContext';
import { Rectangle } from '../geometry';

type Props = {
    children?: React.ReactNode;
    padding?: number;
    rect: Rectangle;
};

const CommonUIRect = ({ children, rect, padding }: Props) => {
    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);

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
