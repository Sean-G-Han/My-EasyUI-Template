import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

type ButtonType = "primary" | "secondary" | "danger";

type ButtonProps = {
    backgroundColor: string;
    textColor: string;
};

const buttonTypeMap: Record<ButtonType, ButtonProps> = {
    primary: { backgroundColor: "#007bff", textColor: "#fff" },
    secondary: { backgroundColor: "#6c757d", textColor: "#fff" },
    danger: { backgroundColor: "#dc3545", textColor: "#fff" },
};

type Props = {
    type?: ButtonType;
    text: string;
    onPress: () => void;
    width?: number;
    height?: number;
    disabled?: boolean;
};

const CUIButton: React.FC<Props> = ({
    type = "primary",
    text,
    onPress,
    width,
    height = 50,
    disabled = false,
}) => {
    const btnProps = buttonTypeMap[type];

    return (
        <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            { backgroundColor: btnProps.backgroundColor, width, height },
            disabled && styles.disabledButton,
        ]}
        >
        <Text style={[styles.text, { color: btnProps.textColor }]}>{text}</Text>
        </TouchableOpacity>
    );
};

export default CUIButton;

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        opacity: 0.6,
    },
});
