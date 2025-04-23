import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('../assets/back.png');
const centerImage = require('../assets/center.png');

const Home = ({navigation}) => {
  const [uuid, setUuid] = useState<any>();
  const [isAlreadyQualified, setIsAlreadyQualified] = useState(false);
  const [userData, setUserData] = useState({
    isMedicare: '',
    isCreditDebt: '',
    isDiscountedInsurence: '',
    isComponsation: '',
    isACA: '',
    name: '',
  });

  const generateUniqueId = () => {
    return (
      Date.now().toString() + Math.floor(Math.random() * 1000000).toString()
    );
  };

  const storeUuid = async () => {
    try {
      const existingId = await AsyncStorage.getItem('uniqueUserId');

      if (!existingId) {
        const randomUuid = generateUniqueId();
        await AsyncStorage.setItem('uniqueUserId', randomUuid);
        setUuid(randomUuid);
      } else {
        setUuid(existingId);

        const response = await fetch(
          `https://benifit-gpt-be.onrender.com/api/messages/${existingId}`,
        );
        const data = await response.json();
        console.log('Response data:', data.data);
        if (data.data.isQualified) {
          setUserData({
            isMedicare: data.data.qualifiedFor.medicare,
            isCreditDebt: data.data.qualifiedFor.creditDebtRelief,
            isDiscountedInsurence:
              data.data.qualifiedFor.discountedAutoInsurancePlan,
            isComponsation:
              data.data.qualifiedFor.higherCompensationForAccidents,
            isACA: data.data.qualifiedFor.aca,
            name: data.data.responses[1] || 'User',
          });
          setIsAlreadyQualified(true);
        }
      }
    } catch (error) {
      console.error('Error in storeUuid:', error);
    }
  };

  const handleStartNow = () => {
    setTimeout(() => {
      if (isAlreadyQualified) {
        navigation.navigate('Congrats', {
          isMedicare: userData.isMedicare,
          isCreditDebt: userData.isCreditDebt,
          isDiscountedInsurence: userData.isDiscountedInsurence,
          isComponsation: userData.isComponsation,
          isACA: userData.isACA,
          name: userData.name,
        });
        return;
      } else {
        navigation.navigate('ChatPage', {
          uuid: uuid,
        });
      }
    }, 4000);
  };

  useEffect(() => {
    storeUuid();
  }, []);
  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <ImageBackground source={centerImage} style={styles.centerImage} />
      <Text style={styles.description}>
        I will help you claim benefits{'\n'}
        you are qualified for in next{'\n'}
        <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>
          60 seconds
        </Text>{' '}
        for free!
      </Text>
      <TouchableOpacity onPress={handleStartNow} style={styles.button}>
        <Text style={styles.buttonText}> CLICK HERE TO START</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2}>
        <Text style={styles.buttonText2}> Over 2M+ Seniors Helped 💸</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerImage: {
    width: 300,
    height: 100,
    marginTop: 60,
  },
  description: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 26,
    color: 'white',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button2: {
    backgroundColor: 'black',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonText2: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
