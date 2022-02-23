import React, {useState, useEffect, useCallback} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Sound from 'react-native-sound';
import {useFocusEffect} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Choice from '../component/choice';
import TrueNotif from '../component/benar';
import FalseNotif from '../component/salah';
import {
  detailAssets,
  items,
  tebakSuaraAssets,
  voiceTrue,
  voiceTrueEng,
  voiceFalse,
  voiceFalseEng,
} from '../config';
import Ending from '../component/endingpanel';
import ReplayIcon from '../component/replaybtn';

Sound.setCategory('Playback');

function shuffle(arr) {
  let j, x, index;
  for (let index = arr.length - 1; index > 0; index--) {
    j = Math.floor(Math.random() * (index + 1));
    x = arr[index];
    arr[index] = arr[j];
    arr[j] = x;
  }
  return arr;
}

function GameTebakSuara({navigation, route}) {
  const {bgImage} = detailAssets;
  const {tebakVoice, tebakVoiceEng} = tebakSuaraAssets;
  const [question, setCurrentQuestion] = useState({
    id: null,
    name: '',
    answer: [],
  });
  const {changeBGM} = route.params;
  const [willAnswer, setWillAnswer] = useState(false);
  const [maxQuestion, setMaxQuestion] = useState(5);
  const [notifTrue, setNotifTrue] = useState(false);
  const [notifFalse, setNotifFalse] = useState(false);
  const [trueCombo, setTrueCombo] = useState(0);
  const [falseCombo, setFalseCombo] = useState(0);
  const [trueAnswer, setTrue] = useState(0);
  const [falseAnswer, setFalse] = useState(0);
  const [questionList, setQuestionList] = useState(items);
  const [currentIndex, setIndex] = useState(0);
  const [language, setLang] = useState();
  const [isEnding, setIsEnding] = useState(false);
  const [point, setPoint] = useState(0);
  const [getStar, setGetStar] = useState(0);
  let suaraTanya, suaraHewan, soundBenarSalah;

  function playSoundTebak() {
    if (suaraTanya) {
      suaraTanya.play(soundCompleted);
    } else {
      setWillAnswer(false);
      suaraTanya = new Sound(
        language === 'ID' ? tebakVoice : tebakVoiceEng,
        err => {
          if (err) {
            console.log('failed to load sound', err);
          } else {
            suaraTanya.play(soundCompleted);
          }
        },
      );
    }

    function soundCompleted(success) {
      if (suaraTanya) {
        if (success) {
          console.log('finished tanya!');
          setTimeout(() => {
            playAnimalSound();
          }, 500);
        } else {
          console.log('failed error');
        }
      }
    }
  }

  function playAnimalSound() {
    if (suaraHewan) {
      suaraHewan.play(onCompleted);
    } else {
      const item = items.find(({id}) => id === questionList[currentIndex].id);
      console.log('[SFX hewan]', item.name);
      suaraHewan = new Sound(item.soundAnimal, err => {
        if (err) {
          console.log('failed play sfx', err);
        } else {
          suaraHewan.play(onCompleted);
        }
      });
    }
    function onCompleted(succ) {
      if (suaraHewan) {
        if (succ) {
          console.log('finished sfx');
          setWillAnswer(true);
        } else {
          console.log('failed completed sfx');
        }
      }
    }
  }

  function playSFX(id, isCorrectAnswer) {
    if (soundBenarSalah) {
      soundBenarSalah.play(sfxCompleted);
    } else {
      console.log(`[play sfx] ${isCorrectAnswer}`, id);
      let trueVoice = language === 'ID' ? voiceTrue : voiceTrueEng;
      let falseVoice = language === 'ID' ? voiceFalse : voiceFalseEng;
      let path = isCorrectAnswer
        ? id < trueVoice.length
          ? trueVoice[id]
          : trueVoice[trueVoice.length - 1]
        : id < falseVoice.length
        ? falseVoice[id]
        : falseVoice[falseVoice.length - 1];
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
          soundBenarSalah.release();
          soundBenarSalah = null;
        } else {
          console.log('playback failed sfx');
        }
      }
    }
  }
  function showQuestion() {
    if (currentIndex < maxQuestion) {
      if (currentIndex === 0) {
        console.log('--- NEW LIST ---');
        setQuestionList(shuffle(items));
      }
      setCurrentQuestion({
        id: questionList[currentIndex].id,
        name: questionList[currentIndex].name,
        answer: generateAnswer(),
      });
      language && playSoundTebak();
    } else {
      // show ending
      showEnding();
    }
  }
  function showEnding() {
    setIsEnding(true);
    setGetStar(Math.floor(((point / maxQuestion) * 100) / 33.3));
  }
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
    navigation.navigate('home');
  }
  function releaseAllSound() {
    if (suaraTanya) {
      suaraTanya.release();
      suaraTanya = null;
    }
    if (suaraHewan) {
      suaraHewan.release();
      suaraHewan = null;
    }
    if (soundBenarSalah) {
      soundBenarSalah.release();
      soundBenarSalah = null;
    }
  }
  useEffect(() => {
    showQuestion();

    return () => {
      setQuestionList(items);
      releaseAllSound();
    };
  }, [currentIndex, language, questionList]);
  useEffect(() => {
    changeBGM(4, 10);
    return () => {
      changeBGM(5, 10);
    };
  }, []);
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
      return () => {
        isActive = false;
        releaseAllSound();
      };
    }, [questionList]),
  );
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Image
        source={bgImage}
        style={{width: '100%', height: '100%', position: 'absolute'}}
        resizeMode="stretch"
        blurRadius={1}
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
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 100,
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
    </View>
  );
}

export default GameTebakSuara;
