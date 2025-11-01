import { StyleSheet, View } from 'react-native'
import React, { Children } from 'react'
import RectContext, { RectProvider } from '../RectContext'
import { Rectangle, RectFactory } from '../geometry'
import CUIRelativeBox from './CUIRelativeBox'

type Props = {
    height: number
    factory?: RectFactory
    //children?: React.ReactNode
}

const CUIScrollBoxItem = ({ height,  factory}: Props) => {
    const parent = React.useContext(RectContext)
    if (factory === undefined) {
        return null
    }
    const parentWidth = parent?.parent?.getXYWH().width || 0
    const selfRect = new Rectangle({ width: parentWidth, height }, { x: 0, y: 0 })

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            {/* {factory ? <CUIRelativeBox factory={factory} /> : children} */}
            <View style={{ width: parentWidth, height }}>
                <CUIRelativeBox factory={factory} />
            </View>
        </RectProvider>
    )
}

export default CUIScrollBoxItem