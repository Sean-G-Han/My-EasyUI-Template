import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox'
import { Rectangle } from './EasyUI/geometry';
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

    const internalRef = useRef<any>(null);

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

    const sidebar = Rectangle.create({
        rectSides: [[props.rect, "left"]],
        growDirection: "right",
        growSize: 150,
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
        </CUIAbsoluteBox>
        </CUIAbsoluteBox>
    )
}

export default DUIExample;
