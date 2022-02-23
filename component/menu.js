import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import HomeButton from './button'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

function Panelmenu({navigation}){
    
    return (

        <View style={{
            width: wp('90.2%'),
            height: hp('50%'),
            
            position: 'absolute',
            bottom: 0,
            right: 0
        }}>
            
            <Image 
                source={require('../assets/board.png')}
                style={{
                    resizeMode: 'cover',
                    height: '100%',
                    width: '100%'
                }}
                
            />

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 80,
                    left: 125
                }}
                onPress={()=> navigation.navigate("Game1")}
            >
                <Text 
                    style={{fontSize:hp('1.9%'), color:'white'}}
                >MENGENAL HEWAN</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 144,
                    left: 140
                }}
                onPress={()=> navigation.navigate("Game2")}
            >
                <Text 
                    style={{fontSize:hp('1.9%'), color:'white'}}
                >TEBAK HEWAN</Text>
            </TouchableOpacity>
            
            
        </View>
    )
}

export default Panelmenu
