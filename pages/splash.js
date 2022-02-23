import React, {useEffect, useRef} from 'react'
import { View, Animated, Image } from 'react-native'


export default function Splash({onFinished}) {
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(0)).current

    function animated() {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 2,
                tension: 5,
                useNativeDriver: true
            })
        ]).start(()=> {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true
            }).start(()=> {
                setTimeout(() => {
                    onFinished(true)
                }, 500);
            })
        })
    }

    useEffect(() => {
        animated()
        // setTimeout(() => {
        //     onFinished(false)
        // }, 3000);
    }, [])
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#E5E5E5'
        }}>
            <Animated.View style={{
                flex: 1,
                width: 150,
                backgroundColor: '#E5E5E5',
                opacity: fadeAnim,
                transform: [{
                    scale: scaleAnim
                }]
            }}>
                <Image source={require('../assets/logo-se.png')} style={{
                    width: '100%',
                    height: '100%'
                }} resizeMode='contain' />
            </Animated.View>
        </View>
    )
}
