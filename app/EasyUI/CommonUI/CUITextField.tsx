import React from "react";
import { StyleSheet, TextInput } from "react-native";

type TypeField = "password" | "text" | "email" | "numeric" | "phone";

type FieldProps = {
    keyboardType: 
        "default"
        | "numeric"
        | "number-pad"
        | "decimal-pad"
        | "email-address"
        | "phone-pad"
        | "url"
        | "ascii-capable"
        | "visible-password";
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences";
}

const fieldTypeMap: Record<TypeField, FieldProps> = {
    password: {
        keyboardType: "default",
        secureTextEntry: true,
        autoCapitalize: "none",
    },
    text: {
        keyboardType: "default",
        secureTextEntry: false,
        autoCapitalize: "sentences",
    },
    email: {
        keyboardType: "email-address",
        secureTextEntry: false,
        autoCapitalize: "none",
    },
    numeric: {
        keyboardType: "numeric",
        secureTextEntry: false,
        autoCapitalize: "none",
    },
    phone: {
        keyboardType: "phone-pad",
        secureTextEntry: false,
        autoCapitalize: "none",
    },
};

type Props = {
    type?: TypeField;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    width?: number;
    height?: number;
};

const CUITextField: React.FC<Props> = ({
    type = "text",
    placeholder = "",
    value,
    onChangeText,
    width,
    height = 50,
}) => {
    const fieldProps = fieldTypeMap[type];

    return (
        <TextInput
            style={[
                styles.input, { height, width },
            ]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={fieldProps.keyboardType}
            secureTextEntry={fieldProps.secureTextEntry}
            autoCapitalize={fieldProps.autoCapitalize}
            editable={true}
        />
    );
};

export default CUITextField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});