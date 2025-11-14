import React from 'react';
import { useWindowDimensions } from 'react-native';
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox';
import { Rectangle } from './EasyUI/geometry';
import { RefRegistry } from './EasyUI/RefRegistry';
import DUIExample from './DUIExample';

// Static Commponent Example
function useLayoutRects(window: { width: number; height: number }) {
    return React.useMemo(() => {
        const root = Rectangle.create({
            size: { width: window.width, height: window.height },
            pos: { x: 0, y: 0 },
        }, "root");

        const tl = Rectangle.create({
            size: { width: 100, height: 100 },
            refCorner: "top-left",
            rectCorners: [[root, "top-left"]],
        }, "tl-box");

        const tr = Rectangle.create({
            size: { width: 100, height: 100 },
            refCorner: "top-right",
            rectCorners: [[root, "top-right"]],
        }, "tr-box");

        const br = Rectangle.create({
            size: { width: 100, height: 100 },
            refCorner: "bottom-right",
            rectCorners: [[root, "bottom-right"]],
        }, "br-box");

        const bl = Rectangle.create({
            size: { width: 100, height: 100 },
            refCorner: "bottom-left",
            rectCorners: [[root, "bottom-left"]],
        }, "bl-box");

        const header = Rectangle.create({
            rectCorners: [[tl, "bottom-right"], [tr, "bottom-left"]],
            growDirection: "bottom",
            growSize: 100,
        }, "header-box");

        const body = Rectangle.create({
            rectCorners: [[bl, "top-right"], [header, "bottom-right"]],
        }, "body-box");

        return { root, tl, tr, br, bl, header, body };
    }, [window.width, window.height]);
}

function Example() {
    const window = useWindowDimensions();
    const { root, tl, tr, br, bl, header, body } = useLayoutRects(window);

    return (
        <CUIAbsoluteBox rect={root}>
            <CUIAbsoluteBox rect={header} style={{ backgroundColor: 'lightblue' }} />
            {/* <CUIAbsoluteBox rect={tl} style={{ backgroundColor: 'lightgreen' }} />
            <CUIAbsoluteBox rect={tr} style={{ backgroundColor: 'lightcoral' }} />
            <CUIAbsoluteBox rect={br} style={{ backgroundColor: 'lightgoldenrodyellow' }} />
            <CUIAbsoluteBox rect={bl} style={{ backgroundColor: 'lightpink' }} /> */}
            <DUIExample rect={body} />
        </CUIAbsoluteBox>
    );
}

export default React.memo(Example);
export { RefRegistry };
