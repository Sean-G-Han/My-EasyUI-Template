import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Rectangle, RectFactory, Size } from "../geometry";
import RectContext, { RectProvider } from "../RectContext";
import CUIAbsoluteBox from "./CUIAbsoluteBox";
import { RefRegistry } from "../RefRegistry";
import { SignalObject } from "../signal";

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

    // Note: Using useMemo to avoid recreating Rectangle on every render
    const selfRect = useMemo(() => {
        return new Rectangle(boxSize, { x: 0, y: 0 }, "top-left", "relative-box");
    }, [parentRect]);

    const childRects = useMemo(() => factory(selfRect), [factory, selfRect]);
    
    // Attaching Reference
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
        RefRegistry.addRelation(parentRect!.className, selfRect.className, parentRect!.id, selfRect.id);
        RefRegistry.addReference(selfRect.className, selfRect.id, internalRef.current);
    }, [parentRect]);
    // End Attaching Reference

    const mainStyle = {
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'red' : 'transparent',
    };

    return (
        <RectProvider value={{ x: 0, y: 0, parent: parentRect }}>
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
