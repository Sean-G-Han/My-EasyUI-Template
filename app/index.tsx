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

// Dynamic Component Example
const flag1: RectFactory = (selfRect) => {
    const tl = Rectangle.create({
        size: { width: 20, height: 20 },
        refCorner: 'top-left',
        rectCorners: [[selfRect, "top-left"]],
    }, "flag1-tl");

    const br = Rectangle.create({
        size: { width: 20, height: 20 },
        refCorner: 'bottom-right',
        rectCorners: [[selfRect, "bottom-right"]],
    }, "flag1-br");

    const center = Rectangle.create({
        rectCorners: [[tl, "bottom-right"], [br, "top-left"]],
    }, "flag1-center");

    return [
        { rect: tl, style: { backgroundColor: 'lightblue' } },
        { rect: br, style: { backgroundColor: 'lightcoral' } },
        { rect: center, style: { backgroundColor: 'lightgreen' } }
    ];
};

function Example() {
    const window = useWindowDimensions();
    const { root, tl, tr, br, bl, header, body } = useLayoutRects(window);

    return (
        <CUIAbsoluteBox rect={root}>
            <CUIAbsoluteBox rect={header} style={{ backgroundColor: 'lightblue' }} />
            <CUIAbsoluteBox rect={tl} style={{ backgroundColor: 'lightgreen' }} />
            <CUIAbsoluteBox rect={tr} style={{ backgroundColor: 'lightcoral' }} />
            <CUIAbsoluteBox rect={br} style={{ backgroundColor: 'lightgoldenrodyellow' }} />
            <CUIAbsoluteBox rect={bl} style={{ backgroundColor: 'lightpink' }} />

            <CUIScrollBox rect={body} style={{ backgroundColor: 'lightgray' }}>
                <CUIScrollBoxItem height={150} factory={flag1} />
                <CUIScrollBoxItem height={150} factory={flag1} />
                <CUIScrollBoxItem height={150} factory={flag1} />
                <CUIScrollBoxItem height={150} factory={flag1} />
            </CUIScrollBox>
        </CUIAbsoluteBox>
    );
}

export default React.memo(Example);
export { RefRegistry };
