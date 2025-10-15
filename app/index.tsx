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

    return (
        <>
            <CommonUIRect rect={child} />
            <CommonUIRect rect={child2} />
            <CommonUIRect rect={child3}>
                <CommonUIRect rect={child4} parent={child3} padding={10}>
                    <CommonUIButton onPress={() => {}} text='Hello'/>
                    <CommonUIButton onPress={() => {}} text='World'/>
                    <CommonUIButton onPress={() => {}} text='!'/>
                </CommonUIRect>
                {/* Nesting Boxes not possible with previous implementation */}
            </CommonUIRect>
            <CommonUIRect rect={child4} />
        </>
    )
}

export default Home;