import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function HomeButton({title, style}) {
    return (
        <TouchableOpacity 
            style={{...style}}    
        >
            <Text style={{
                fontSize: 12,
                color: 'white'
            }}>{title}</Text>
        </TouchableOpacity>
    )
}
