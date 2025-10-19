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
  const mainRect = rect.getRect();
  const parentRect = React.useContext(RectContext);

  return (
    <RectProvider value={{ x: mainRect.x as any, y: mainRect.y as any }}>
        <Animated.View
            style={[
            styles.container,
                {
                    left: Animated.subtract(mainRect.x, parentRect.x || 0),
                    top: Animated.subtract(mainRect.y, parentRect.y || 0),
                    width: mainRect.width,
                    height: mainRect.height,
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
