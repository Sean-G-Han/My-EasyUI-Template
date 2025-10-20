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
    const mainStyle = {
        left: Animated.subtract(mainXYWH.x, parent.x || 0),
        top: Animated.subtract(mainXYWH.y, parent.y || 0),
        width: mainXYWH.width,
        height: mainXYWH.height,
    };
    return (
        <Animated.ScrollView style={[ styles.container, mainStyle, style ]}>
            <RectContext.Provider value={{ x: 0, y: 0, parent: rect}}>
                {children}
            </RectContext.Provider>
        </Animated.ScrollView>
    );
};

export default CUIScrollBox;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        //backgroundColor: 'red',
        //borderWidth: 1,
        //borderColor: 'black',
    }
});