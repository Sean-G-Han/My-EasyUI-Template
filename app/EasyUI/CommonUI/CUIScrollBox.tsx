import { Animated } from "react-native";
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
        position: "absolute" as const,
        left: Animated.subtract(mainXYWH.x, parent.x || 0),
        top: Animated.subtract(mainXYWH.y, parent.y || 0),
        width: mainXYWH.width,
        height: mainXYWH.height,
    };
    return (
        <Animated.ScrollView style={[ mainStyle, style ]}>
            <RectContext.Provider value={{ x: 0, y: 0, parent: rect}}>
                {children}
            </RectContext.Provider>
        </Animated.ScrollView>
    );
};

export default CUIScrollBox;