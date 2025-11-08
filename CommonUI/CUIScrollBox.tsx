import { Animated } from "react-native";
import React, { use, useEffect, useImperativeHandle, useRef, useState } from "react";
import RectContext from "../RectContext";
import { Rectangle } from "../geometry";
import { RefRegistry } from "../RefRegistry";
import { SignalObject } from "../signal";

type Props = {
  rect: Rectangle;
  children?: React.ReactNode;
  style?: any;
};

const CUIScrollBox = ({ rect, children, style }: Props) => {
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
    }, [rect]);

    const mainXYWH = rect.getXYWH();
    const parent = React.useContext(RectContext);
    const mainStyle = {
        position: "absolute" as const,
        left: Animated.subtract(mainXYWH.x, parent.x || 0),
        top: Animated.subtract(mainXYWH.y, parent.y || 0),
        width: mainXYWH.width,
        height: mainXYWH.height,
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'green' : 'transparent',
    };

    return (
        <Animated.ScrollView style={[ mainStyle, style ]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <RectContext.Provider value={{ x: 0, y: 0, parent: rect}}>
                {children}
            </RectContext.Provider>
        </Animated.ScrollView>
    );
};

export default CUIScrollBox;