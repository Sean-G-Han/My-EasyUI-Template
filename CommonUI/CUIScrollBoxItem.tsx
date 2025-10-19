import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {
    height: number;
    children?: React.ReactNode;
};

const CUIScrollBoxItem = ({ height, children }: Props) => {
    return (
        <View style={[styles.container, { height }]}>
            {children}
        </View>
    )
}

export default CUIScrollBoxItem

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'blue',
    }
})