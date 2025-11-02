import { View, ViewStyle } from 'react-native'
import React from 'react'
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

    RefRegistry.addRelation(parent.parent!.className, selfRect.className, parent.parent!.id, selfRect.id);

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            <View style={{ width: parentWidth, height, ...style }}>
                <CUIRelativeBox factory={factory} />
            </View>
        </RectProvider>
    )
}

export default CUIScrollBoxItem