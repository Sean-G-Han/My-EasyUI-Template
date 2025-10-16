import { useWindowDimensions } from 'react-native'
import "expo-router/entry"
import CommonUIRect from './CommonUI/CommonUIRect';
import { Rectangle } from './geometry';
import CommonUIButton from './CommonUI/CommonUIButton';

const Home = () => {
    const window = useWindowDimensions();
    const root = Rectangle.create({
        size: {width: window.width, height: window.height},
        pos: {x: 0, y: 0},
    });

    const child = Rectangle.create({
        size: {width: 100, height: 100},
        rectCorners: [[root, "top-left"]],
        ref: "top-left"
    });

    const child2 = Rectangle.create({
        size: {width: 50, height: 50},
        rectCorners: [[root, "bottom-right"]],
        ref: "bottom-right"
    });

    const child3 = Rectangle.create({
        rectCorners: [[child, "bottom-right"], [child2, "top-left"]],
    });

    const child4 = Rectangle.create({
        rectCorners: [[child3, "center"]],
        size: {width: 200, height: 200},
        ref: "center"
    });

    const child5 = Rectangle.create({
        rectCorners: [[child4, "top-left"]],
        size: {width: 150, height: 150},
        ref: "top-left"
    });

    return (
        <>
            <CommonUIRect rect={child} />
            <CommonUIRect rect={child2} />
            <CommonUIRect rect={child3}>
                <CommonUIRect rect={child4}>
                    <CommonUIRect rect={child5} />
                </CommonUIRect>
            </CommonUIRect>
        </>
    )
}

export default Home;