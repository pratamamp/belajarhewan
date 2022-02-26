import React, {useRef, useEffect, useState, useCallback} from 'react';

import {
  View,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';
import Home1 from '../component/home/home1';
import Home2 from '../component/home/home2';
import Home3 from '../component/home/home3';
import Grass1 from '../component/grass/grass1';
import Grass2 from '../component/grass/grass2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {homeAssets} from '../config';
import LangSwitch from '../component/home/langswitch';
import {useFocusEffect} from '@react-navigation/core';
// import Home4 from '../component/home/home4';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {AppConfig} from '../config';

Sound.setCategory('Playback');
let suaraOpening;
export default function Home({route, navigation}) {
  const {bgHomeImage, bgRumput, animals, openingVoice, openingVoiceEnglish} =
    homeAssets;
  const {changeBGM} = route.params;
  const button1 = useRef(new Animated.Value(0.9)).current;
  const button2 = useRef(new Animated.Value(0.9)).current;
  const button3 = useRef(new Animated.Value(0.9)).current;
  const burungRef = useRef(new Animated.Value(0)).current;
  const burungScale = useRef(new Animated.Value(0)).current;
  const rotateMonyet = useRef(new Animated.Value(0)).current;
  const rusaRef = useRef(new Animated.Value(0)).current;
  const jerapahRef = useRef(new Animated.Value(0)).current;
  const gajahRef = useRef(new Animated.Value(0)).current;
  const rumputRef = useRef(new Animated.Value(0)).current;
  const [tension, setTension] = useState(50);
  const [indexOpening, setIndexOpening] = useState(0);
  const [bahasa, setBahasa] = useState();
  const [isUpdateLang, setUpdateLang] = useState(false);
  const [voiceLanguage, setVoiceLang] = useState();

  function playVoice() {
    if (suaraOpening) {
      suaraOpening.play(soundCompleted);
    } else {
      suaraOpening = new Sound(voiceLanguage[indexOpening], err => {
        if (err) {
          console.log('error load opening sound', err);
        } else {
          suaraOpening.play(soundCompleted);
        }
      });
    }
    const soundCompleted = success => {
      if (suaraOpening) {
        if (success) {
          suaraOpening.release();
          suaraOpening = null;
          setTimeout(() => {
            setIndexOpening(indexOpening + 1);
          }, 500);
        }
      }
    };
  }
  function playAnimalSound(src) {
    let sound = new Sound(src, err => {
      if (err) {
        console.log('failed to load sound');
        return;
      }
      sound.setVolume(0.7);
      sound.play(succ => {
        if (succ) {
          sound.release();
          sound = null;
        }
      });
    });
  }
  const animasiButton = () => {
    Animated.stagger(200, [
      Animated.loop(
        Animated.spring(button1, {
          toValue: 1,
          friction: 1.6,
          tension,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.spring(button2, {
          toValue: 1,
          friction: 2,
          tension,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.spring(button3, {
          toValue: 1,
          friction: 2.2,
          tension,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  };
  const animasiBurung = () => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(burungRef, {
          toValue: 1,
          duration: 10000,
          easing: Easing.easeOutCirc,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.timing(burungScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ),
    ]).start(() => {
      animasiBurung();
    });
  };
  const animasiRusa = () => {
    Animated.sequence([
      Animated.timing(rusaRef, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(rusaRef, {
        toValue: 0,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animasiRusa();
    });
  };
  const animasiMonyet = () => {
    Animated.sequence([
      Animated.timing(rotateMonyet, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(rotateMonyet, {
        toValue: 0,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => animasiMonyet());
  };
  const animasiJerapah = () => {
    Animated.sequence([
      Animated.timing(jerapahRef, {
        toValue: 1,
        duration: 3000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(jerapahRef, {
        toValue: 0,
        duration: 3000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => animasiJerapah());
  };
  const animasiGajah = () => {
    Animated.sequence([
      Animated.timing(gajahRef, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(gajahRef, {
        toValue: 0,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => animasiGajah());
  };
  const switchLanguage = async lang => {
    let isLoading = true;
    try {
      if (isLoading) {
        console.log(`Current ${bahasa} ke ${lang}`);
        const jsonValue = JSON.stringify({language: lang});
        await AsyncStorage.setItem('@langConfig', jsonValue);
        setUpdateLang(true);
      }
    } catch (err) {
      console.error(err);
      setUpdateLang(false);
    }

    isLoading = false;
  };
  useEffect(() => {
    changeBGM(5, 10);
    animasiButton();
    animasiBurung();
    animasiMonyet();
    animasiJerapah();
    animasiRusa();
    animasiGajah();
  }, []);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const getData = async () => {
        try {
          const lang = await AsyncStorage.getItem('@langConfig');
          if (isActive) {
            const jsonVal = lang !== undefined ? JSON.parse(lang) : '';
            setBahasa(jsonVal.language);
            setVoiceLang(
              jsonVal.language === 'ID' ? openingVoice : openingVoiceEnglish,
            );
          }
        } catch (err) {
          console.error(err);
        }
      };

      getData();
      if (isUpdateLang) {
        console.log(`current : ${bahasa}`);
        setUpdateLang(false);
      }

      return () => {
        isActive = false;
        getData();
        if (suaraOpening) {
          suaraOpening.stop();
          suaraOpening.release();
        }
      };
    }, [bahasa, isUpdateLang]),
  );
  useEffect(() => {
    if (bahasa && indexOpening < voiceLanguage.length) {
      playVoice();
    }
    // console.log(`index ke ${indexOpening}`);
  }, [indexOpening, voiceLanguage]);
  return (
    <>
      <ImageBackground
        source={bgHomeImage}
        resizeMode="cover"
        style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            zIndex: 10,
            alignItems: 'flex-end',
            marginRight: 30,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('pagehewan')}
            style={[
              styles.button,
              {
                transform: [{scale: button1}],
              },
            ]}>
            <Home1 />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('tebakgambar')}
            style={[
              styles.button,
              {
                transform: [{scale: button2}],
              },
            ]}>
            <Home2 />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('tebaksuara')}
            style={[
              styles.button,
              {
                transform: [{scale: button3}],
              },
            ]}>
            <Home3 />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('tebakmakanan')}
            style={styles.button}>
            <Home4 />
          </TouchableOpacity> */}
        </View>
        <View style={{flex: 1, position: 'absolute'}}>
          <Animated.View
            style={{
              width: 150,
              height: 150,
              position: 'absolute',
              transform: [
                {
                  translateX: burungRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, -200],
                  }),
                },
                {
                  scale: burungScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                playAnimalSound(
                  animals.find(el => el.name === 'burung').animalSound,
                );
              }}>
              <Image
                source={animals.find(el => el.name === 'burung').image}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View
            style={{
              width: 333,
              height: 244,
              position: 'absolute',
              top: 150,
              left: 70,
              transform: [
                {
                  scale: gajahRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                playAnimalSound(
                  animals.find(el => el.name === 'gajah').animalSound,
                )
              }>
              <Image
                source={animals.find(el => el.name === 'gajah').image}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View
            style={{
              width: 140,
              height: 140,
              position: 'absolute',
              top: 250,
              left: 250,
              zIndex: 3,
              transform: [
                {
                  rotate: rotateMonyet.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '25deg'],
                  }),
                },
              ],
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                playAnimalSound(
                  animals.find(el => el.name === 'monyet').animalSound,
                )
              }>
              <Image
                source={animals.find(el => el.name === 'monyet').image}
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                }}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View
            style={{
              width: 210,
              height: 300,
              position: 'absolute',
              top: 100,
              transform: [
                {
                  translateX: jerapahRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: [460, 470],
                  }),
                },
              ],
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                playAnimalSound(
                  animals.find(el => el.name === 'jerapah').animalSound,
                )
              }>
              <Image
                source={animals.find(el => el.name === 'jerapah').image}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View
            style={{
              width: 200,
              height: 160,
              top: 230,
              zIndex: 3,
              position: 'absolute',
              transform: [
                {
                  translateX: rusaRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 390],
                  }),
                },
              ],
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                playAnimalSound(
                  animals.find(el => el.name === 'rusa').animalSound,
                )
              }>
              <Image
                source={animals.find(el => el.name === 'rusa').image}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
        <TouchableOpacity
          style={{
            width: 80,
            height: 67,
            position: 'absolute',
            top: 250,
            left: -5,
            zIndex: 10,
          }}
          onPress={() => switchLanguage(bahasa === 'ID' ? 'EN' : 'ID')}>
          <LangSwitch onSwitch={bahasa === 'EN' ? false : true} />
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            bottom: -70,
            left: 80,
            flexDirection: 'row',
            zIndex: 3,
          }}>
          <Grass1 isAnimated={true} width={150} height={120} />
          <Grass1
            isAnimated={false}
            width={140}
            height={100}
            style={{marginHorizontal: -20}}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -70,
            right: 10,
            flexDirection: 'row',
            zIndex: 3,
          }}>
          <Grass1 width={140} height={150} isAnimated={true} />
          <Grass2 width={150} height={150} style={{marginHorizontal: -10}} />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            width: 300,
            height: 50,
            zIndex: 3,
          }}>
          <BannerAd
            unitId={AppConfig.unitBanner}
            size={BannerAdSize.BANNER}
            requestOptions={{requestNonPersonalizedAdsOnly: true}}
            onAdFailedToLoad={err => console.error(err)}
          />
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  button: {width: 120, height: 86},
});
