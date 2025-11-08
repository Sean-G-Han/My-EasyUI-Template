import React from 'react';
import { useWindowDimensions } from 'react-native';
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox';
import CUIScrollBox from './EasyUI/CommonUI/CUIScrollBox';
import CUIScrollBoxItem from './EasyUI/CommonUI/CUIScrollBoxItem';
import { Rectangle, RectFactory } from './EasyUI/geometry';
import { RefRegistry } from './EasyUI/RefRegistry';

// Static Commponent Example
function useLayoutRects(window: { width: number; height: number }) {
    return React.useMemo(() => {
        RefRegistry.clear();
        const root = Rectangle.create({
            size: { width: window.width, height: window.height },
            pos: { x: 0, y: 0 },
        }, "root");

        const tl = Rectangle.create({
            size: { width: 100, height: 100 },
            refCorner: "top-left",
            rectCorners: [[root, "top-left"]],
        }, "tl-box");

        const br = Rectangle.create({
            size: { width: 100, height: 100 },
            refCorner: "bottom-right",
            rectCorners: [[root, "bottom-right"]],
        }, "br-box");

        return { root, tl, br };
    }, [window.width, window.height]);
}

function Example() {
    const window = useWindowDimensions();
    const { root, tl, br } = useLayoutRects(window);

    return (
        <CUIAbsoluteBox rect={root}>
            <CUIAbsoluteBox rect={tl} style={{ backgroundColor: 'lightgreen' }} />
            <CUIAbsoluteBox rect={br} style={{ backgroundColor: 'lightgoldenrodyellow' }} />
        </CUIAbsoluteBox>
    );
}

export default React.memo(Example);
export { RefRegistry };
