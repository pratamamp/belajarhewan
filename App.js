import React, {useEffect, useState, useRef} from 'react';
import {View, AppState, LogBox} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppConfig} from './config';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './pages/splash';
import Home from './pages/home';
import PageHewan from './pages/listhewan';
import DetailPage from './pages/detail';
import GameTebakGambar from './pages/pagetebakgambar';
import GameTebakSuara from './pages/pagetebaksuara';
import mobileAds, {
  MaxAdContentRating,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const Stack = createNativeStackNavigator();
Sound.setCategory('Playback');
let bgmSound;

function App() {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const [isLoaded, setLoaded] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [currentbgmID, setbgmID] = useState();
  const [bgmTime, setbgmTime] = useState(0);
  const [isPlayingBGM, setIsPlayBGM] = useState(false);
  const [lang, setLang] = useState();
  const {bgm} = AppConfig;
  const [interstitialCounter, setCounter] = useState(0);
  const interstitial = InterstitialAd.createForAdRequest(
    AppConfig.unitInterstitial,
    {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    },
  );
  const [adsLoaded, setAdsLoaded] = useState(false);

  async function createNewLang() {
    try {
      const jsonVal = JSON.stringify({language: 'ID'});
      await AsyncStorage.setItem('@langConfig', jsonVal);
    } catch (err) {
      console.error(err);
    }
  }

  async function getSavedLang() {
    try {
      const jsonVal = await AsyncStorage.getItem('@langConfig');
      return jsonVal != null ? JSON.parse(jsonVal) : createNewLang();
    } catch (error) {
      console.error(error);
    }
  }

  function onSplashFinish(val) {
    setLoaded(val);
  }

  useEffect(() => {
    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // console.log('request config successfully!');
        mobileAds()
          .initialize()
          .then(adapter => {
            console.log('init & config success!');
            console.log(adapter);
          });
      });

    getSavedLang();
  }, []);

  useEffect(() => {
    const eventListener = interstitial.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        console.log('ads ada!');
        setAdsLoaded(true);
      }
      if (type === AdEventType.OPENED) {
        console.log('ads played');
      }
      if (type === AdEventType.CLOSED) {
        setAdsLoaded(false);
        console.log('ads closed');
      }
    });

    interstitial.load();
    return () => eventListener();
  }, [adsLoaded]);

  function changeBGM(id, time) {
    setbgmID(time);
    isNaN(id) ? setbgmID(0) : setbgmID(id);
  }

  function addCountAds() {
    setCounter(interstitialCounter + 1);
    if (adsLoaded) interstitial.show();
    return interstitialCounter;
  }

  function playBGM(id) {
    console.log('playbgm', id);
    if (bgmSound) {
      // eslint-disable-next-line no-undef
      bgmSound.play(onCompleted);
    } else {
      bgmSound = new Sound(bgm[currentbgmID], err => {
        if (err) {
          console.log('error load bgm sound');
          return;
        } else {
          bgmSound.setVolume(0.7);
          bgmSound.setNumberOfLoops(-1);
          bgmSound.setCurrentTime(bgmTime);
          bgmSound.play(onCompleted);
        }
      });

      function onCompleted(succ) {
        if (bgmSound && succ) {
          bgmSound.release();
          bgmSound = null;
        }
      }
    }
  }

  useEffect(() => {
    isLoaded && isPlayingBGM && playBGM(currentbgmID);
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        bgmSound && bgmSound.play();
      } else {
        bgmSound && bgmSound.pause();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('Appstate', appState.current);
    });
    return () => {
      if (bgmSound) {
        bgmSound.release();
        bgmSound = null;
      }

      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentbgmID]);
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      {isLoaded ? (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="home">
            <Stack.Screen
              name="home"
              options={{headerShown: false}}
              initialParams={{changeBGM, lang}}
              component={Home}
            />
            <Stack.Screen
              name="pagehewan"
              options={{headerShown: false}}
              initialParams={{changeBGM, addCountAds}}
              component={PageHewan}
            />
            <Stack.Screen
              name="detail"
              options={{headerShown: false}}
              initialParams={{changeBGM}}
              component={DetailPage}
            />
            <Stack.Screen
              name="tebakgambar"
              options={{headerShown: false}}
              initialParams={{changeBGM}}
              component={GameTebakGambar}
            />
            <Stack.Screen
              name="tebaksuara"
              options={{headerShown: false}}
              initialParams={{changeBGM}}
              component={GameTebakSuara}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <Splash onFinished={onSplashFinish} />
      )}
    </View>
  );
}

export default App;
