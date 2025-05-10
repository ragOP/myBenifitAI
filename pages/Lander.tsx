import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';

const backgroundImage = require('../assets/back.png');
const centerImage = require('../assets/center.png');
import AsyncStorage from '@react-native-async-storage/async-storage';
const Lander = ({navigation}) => {
  const [uuid, setUuid] = useState<any>();
  const storeUuid = async () => {
    try {
      const existingId = await AsyncStorage.getItem('uniqueUserId');
      console.log('Existing ID:', existingId);
      setUuid(existingId);

      const response = await fetch(
        `https://benifit-gpt-be.onrender.com/api/messages/${existingId}`,
      );
      const data = await response.json();
      if(!data.data) {
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
    </ImageBackground>
  );
};

export default Lander;
