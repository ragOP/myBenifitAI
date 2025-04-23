import React from 'react';
import {ImageBackground, Text} from 'react-native';

const backgroundImage = require('../assets/back.png');
const centerImage = require('../assets/center.png');
const Lander = () => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ImageBackground source={centerImage} style={{width: 300, height: 100}} />
    </ImageBackground>
  );
};

export default Lander;
