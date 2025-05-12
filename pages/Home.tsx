import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native';

const {width, height} = Dimensions.get('window');

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

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
            name: data.data.responses[0] || 'User',
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
    }, 1000);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);

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
        <Text style={styles.buttonText}> CLICK HERE TO START!</Text>
        <Text style={styles.subheading}>Simple, Free and Instant.</Text>
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
    width: width * 0.75,
    height: height * 0.12,
    marginTop: height * 0.1,
    resizeMode: 'contain',
  },
  description: {
    marginTop: height * 0.15,
    textAlign: 'center',
    fontSize: width * 0.06,
    color: 'white',
    paddingHorizontal: width * 0.05,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 50,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    marginTop: height * 0.03,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button2: {
    backgroundColor: 'black',
    borderRadius: 50,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  buttonText2: {
    color: 'white',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subheading: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: '300',
    textAlign: 'center',
  },
});

export default Home;
