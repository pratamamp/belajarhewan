import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatGrid} from 'react-native-super-grid';
import DetailSVGtext from '../component/animaltext';
import {pageAssets, items, iconButtons} from '../config';

let suaraOpening;
export default function PageHewan({route, navigation}) {
  const {changeBGM, addCountAds} = route.params;
  const {bgImage, openingVoice, openingVoiceEnglish} = pageAssets;
  const [playMonolog, setMonolog] = useState(true);
  const [voiceLanguage, setVoiceLang] = useState();

  function playVoice() {
    if (suaraOpening) {
      suaraOpening.play(soundCompleted);
    } else {
      suaraOpening = new Sound(voiceLanguage, err => {
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
        }
      }
    };
  }
  function backToHome() {
    navigation.navigate('home');
  }
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const getData = async () => {
        try {
          const lang = await AsyncStorage.getItem('@langConfig');
          if (isActive) {
            const jsonVal = lang !== undefined ? JSON.parse(lang) : '';
            setVoiceLang(
              jsonVal.language === 'ID' ? openingVoice : openingVoiceEnglish,
            );
          }
        } catch (err) {
          console.error(err);
        }
      };
      addCountAds();
      getData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    // changeBGM(3, 0);

    playMonolog && playVoice();

    return () => {
      changeBGM(5, 20);
      if (suaraOpening) {
        suaraOpening.release();
        suaraOpening = null;
      }
    };
  }, [voiceLanguage]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <Image
        source={bgImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          flex: 1,
          resizeMode: 'cover',
          width: null,
          height: null,
        }}
        blurRadius={4}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            marginTop: 10,
            position: 'absolute',
            left: 0,
          }}
          onPress={() => backToHome()}>
          <Image
            source={iconButtons.homeBtn}
            style={{
              height: 80,
              width: 80,
              opacity: 0.8,
            }}
          />
        </TouchableOpacity>
        <DetailSVGtext
          text={'PILIH HEWAN'}
          style={{
            marginLeft: 80,
            opacity: 0.9,
            fill: 'green',
            strokeColor: 'white',
            fontSize: 50,
          }}
        />
      </View>
      <View
        style={{
          flex: 5,
        }}>
        <FlatGrid
          itemDimension={130}
          data={items}
          style={{
            flex: 1,
            marginHorizontal: 20,
          }}
          spacing={2}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate('detail', {
                  itemId: item.id,
                })
              }>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 12,
    borderColor: 'rgba(100, 100, 100, 0.4)',
    margin: 4,
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    width: '90%',
    height: '90%',
    justifyContent: 'flex-end',
  },
  itemName: {
    fontFamily: 'Boogaloo-Regular',
    fontSize: 20,
  },
});
