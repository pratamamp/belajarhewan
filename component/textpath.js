import React from 'react'
import Svg, { Path, Text, TextPath, Defs, G, TSpan } from "react-native-svg"


export default function SVGtextpath({text, style}) {
    const path="M0,10 a1,1 0 0,0 700,0"
    return (
       
        <Svg height="150" width="350" style={{
            ...style
        }}>
            <Defs>
                <Path id='pathline' 
                    d={path}
                />
            </Defs>
            <G y="-250" x="-160">
                <Text
                    fill="green"
                    stroke="orange"
                    strokeWidth="3"
                    fontSize="100"
                    fontFamily="GochiHand-Regular"
                    fontWeight="bold"
                    x="70"
                    y="10"
                    textAnchor="middle"
                >
                    <TextPath href="#pathline" startOffset="42%">
                        {text}
                    </TextPath>
                </Text>
            {/* <Path d={path} fill="none"  stroke="red" /> */}
            </G>
            
            {/* <Text
                fill="purple"
                stroke="white"
                fontSize="60"
                fontFamily="GochiHand-Regular"
                fontWeight="bold"
                x="100"
                y="30"
                textAnchor="middle"
            >
                {text}
            </Text> */}
            </Svg>
      )
}
