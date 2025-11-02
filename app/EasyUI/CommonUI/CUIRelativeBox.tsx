import React, { useEffect } from "react";
import { Rectangle, RectFactory, Size } from "../geometry";
import RectContext, { RectProvider } from "../RectContext";
import CUIAbsoluteBox from "./CUIAbsoluteBox";
import { RefRegistry } from "../RefRegistry";

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

    const selfRect = new Rectangle(boxSize, { x: 0, y: 0 }, "top-left", "relative-box");

    RefRegistry.addRelation(parentRect!.className, selfRect.className, parentRect!.id, selfRect.id);

    const childRects = factory(selfRect);

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            {childRects.map((item, idx) => {
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
