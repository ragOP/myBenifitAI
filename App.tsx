import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import QuestionPage from './pages/QuestionPage';
import Congratulations from './pages/Congralutions';
import Lander from './pages/Lander';
import LoadingPage from './pages/LoadingPage';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lander">
        <Stack.Screen name="Lander" component={Lander} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="ChatPage" component={QuestionPage} options={{headerShown: false}} />
        <Stack.Screen name="Congrats" component={Congratulations} options={{headerShown: false}} />
        <Stack.Screen name="LoadingPage" component={LoadingPage} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
