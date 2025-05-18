import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ImageBackground, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
const backgroundImage = require('../assets/back.png');
const centerImage = require('../assets/center.png');
const loadingLottie = require('../assets/abc.lottie');
const Lander = ({navigation}) => {
  const [uuid, setUuid] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const storeUuid = async () => {
    setIsLoading(true);
    setLoadingPercent(0); // start at 0

    try {
      const existingId = await AsyncStorage.getItem('uniqueUserId');
      console.log('Existing ID:', existingId);
      setUuid(existingId);

      // Start fake progress interval
      const progressInterval = setInterval(() => {
        setLoadingPercent(prev => {
          if (prev < 98) return prev + 1;
          return prev; // stop at 98% until real data is back
        });
      }, 100); // update every 100ms

      const response = await fetch(
        `https://benifit-gpt-be.onrender.com/api/messages/${existingId}`,
      );
      const data = await response.json();

      clearInterval(progressInterval); // clear fake progress
      setLoadingPercent(100); // jump to 100%

      if (!data.data) {
        navigation.navigate('Home');
        return;
      }

      if (data.data.isQualified) {
        navigation.navigate('Congrats', {
          isMedicare: data.data.qualifiedFor.medicare,
          isCreditDebt: data.data.qualifiedFor.creditDebtRelief,
          isDiscountedInsurence:
            data.data.qualifiedFor.discountedAutoInsurancePlan,
          isComponsation: data.data.qualifiedFor.higherCompensationForAccidents,
          isACA: data.data.qualifiedFor.aca,
          name: data.data.responses[0] || 'User',
        });
      }
    } catch (error) {
      console.error('Error in storeUuid:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    storeUuid();
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ImageBackground source={centerImage} style={{width: 300, height: 100}} />
      {isLoading && (
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color: 'white', marginTop: 10, fontSize: 16}}>
        {loadingPercent}%
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

export default Lander;
