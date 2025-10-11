import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React from "react";

export class BoxSize {
  static SHRINK = 0;
  static EXPAND = -1;
  static SMALL = 200;
  static MEDIUM = 400;
  static LARGE = 600;
}

type Props = {
  width: number;
  height: number;
  padding?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>
};

const CommonUIBox: React.FC<Props> = ({ children, width, height, padding, style }) => {
    const heightStyle = height === BoxSize.EXPAND
        ? { height: "100%" as const }
        : height && height > 0
        ? { height: height }
        : {};

    const widthStyle = width === BoxSize.EXPAND
        ? { width: "100%" as const }
        : width && width > 0
        ? { width: width }
        : { alignSelf: "flex-start" as const};

    return (
        <View style={[widthStyle, heightStyle, { padding: padding || 0, gap: padding || 0 }, style]}>
            {children}
        </View>
    );
};


export default CommonUIBox;

const styles = StyleSheet.create({});
