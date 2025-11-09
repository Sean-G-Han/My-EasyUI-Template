import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox'
import { AnimNum, Rectangle } from './EasyUI/geometry';
import CUITextField from './EasyUI/CommonUI/CUITextField';
import CUIButton from './EasyUI/CommonUI/CUITextButton';
import { SignalObject } from './EasyUI/signal';
import { RefRegistry } from './EasyUI/RefRegistry';

type Props = {
    rect: Rectangle;
};

const DUIExample = (props: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [expanded, setExpanded] = useState(false);

    const internalRef = useRef<any>(null);
    const expandAnim = useRef(new Animated.Value(0)).current; // 0 collapsed, 1 expanded

    useImperativeHandle(internalRef, () => ({
        receiveSignal(signal: SignalObject) {
            switch (signal.key) {
                case 'updateEmail':
                    setEmail(signal.value);
                    break;
                case 'updatePassword':
                    setPassword(signal.value);
                    break;
                case 'highlight':
                    console.log(`Highlighting DUIExample component not supported`);
                    break;
                default:
                    break;
            }
        }
    }));

    useEffect(() => {
        RefRegistry.updateReference(props.rect.className, props.rect.id, internalRef.current);
    }, [props.rect]);

    // Animated width
    const animatedWidth = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 300],
    });

    const sidebar = Rectangle.create({
        rectSides: [[props.rect, "left"]],
        growDirection: "right",
        growSize: animatedWidth as AnimNum,
    }, "sidebar-box");

    const contentArea = Rectangle.create({
        rectCorners: [[sidebar, "top-right"], [props.rect, "bottom-right"]],
    }, "content-area-box");

    return (
        <CUIAbsoluteBox rect={props.rect}>
        <CUIAbsoluteBox rect={sidebar} style={{ backgroundColor: 'lightgray' }} />

        <CUIAbsoluteBox rect={contentArea} padding={20}>
            <CUITextField type="email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
            <CUITextField type="password" placeholder="Enter your password" value={password} onChangeText={setPassword} />
            <CUIButton text="Submit" onPress={() => { console.log("Button Pressed") }} />
            <CUIButton
            text={expanded ? "Collapse" : "Expand"}
            onPress={() => {
                Animated.timing(expandAnim, {
                    toValue: expanded ? 0 : 1,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
                setExpanded(!expanded);
            }}
            />
        </CUIAbsoluteBox>
        </CUIAbsoluteBox>
    )
}

export default DUIExample;
