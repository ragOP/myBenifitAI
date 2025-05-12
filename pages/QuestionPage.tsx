import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Animated,
  StatusBar,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';

const backgroundImage = require('../assets/back.png');

type QuestionType = 'choice' | 'text';

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  keyType?: 'alphabet' | 'numeric';
}

const questions: Question[] = [
  {id: 1, text: "What's your Full Name?", type: 'text', keyType: 'alphabet'},
  {id: 2, text: "What's your Running Age?", type: 'text', keyType: 'numeric'},
  {id: 3, text: "What's your zipcode?", type: 'text', keyType: 'numeric'},
  {
    id: 4,
    text: 'What is your email address?',
    type: 'text',
    keyType: 'alphabet',
  },
  {id: 5, text: 'Are you on Medicare?', type: 'choice', options: ['Yes', 'No']},
  {
    id: 6,
    text: 'Do you have any of the following health conditions?',
    type: 'choice',
    options: ['Alzheimers', 'Diabetes', 'Hypertension', 'Arthritis', 'No'],
  },
  {
    id: 7,
    text: 'Do you own your home or rent?',
    type: 'choice',
    options: ['I Own', 'I Rent'],
  },
  {
    id: 8,
    text: 'Do you drive atleast once a week?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
  {
    id: 9,
    text: 'Do you have any DUIs in the last 6 months?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
  {
    id: 10,
    text: 'Have you faced any motor vehicle accidents in the last 2 years?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
  {
    id: 11,
    text: 'Do you have any children between the age of 18-64?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
  {
    id: 12,
    text: 'Do you have a credit card debt of 10,000 or more?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
  {
    id: 13,
    text: 'Do you exercise at least once a week?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
];

const QuestionPage: React.FC = ({navigation, route}) => {
  const {uuid} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [inputValue, setInputValue] = useState<string>('');
  const [isMedicare, setIsMedicare] = useState<boolean>(true);
  const [isCreditDebt, setIsCreditDebt] = useState<boolean>(true);
  const [isDiscountedInsurence, setIsDiscountedInsurance] =
    useState<boolean>(true);
  const [isComponsation, setIsComponsation] = useState<boolean>(true);
  const [isACA, setIsACA] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  // console.log("uuid", uuid);

  const currentQuestion = questions[currentIndex];

  const slideInFromRight = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const sendMessagesToServer = async (messages: Record<number, string>) => {
    try {
      const qualifiedFor = {
        medicare: !!isMedicare,
        creditDebtRelief: !!isCreditDebt,
        discountedAutoInsurancePlan: !!isDiscountedInsurence,
        higherCompensationForAccidents: !!isComponsation,
        aca: !!isACA,
      };

      const replies = Object.keys(messages)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => messages[Number(key)]);

      const payload = {
        userId: uuid,
        replies,
        qualifiedFor,
      };

      if (!uuid || replies.length === 0) {
        console.log('Invalid payload:', payload);
        return;
      }

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(
        'https://benifit-gpt-be.onrender.com/api/messages',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        console.log('Error:', response);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Messages sent successfully:', data);
    } catch (error) {
      console.log('Error sending messages:', error);
    }
  };

  const handleNext = (answer: string) => {
    if (questions[currentIndex].id === 7) {
      setIsDiscountedInsurance(answer === 'Yes');
    } else if (questions[currentIndex].id === 8) {
      setIsComponsation(answer === 'Yes');
    } else if (questions[currentIndex].id === 9) {
      setIsACA(answer === 'Yes');
    } else if (questions[currentIndex].id === 10) {
      setIsCreditDebt(answer === 'Yes');
    }

    if (questions[currentIndex].id === 1) {
      setName(answer);
    }
    if (currentIndex < questions.length - 1) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentIndex].id]: answer,
      }));
      setCurrentIndex(prev => prev + 1);
      setInputValue('');
      slideInFromRight();
    } else {
      sendMessagesToServer(answers);
      navigation.navigate('LoadingPage', {
        isMedicare,
        isCreditDebt,
        isDiscountedInsurence,
        isComponsation,
        isACA,
        name,
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePincode = (pincode: string): boolean => {
    const pinRegex = /^\d{5,6}$/;
    return pinRegex.test(pincode);
  };

  // const handleTextSubmit = () => {
  //   if (inputValue.trim()) {
  //     handleNext(inputValue.trim());
  //   }
  // };
  const handleTextSubmit = () => {
    const trimmed = inputValue.trim();
    const questionId = currentQuestion.id;

    if (!trimmed) return;

    if (questionId === 3 && !validatePincode(trimmed)) {
      Alert.alert('Please enter a valid 5 or 6-digit zipcode.');
      return;
    }

    if (questionId === 4 && !validateEmail(trimmed)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }

    handleNext(trimmed);
  };

  const progress = (currentIndex + 1) / questions.length;
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.darkOverlay} />

        <View style={styles.whiteHintOverlay} />

        <View style={styles.blurOverlay}>
          <Text>Loading...</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
          </View>

          <View style={styles.header}>
            <Image
              source={require('../assets/center.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderText}>
              22,578 Seniors Helped In Last 24 Hours!
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.inner}>
            <Animated.View style={{transform: [{translateX: slideAnim}]}}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
              <Text style={styles.subText}>
                This helps us personalize your experience
              </Text>

              {currentQuestion.type === 'choice' ? (
                currentQuestion.options?.map((opt, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.optionButton}
                    onPress={() => handleNext(opt)}>
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                ))
              ) : (
                <TextInput
                  style={styles.input}
                  keyboardType={
                    currentQuestion.keyType === 'numeric'
                      ? 'numeric'
                      : 'default'
                  }
                  placeholder="Type here..."
                  placeholderTextColor="#aaa"
                  returnKeyType="done"
                  onSubmitEditing={handleTextSubmit}
                  value={inputValue}
                  onChangeText={text => setInputValue(text)}
                  autoFocus={true}
                />
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default QuestionPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  whiteHintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    paddingVertical: 10,
    alignItems: 'center',
    height: 80,
    zIndex: 10,
  },

  subHeader: {
    position: 'absolute',
    top: 120, // directly below header
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 5,
  },

  logo: {
    width: '60%',
    height: 60,
    resizeMode: 'contain',
  },

  subHeaderText: {
    color: '#000',
    fontSize: 12,
    marginTop: 1,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    top: '20%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#facc15',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  questionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 24,
  },
  subText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 18,
    color: '#fff',
  },
});
