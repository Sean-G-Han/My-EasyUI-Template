import { Animated, ScrollView, StyleSheet } from "react-native";
import React from "react";
import RectContext from "../RectContext";
import { Rectangle } from "../geometry";

type Props = {
  rect: Rectangle;
  children?: React.ReactNode;
  style?: any;
};

const CUIScrollBox = ({ rect, children, style }: Props) => {
    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);
    return (
        <Animated.ScrollView
            style={[
                styles.scrollView,
                {
                    position: "absolute",
                    left: Animated.subtract(mainXYWH.x, parent.x || 0),
                    top: Animated.subtract(mainXYWH.y, parent.y || 0),
                    width: mainXYWH.width,
                    height: mainXYWH.height,
                },
                style,
            ]}
        >
            <RectContext.Provider value={{ x: mainXYWH.x, y: mainXYWH.y, parent: rect}}>
                {children}
            </RectContext.Provider>
        </Animated.ScrollView>
    );
};

export default CUIScrollBox;

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'black',
    }
});