import { View, ViewStyle } from 'react-native'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import RectContext, { RectProvider } from '../RectContext'
import { Rectangle, RectFactory } from '../geometry'
import CUIRelativeBox from './CUIRelativeBox'
import { RefRegistry } from '../RefRegistry'

type Props = {
    height: number
    factory?: RectFactory
    style?: ViewStyle
}

const CUIScrollBoxItem = ({ height, factory, style }: Props) => {
    const parent = React.useContext(RectContext)
    if (factory === undefined) {
        return null
    }
    const parentWidth = parent?.parent?.getXYWH().width || 0
    const selfRect = new Rectangle({ width: parentWidth, height }, { x: 0, y: 0 }, "top-left", "scroll-box-item")

    // Attaching Reference
    const [isHighlighted, setIsHighlighted] = useState(false);
    const internalRef = useRef<any>(null);
    useImperativeHandle(internalRef, () => ({
        highlight(isOn: boolean = true) {
            setIsHighlighted(isOn); // TODO: Fix a bug where re-renders causes a whole new rectangle to be formed and reference ADDED
        },
    }));
        
    useEffect(() => {
        RefRegistry.addRelation(parent.parent!.className, selfRect.className, parent.parent!.id, selfRect.id);
        RefRegistry.addReference(selfRect.className, selfRect.id, internalRef.current);
    }, [selfRect]);
    // End Attaching Reference

    const mainStyle = {
        borderWidth: isHighlighted ? 2 : 0,
        borderColor: isHighlighted ? 'orange' : 'transparent',
    };

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            <View style={{ width: parentWidth, height, ...style, ...mainStyle }}>
                <CUIRelativeBox factory={factory} />
            </View>
        </RectProvider>
    )
}

export default CUIScrollBoxItem