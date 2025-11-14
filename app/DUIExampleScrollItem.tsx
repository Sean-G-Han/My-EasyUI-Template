import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Rectangle } from './EasyUI/geometry';
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox';

type Props = {
    rect: Rectangle;
};

const DUIExampleScrollItem = (props: Props) => {

    return (
        <CUIAbsoluteBox rect={props.rect}>
            <Text>Scroll Item: {props.rect.id}</Text>
        </CUIAbsoluteBox>
    )
}

export default DUIExampleScrollItem

const styles = StyleSheet.create({})