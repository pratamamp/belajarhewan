import React from 'react'
import { View, ImageBackground, TouchableOpacity, Image } from 'react-native'
import Stars from './stars'

export default function Ending({point, onRepeat, onHome}) {
    return (
        <ImageBackground
            source={require('../assets/panel.png')}
            style={{flex: 1,
                width: 450,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
            resizeMode='contain'
        >
            <View style={{width: 300, 
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 80,
                // backgroundColor: 'white'
            }}>
                <View style={{flex: 1, marginVertical: 20}}>
                    <Stars point={point} />
                </View>

                <View style={{
                    flex: 1, 
                    // backgroundColor: 'green',
                    flexDirection: 'row',
                    marginTop: 30,
                }}>
                    <TouchableOpacity style={{
                        height: 37,
                        width: 124,
                        marginHorizontal: 10
                    }}
                    onPress={onRepeat}
                    >
                        <Image source={require('../assets/replaybtn.png')} 
                        resizeMode='contain' 
                        style={{
                            width: '100%',
                            height: '100%'
                        }}/>   
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        height: 37,
                        width: 124,
                        marginHorizontal: 10
                    }}
                    onPress={onHome}
                    >
                        <Image source={require('../assets/outbtn.png')} resizeMode='contain' style={{
                            width: '100%',
                            height: '100%'
                        }}/>
                    </TouchableOpacity>
                    
                </View>
            </View>
        
        </ImageBackground>
    )
}
