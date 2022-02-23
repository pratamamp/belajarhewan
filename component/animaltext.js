import React from 'react'
import Svg,{Path, Text, TextPath} from 'react-native-svg'

export default function DetailSVGtext({text, style}) {
    return (
        <Svg height="85" width="439" style={{
            ...style
        }}>
            <Text
                fill={style.fill}
                stroke={style.strokeColor}
                strokeWidth="2"
                fontSize={style.fontSize}
                fontFamily="GochiHand-Regular"
                fontWeight="bold"
                x="150"
                y="50"
                textAnchor="middle"
            >
                {text}
            </Text>
        </Svg>
    )
}

