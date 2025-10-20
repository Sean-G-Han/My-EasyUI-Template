import { StyleSheet } from 'react-native'
import React from 'react'
import RectContext, { RectProvider } from '../RectContext'
import { Rectangle, RectFactory } from '../geometry'
import CUIRelativeBox from './CUIRelativeBox'

type Props = {
    height: number
    factory?: RectFactory
    children?: React.ReactNode
}

const CUIScrollBoxItem = ({ height, factory, children }: Props) => {
    const parent = React.useContext(RectContext)
    const parentWidth = parent?.parent?.getXYWH().width || 0
    const selfRect = new Rectangle({ width: parentWidth, height }, { x: 0, y: 0 })

    return (
        <RectProvider value={{ x: 0, y: 0, parent: selfRect }}>
            {factory ? <CUIRelativeBox factory={factory} /> : children}
        </RectProvider>
    )
}

export default CUIScrollBoxItem

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
})
