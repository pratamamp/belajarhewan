import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrueNotif from '../component/benar';
import Choice from '../component/choice';
import Ending from '../component/endingpanel';
import FalseNotif from '../component/salah';

import {
  AppConfig,
  tebakGambarAssets,
  items,
  voiceFalseEng,
  voiceTrue,
  voiceFalse,
  voiceTrueEng,
} from '../config';
import {useFocusEffect} from '@react-navigation/native';
import ReplayIcon from '../component/replaybtn';
import Grass1 from '../component/grass/grass1';
import Grass2 from '../component/grass/grass2';

const shuffle = arr => {
  let j, x, index;
  for (let index = arr.length - 1; index > 0; index--) {
    j = Math.floor(Math.random() * (index + 1));
    x = arr[index];
    arr[index] = arr[j];
    arr[j] = x;
  }
  return arr;
};

function GameTebakGambar({navigation, route}) {
  const {bgImage, grassTopLeft, grassTopRight} = tebakGambarAssets;
  const {changeBGM} = route.params;
  const [isEnding, setIsEnding] = useState(false);
  const [question, setCurrentQuestion] = useState({
    id: null,
    name: '',
    answer: [],
  });
  const [currentIndex, setIndex] = useState(0);
  const [questionList, setQuestionList] = useState(items);
  const [maxQuestion, setMaxQuestion] = useState(5);
  const [notifTrue, setNotifTrue] = useState(false);
  const [notifFalse, setNotifFalse] = useState(false);
  const [willAnswer, setWillAnswer] = useState(false);
  const [trueAnswer, setTrue] = useState(0);
  const [falseAnswer, setFalse] = useState(0);
  const [trueCombo, setTrueCombo] = useState(0);
  const [falseCombo, setFalseCombo] = useState(0);
  const [point, setPoint] = useState(0);
  const [getStar, setGetStar] = useState(0);
  const [language, setLang] = useState();
  const [showInterstitial, setShowInterstitial] = useState(true);
  const bottomGrass = [
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
  ];
  let soundTebak, soundBenarSalah;

  function generateAnswer() {
    let answer = [];
    let rand = questionList.filter(
      item => item.id != questionList[currentIndex].id,
    );
    rand.forEach(item =>
      answer.push({id: item.id, status: false, name: item.name}),
    );
    const startNum = Math.floor(Math.random() * (rand.length - 2));

    rand = answer.slice(startNum, startNum + 2);
    rand.push({
      id: questionList[currentIndex].id,
      name: questionList[currentIndex].name,
      status: true,
    });
    return shuffle(rand);
  }

  function playSoundTebak() {
    if (soundTebak) {
      soundTebak.play(soundCompleted);
    } else {
      const item = items.find(({id}) => id === questionList[currentIndex].id);
      setWillAnswer(false);
      soundTebak = new Sound(
        language === 'ID' ? item.soundTebak : item.soundTebakEng,
        err => {
          if (err) {
            console.log('failed to load sound', err);
          } else {
            soundTebak.play(soundCompleted);
          }
        },
      );
    }

    function soundCompleted(success) {
      if (soundTebak) {
        if (success) {
          console.log('success finished playing');
          setWillAnswer(true);
        } else {
          console.log('playback failed');
        }
      }
    }
  }
  function showQuestion() {
    if (currentIndex < maxQuestion) {
      if (currentIndex === 0) {
        console.log('--- NEW LIST ---');
        setQuestionList(shuffle(items));
        setTrue(0);
        setFalse(0);
        setPoint(0);
        setTrueCombo(0);
        setFalseCombo(0);
      }

      setCurrentQuestion({
        id: questionList[currentIndex].id,
        name: questionList[currentIndex].name,
        answer: generateAnswer(),
      });
      language && playSoundTebak();
    } else {
      // ending question
      showEnding();
    }
  }
  function showEnding() {
    setIsEnding(true);
    setGetStar(Math.floor(((point / maxQuestion) * 100) / 33.3));
  }
  function playSFX(id, isCorrectAnswer) {
    if (soundBenarSalah) {
      soundBenarSalah.play(sfxCompleted);
    } else {
      console.log(`[play sfx]${isCorrectAnswer}`, id);
      let trueVoice = language === 'ID' ? voiceTrue : voiceTrueEng;
      let falseVoice = language === 'ID' ? voiceFalse : voiceFalseEng;
      let path = isCorrectAnswer
        ? id < trueVoice.length
          ? trueVoice[id]
          : trueVoice[trueVoice.length - 2]
        : id < falseVoice.length
        ? falseVoice[id]
        : falseVoice[falseVoice.length - 2];
      soundBenarSalah = new Sound(path, err => {
        if (err) {
          console.log('failed to load sfx');
        } else {
          soundBenarSalah.play(sfxCompleted);
        }
      });
    }
    function sfxCompleted(success) {
      if (soundBenarSalah) {
        if (success) {
          setIndex(currentIndex + 1);
          setNotifTrue(false);
          setNotifFalse(false);
        } else {
          console.log('playback failed sfx');
        }
      }
    }
  }
  function onAnswer(value) {
    return function () {
      console.log(`jawaban: ${value}`);
      if (willAnswer) {
        if (value) {
          setTrue(trueAnswer + 1);
          setTrueCombo(trueCombo + 1);
          setFalseCombo(0);
          setNotifTrue(true);
          playSFX(trueCombo, true);
          setPoint(point + 1);
        } else {
          setFalse(falseAnswer + 1);
          setTrueCombo(0);
          setFalseCombo(falseCombo + 1);
          setNotifFalse(true);
          playSFX(falseCombo, false);
        }
        setWillAnswer(false);
      }
    };
  }
  function repeatHandler() {
    setIndex(0);
    setTrueCombo(0);
    setFalseCombo(0);
    setTrue(0);
    setFalse(0);
    setIsEnding(false);
  }
  function backToHome() {
    // setTimeout(() => {
    //   navigation.replace('home');
    //   setShowInterstitial(true);
    // }, 1000);
    navigation.replace('home');
  }
  function releaseAllSound() {
    if (soundTebak) {
      soundTebak.release();
      soundTebak = null;
    }
    if (soundBenarSalah) {
      soundBenarSalah.release();
      soundBenarSalah = null;
    }
  }
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const getData = async () => {
        try {
          const lang = await AsyncStorage.getItem('@langConfig');
          if (isActive) {
            const jsonVal = lang !== undefined ? JSON.parse(lang) : '';
            setLang(jsonVal.language);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getData();
      // const onBeforeRemove = e => {
      //   e.preventDefault();
      //   console.log('back pressed!');
      //   setShowInterstitial(true);
      //   navigation.dispatch(e.data.action);
      // };
      // navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        isActive = false;
        // navigation.removeListener('beforeRemove', onBeforeRemove);
      };
    }, [questionList, adDismissed, adLoaded]),
  );
  useEffect(() => {
    changeBGM(3, 0);

    return () => {
      changeBGM(5, 10);
    };
  }, []);
  useEffect(() => {
    showQuestion();
    return () => {
      setQuestionList(items);
      releaseAllSound();
    };
  }, [currentIndex, questionList, language]);

  return (
    <View style={{flex: 1}}>
      <Image
        source={bgImage}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        blurRadius={2}
        resizeMode="cover"
      />
      {willAnswer && (
        <TouchableOpacity
          onPress={() => playSoundTebak()}
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
            zIndex: 3,
          }}>
          <ReplayIcon width={60} height={60} />
        </TouchableOpacity>
      )}
      {!isEnding && (
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 60,
            zIndex: 1,
          }}>
          {!notifTrue && !notifFalse ? (
            question.answer.map(item => {
              return (
                <Choice
                  key={item.id}
                  idHewan={item.id}
                  status={item.status}
                  pressHandler={onAnswer}
                />
              );
            })
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {notifTrue ? <TrueNotif /> : <FalseNotif />}
            </View>
          )}
        </View>
      )}
      {isEnding && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ending
            onRepeat={repeatHandler}
            onHome={backToHome}
            point={getStar}
          />
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: -50,
          flexDirection: 'row',
          zIndex: 2,
        }}
        pointerEvents="none">
        {bottomGrass.map((item, index) => {
          return item ? (
            <Grass1
              key={index}
              isAnimated={true}
              width={150}
              height={120}
              style={{marginHorizontal: -20}}
            />
          ) : (
            <Grass2
              key={index}
              width={150}
              height={120}
              style={{marginHorizontal: -20}}
            />
          );
        })}
      </View>

      <View
        style={{
          width: 300,
          height: 300,
          margin: -100,
          position: 'absolute',
          zIndex: 2,
        }}
        pointerEvents="none">
        <Image
          source={grassTopLeft}
          style={{width: '100%', height: '100%'}}
          blurRadius={2}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          width: 320,
          height: 320,
          margin: -70,
          position: 'absolute',
          right: 0,
          zIndex: 2,
        }}
        pointerEvents="none">
        <Image
          source={grassTopRight}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export default GameTebakGambar;
