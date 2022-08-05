import { Image, StyleSheet, TouchableOpacity, Text, View, Dimensions, Animated, PanResponder, ActivityIndicator} from 'react-native';
import React from "react";
import DictionaryButtons from './DictionaryButtons'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const FILES_API_ROOT = 'http://54.69.90.57/api/words/files/';

export default class DictionaryCards extends React.Component {
  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      vocabCards: [],
      isLoading: true,
      showImage: true,
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

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
    
  }

  async getVocabCards() {
    try {
      //calling api  
      const response = await fetch('http://54.69.90.57/api/words?category='.concat(this.props.category));
      // converting response to json format
      const json = await response.json();
      //getting list of words from response 
      this.setState({ vocabCards: json.words });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }
    async componentDidMount() {
      this.getVocabCards();
    
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
        this.setState({...this.state, showImage: true});
      }
    })
  }

  renderVocabCards = (vocabCards) => {
    return vocabCards.map((item, i) => {
      console.log(i);
      if (this.state.currentIndex >= vocabCards.length) {this.state.currentIndex=0}
      if (this.state.currentIndex < 0) {this.state.currentIndex=vocabCards.length-1}
      
      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
            </Animated.View>

            <View style = {styles.container}>
      <View style = {styles.dictionaryContainer}>
        <Text style = {styles.dictionaryText}>Dictionary</Text>
      </View>

      {/* image */}
      {this.state.showImage && <View style = {styles.imgContainer}>
        <Image source={{uri: FILES_API_ROOT.concat(vocabCards[this.state.currentIndex].image)}} style ={styles.imageFormat} /> 
      </View> 
      }
      {
        !this.state.showImage && <DictionaryButtons 
        englishAudio={this.state.vocabCards[this.state.currentIndex].englishAudio}  
        frenchAudio={this.state.vocabCards[this.state.currentIndex].frenchAudio}
        wolofAudio={this.state.vocabCards[this.state.currentIndex].wolofAudio}
        englishText={this.state.vocabCards[this.state.currentIndex].englishText}
        frenchText={this.state.vocabCards[this.state.currentIndex].frenchText}
        />
      }
      {/* Description  */}
      <View style = {styles.descContainer}>
        <Text style = {styles.descFormat}>{vocabCards[this.state.currentIndex].description} </Text>
      </View>
      <View style = {styles.buttonContainer}>
        <TouchableOpacity 
            style={styles.roundButton3}
            onPress={()=>this.setState({...this.state, showImage: !this.state.showImage})}
            >
            <Text style = {styles.buttonText} >Flip</Text>
        </TouchableOpacity>
      </View>
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
    const { vocabCards, isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {isLoading ? <ActivityIndicator/> : (
        <View style={{ flex: 1 }}>
            {this.renderVocabCards(vocabCards)}
        </View>
        )
      }
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
      // paddingTop: "20%",
      width: "100%",
      height: "15%",
      borderColor: 'black',
     // borderWidth: 0, 
     paddingBottom: "4%",
      backgroundColor: "#d3d3d3",
      justifyContent: 'flex-end',
    },
   
   // term description 
  descFormat: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Georgia',
    paddingHorizontal: 20,
  },

  descContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "95%",
  },
  
  //image 
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '50%',
    width: "90%",
    height: "50%",
  },
  
  imageFormat: {
    width: "90%",
    height: "125%",
    top: "-50%",
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: "5%",
    height: "20%",
    width: "100%",
  },
  roundButton: {
    justifyContent: 'center',
     alignItems: 'center',
     width: "90%",
     height: "30%",
     padding: 10,
     marginBottom: 10,
     borderRadius: 24,
     fontSize: 100,
     backgroundColor: '#FFE5B4',
  },
  roundButton3: {
    justifyContent: 'center',
     alignItems: 'center',
     width: "90%",
     height: "30%",
     padding: 10,
     marginBottom: 10,
     marginTop: 170,
     borderRadius: 24,
     fontSize: 100,
     backgroundColor: '#FFFFFF',
 },

 buttonText: {
  fontSize: 20,
  fontFamily: 'Georgia',
},
});