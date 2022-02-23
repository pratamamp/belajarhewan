import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import DetailSVGtext from '../component/animaltext';
import {detailAssets, iconButtons, items} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage/';
import {useFocusEffect} from '@react-navigation/core';
import Sound from 'react-native-sound';

let suaraOpening, animalSound;
function DetailPage({route, navigation}) {
  const {itemId, changeBGM} = route.params;
  const item = items.find(({id}) => id === itemId);
  const [voiceAnimal, setVoiceAnimal] = useState();

  function playVoice() {
    if (suaraOpening) {
      suaraOpening.play(onCompleted);
    } else {
      suaraOpening = new Sound(voiceAnimal, err => {
        if (err) {
          console.log('error load opening sound', err);
        } else {
          suaraOpening.play(onCompleted);
        }
      });
    }
    const onCompleted = success => {
      if (suaraOpening) {
        if (success) {
          suaraOpening.release();
          setTimeout(() => {
            playAnimalSound();
          }, 500);
        }
      }
    };
  }
  function playAnimalSound() {
    if (animalSound) {
      animalSound.play(onCompleted);
    } else {
      animalSound = new Sound(item.soundAnimal, err => {
        if (err) {
          console.error(err);
        } else {
          animalSound.play(onCompleted);
        }
      });
    }

    const onCompleted = success => {
      if (animalSound) {
        if (success) {
          animalSound.release();
          animalSound = null;
        }
      }
    };
  }
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const getData = async () => {
        try {
          const lang = await AsyncStorage.getItem('@langConfig');
          if (isActive) {
            const jsonVal = lang !== undefined ? JSON.parse(lang) : '';
            setVoiceAnimal(
              jsonVal.language === 'ID' ? item.soundName : item.soundNameEng,
            );
          }
        } catch (err) {
          console.error(err);
        }
      };
      getData();

      return () => {
        isActive = false;
      };
    }, []),
  );
  useEffect(() => {
    voiceAnimal && playVoice();
    changeBGM(2, 0);
    return () => {
      if (suaraOpening) {
        suaraOpening.release();
        suaraOpening = null;
      }
      if (animalSound) {
        animalSound.release();
        animalSound = null;
      }
    };
  }, [voiceAnimal]);
  return (
    <ImageBackground
      source={detailAssets.bgImage}
      style={{flex: 1, justifyContent: 'space-between'}}
      resizeMode="cover">
      <TouchableOpacity
        onPress={() => navigation.replace('pagehewan')}
        style={[styles.touch, {elevation: 3, margin: 5}]}>
        <Image source={iconButtons.backBtn} style={styles.touchImage} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback onPress={() => playAnimalSound()}>
          <View style={{width: 300, height: 300, top: 0, left: 20}}>
            <Image
              source={item.image}
              style={{width: '100%', height: '100%'}}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          width: 439,
          height: 85,
          justifyContent: 'center',
        }}>
        <Image
          source={iconButtons.iconPohon}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          resizeMode="contain"
        />
        <DetailSVGtext
          text={item.name}
          style={{
            marginLeft: 80,
            opacity: 0.9,
            fill: 'white',
            strokeColor: 'green',
            fontSize: 50,
          }}
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  touch: {
    width: 80,
    height: 80,
  },
  touchImage: {
    flex: 1,
    width: null,
    height: null,
  },
});
export default DetailPage;
