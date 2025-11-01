import React from "react";
import { Rectangle, RectFactory, Size } from "../geometry";
import RectContext, { RectProvider } from "../RectContext";
import CUIAbsoluteBox from "./CUIAbsoluteBox";
import { RectRegistry } from "../RectRegistry";

type Props = {
    factory: RectFactory;
};

const CUIRelativeBox = ({ factory }: Props) => {
    const parent = React.useContext(RectContext);
    const parentRect = parent?.parent;

    const boxSize: Size | undefined = parent?.parent?.getXYWH();

    if (!boxSize) {
        return null;
    }

    const selfRect = new Rectangle(boxSize, { x: 0, y: 0 });

    const childRects = factory(selfRect);

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            {childRects.map((item, idx) => {
                if (item.rect && parentRect) {
                    RectRegistry.addRelation(parentRect, item.rect);
                }
                return (
                    <CUIAbsoluteBox key={idx} rect={item.rect} style={item.style}>
                        {item.element}
                    </CUIAbsoluteBox>
                );
            })}
        </RectProvider>
    );
};

export default CUIRelativeBox;
