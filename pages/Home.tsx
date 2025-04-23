import React from 'react';
import { ImageBackground, Text, TouchableOpacity, StyleSheet } from 'react-native';

const backgroundImage = require('../assets/back.png');
const centerImage = require('../assets/center.png');

const Home = () => {
  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.container}
    >
      <ImageBackground 
        source={centerImage} 
        style={styles.centerImage} 
      />
      <Text style={styles.description}>
        I will help you claim benefits{'\n'}
        you are qualified for in next{'\n'}
        <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
          60 seconds
        </Text>{' '}
        for free!
      </Text>
      <TouchableOpacity style={styles.button}>
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
