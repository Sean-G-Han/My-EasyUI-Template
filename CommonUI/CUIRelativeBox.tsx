import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
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
    const childRects = factory(selfRect);
    
    // Attaching Reference
    const [isHighlighted, setIsHighlighted] = useState(false);
    const internalRef = useRef<any>(null);
    useImperativeHandle(internalRef, () => ({
        highlight(isOn: boolean = true) {
            setIsHighlighted(isOn);
        },
    }));
    
    useEffect(() => {
        RefRegistry.addRelation(parentRect!.className, selfRect.className, parentRect!.id, selfRect.id);
        RefRegistry.addReference(selfRect.className, selfRect.id, internalRef.current);
    }, [selfRect]);
    // End Attaching Reference

    const mainStyle = {
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'red' : 'transparent',
    };

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            {childRects.map((item, idx) => {
                return (
                    <CUIAbsoluteBox key={idx} rect={item.rect} style={{ ...item.style, ...mainStyle }}>
                        {item.element}
                    </CUIAbsoluteBox>
                );
            })}
        </RectProvider>
    );
};

export default CUIRelativeBox;
