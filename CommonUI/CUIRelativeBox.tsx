// CUIRelativeBox.tsx
import { StyleSheet, View } from "react-native";
import React from "react";
import { Rectangle, RectFactory, Size } from "../geometry";
import RectContext, { RectProvider } from "../RectContext";
import CUIRect from "./CUIRect";

type Props = {
    factory: RectFactory;
};

const CUIRelativeBox = ({ factory }: Props) => {
    const parent = React.useContext(RectContext);

    const boxSize: Size | undefined = parent?.parent?.getXYWH();

    if (!boxSize) {
        return null;
    }

    const selfRect = new Rectangle(boxSize, { x: 0, y: 0 });

    const childRects = factory(selfRect);

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            <View
                style={[
                    styles.container,
                    { width: boxSize.width, height: boxSize.height },
                ]}
            >
                {childRects.map((item, idx) => (
                    <CUIRect key={idx} rect={item.rect}>
                        {item.element}
                    </CUIRect>
                ))}
            </View>
        </RectProvider>
    );
};

export default CUIRelativeBox;

const styles = StyleSheet.create({
  container: {
    //position: "relative",
    //backgroundColor: "lightgray",
  },
});
