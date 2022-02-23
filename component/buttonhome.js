import React from 'react'
import {Text, View, Image, TouchableHighlight} from 'react-native'

export default function HomeButton({title, style, navigation, toPage}) {

    function pressHandler() {
        navigation.navigate(toPage)
    }

    return (
        <View style={{
            ...style,
            width: 263,
            justifyContent: 'center',
            alignItems: 'center',
            height: 73,
        }}>
            <Image 
                source={require('../assets/icon/menuframe.png')}
                style={{
                    position:'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
            />
            <TouchableHighlight onPress={pressHandler}>
                <Text style={{
                    textAlign: 'left',
                    fontFamily: 'Boogaloo-Regular',
                    fontSize: 26,
                    color: 'white',
                    marginRight: 40
                }}>{title.toUpperCase()}</Text>
            </TouchableHighlight>
        </View>
    )
}
