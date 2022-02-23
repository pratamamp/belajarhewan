import React, {useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useInterstitialAd,
} from '@react-native-admob/admob';

export default function TestScreen({navigation}) {
  const {adLoaded, adDismissed, load, show} = useInterstitialAd(
    TestIds.REWARDED_INTERSTITIAL,
  );

  const bannerRef = useRef(null);

  useEffect(() => {
    console.log('load interstitial');
    if (adLoaded) {
      show();
    }
  }, [adLoaded]);

  useEffect(() => {
    if (adDismissed) {
      navigation.navigate('home');
    }
  }, [adDismissed, navigation]);

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Test</Text>
      <View style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}>
        <BannerAd
          size={BannerAdSize.FULL_BANNER}
          unitId={TestIds.BANNER}
          onAdFailedToLoad={err => console.error(err)}
          ref={bannerRef}
        />
      </View>
    </View>
  );
}
