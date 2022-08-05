import React from 'react';
import { Image, FlatList, Button, Platform, StyleSheet, AppButton, TouchableOpacity, TouchableHighlightStyleSheet, Text, View, Dimensions, Animated, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { configureFonts, DefaultTheme, Provider as PaperProvider} from 'react-native';
import { render } from 'react-dom';
import { Audio } from 'expo-av'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
import Icon from 'react-native-vector-icons/Ionicons'
import LetterComponent from '/Users/jiya/Games-Rwanda/sub-games/FrenchTilesGame/LetterComponent.js';
import DropTiles from '/Users/jiya/Games-Rwanda/sub-games/FrenchTilesGame/DropTiles.js';
import SubmitButton from './SubmitButton';

const FILES_API_ROOT = 'http://54.69.90.57/api/words/files/';

function shuffleLetters(orig_array) {
  const array = new Array();
  array.push(...orig_array);
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1) + 0);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
return array;
}

export default class EnglishTilesGame extends React.Component {
   constructor() {
   super();
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      correctAnswer: false,
      wrongAnswer: false,
      userAnswer: new Array(),
      vocabCards: new Array(),
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });
    this.sound = new Audio.Sound();
  }

  async loadVocabCards() {
    try {
      const response = await fetch('http://54.69.90.57/api/words');
      const json = await response.json();
      // parse the json and prepare it in the format you need it
      for (var x = 0; x < json.words.length; x++) {
        this.state.vocabCards.push(json.words[x])
        this.state.vocabCards[x].letters = json.words[x].frenchText.split('');
        this.state.vocabCards[x].shuffledLetters = shuffleLetters(json.words[x].frenchText.split(''));
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // audio
   // audio device adjustment 
    async componentDidMount() {
      this.loadVocabCards();
      Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
    }); 

    // doesn't play when app isn't on 
    this.status = {
      shouldPlay: false,
    };
    }

    // play file 
    playSound() {
      // audio file
      const audioFile = this.state.vocabCards[this.state.currentIndex].wolofAudio;
      this.sound.loadAsync({uri: FILES_API_ROOT.concat(audioFile)}, this.status, false).then(
        ()=>{
        this.sound.replayAsync().then(
          ()=>{
          this.sound = new Audio.Sound();
        });
      });
      
    }
  
  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex - 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    });
  }

  handleWrongAnswer = () =>{
    this.setState({
      ...this.state,
      userAnswer: new Array(),
    })
  }

  renderVocabCards = (vocabCards) => {
    return vocabCards.map((item, i) => {
      console.log(i);
      const measurements = new Array();
      this.userAnswer = new Array();
      if (this.state.currentIndex >= vocabCards.length) {this.state.currentIndex = 0}
      if (this.state.currentIndex < 0) {this.state.currentIndex = vocabCards.length-1}
      
      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {
        
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} 
            style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}
          >
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}/>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}/>
          <View style = {styles.container}>
      <View style = {styles.dictionaryContainer}>
        <Text style = {styles.dictionaryText}> French Scrabble</Text>
      </View>

      {/* Wolof audio */}
      <View style = {styles.wolofContainer}>
        <Button title="WOLOF" color="#000000" style = {styles.wolofText} onPress={this.playSound.bind(this)}></Button>
        <Ionicons name="ios-volume-high" size={24} color="black" style = {styles.volumePositioning} />
      </View>

      {/* image */}
      <View style = {styles.imgContainer}>
        <Image source={{uri: FILES_API_ROOT.concat(vocabCards[this.state.currentIndex].image)}} style ={styles.imageFormat} /> 
      </View>
    </View>
     

    {/* Submit */} 
    <SubmitButton originalLetters={vocabCards[this.state.currentIndex].letters} userAnswer={this.userAnswer} onWrongAnswer={this.handleWrongAnswer}/>
    <View style={styles.dropZoneContainer}>
    {vocabCards[this.state.currentIndex].letters.map((letter)=>{
           return <DropTiles letter={letter}
           measurements = {measurements}
           />;
            
        })}
     </View>   
    <View style={styles.lettersContainer}>
    {vocabCards[this.state.currentIndex].shuffledLetters.map(letter => 
      <LetterComponent letter={letter} dropZoneMeasurements={measurements} userAnswer = {this.userAnswer}
      />
    )}
    </View>  
  </Animated.View>
        )
      }
      else {
        return (
          <Animated.View
            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
            </Animated.View>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri} />

          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    const { vocabCards } = this.state;
    console.log("Loading Cards");
    //await loadVocabCards();
    console.log(vocabCards);
    console.log("Loaded Cards");
    
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.renderVocabCards(vocabCards)}
        </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  //general container 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    // dictionary
    dictionaryText: {
     fontWeight: 'bold',
      fontSize: 21,
    },

    dictionaryContainer: {
      alignItems: 'center',
      width: '100%',
      height: 100,
      borderColor: 'black',
     paddingBottom: "4%",
      backgroundColor: "#d3d3d3",
      justifyContent: 'flex-end',
    },

    instructionsContainer: {
      top: '4%',
      width: '100%',
    },

    instructionsFormat: {
      textAlign: 'center',
      fontFamily: "Georgia",
      fontSize: 15,
      fontStyle: 'italic',
    },

    // WOLOF button
    wolofContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     textAlign: 'center',
     paddingTop: '11%', 
   },

    wolofText: {
    fontWeight: 'bold',
    fontSize: 30,
   },

   // volume icon 
   volumePositioning: {
    position: 'relative',
    top: "-50%",
    bottom: 0,
    left: "12%",
    right: 0,
   },

   // term description 
  descFormat: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 210,
    width: '100%',
    color: '#444444',
  },

  descContainer: {
    width: "100%",
    top: 240,
    position: 'relative',
    position: 'absolute',
  },
  
  //image 
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "90%",
    height: "45%",
    top: 230,
    position: 'absolute'
  },
  
  imageFormat: {
    height: '100%',
    width: '100%',
  },

  lettersContainer: {
    top: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },

  insP2cont: {
    top: 440,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#989898',
    width: '100%',
    paddingTop: 25,
    textAlign: 'center',
    left: 7,
  }, 

  insP2text: {
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'Georgia',
    fontStyle: 'italic',
  },

  lineCont: {
    borderTopWidth: 1,
    borderColor: '#989898',
    top: 12,
    position: 'relative',
  },
  dropZoneContainer: {
      top: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 50,
    },
});