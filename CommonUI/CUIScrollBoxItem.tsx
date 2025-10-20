import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../RectContext';
import { Rectangle, RectFactory } from '../geometry';
import CUIRelativeBox from './CUIRelativeBox';

type Props = {
    height: number;
    factory: RectFactory;
};

const CUIScrollBoxItem = ({ height, factory }: Props) => {
    const parent = React.useContext(RectContext);
    const parentWidth = parent?.parent?.getXYWH().width || 0;
    const selfRect = new Rectangle({ width: parentWidth, height }, { x: 0, y: 0 });
    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            <CUIRelativeBox factory={factory}/>
        </RectProvider>
    )
}

export default CUIScrollBoxItem

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        //borderWidth: 1,
        //borderColor: 'black',
        //backgroundColor: 'blue',
    }
})