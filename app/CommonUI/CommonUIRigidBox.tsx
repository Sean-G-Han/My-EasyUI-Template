import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import * as XYWH from "../xywh";
import React from 'react'
import CommonUIBox from './CommonUIBox';

export type Props = {
    xywh: XYWH.XYWH;
    children?: React.ReactNode;
    padding?: number;
    style?: StyleProp<ViewStyle>;
};

const CommonUIRigidBox = ({ xywh, children, padding, style }: Props) => {
    const position: XYWH.XYWH = XYWH.convertToTopLeft(xywh);
    return (
        <CommonUIBox width={position.width} height={position.height} padding={padding || 0} style={[{...styles.container, left: position.x, top: position.y}, style]}>
            {children}
        </CommonUIBox>
    )
}

export default CommonUIRigidBox

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid",
        position: "absolute",
    }
});