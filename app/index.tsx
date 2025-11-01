import React, { useRef, useState } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox';
import { Rectangle } from './EasyUI/geometry';
import CUIVBox from './EasyUI/CommonUI/CUIVBox';
import CUIScrollBox from './EasyUI/CommonUI/CUIScrollBox';
import CUIScrollBoxItem from './EasyUI/CommonUI/CUIScrollBoxItem';
import CUIRelativeBox from './EasyUI/CommonUI/CUIRelativeBox';
import CUITextField from './EasyUI/CommonUI/CUITextField';
import CUITextButton from './EasyUI/CommonUI/CUITextButton';

export default function Example() {

    const window = useWindowDimensions();
    const root = Rectangle.create({
        size: {width: window.width, height: window.height},
        pos: {x: 0, y: 0},
    });

    return (
        <CUIAbsoluteBox rect={root}>

        </CUIAbsoluteBox>
    );
}