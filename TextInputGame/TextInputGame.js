import React from 'react';
import {Image,TextInput, Button,Dimensions, StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import {useState, useMemo, useRef} from 'react';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { useEffect } from 'react';



const FILES_API_ROOT = 'http://54.69.90.57/api/words/files/';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

//engligh text 
export default function TextInputGame() {
  const [vocabCards, setVocabCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [englText, setenglText] = useState("");
  const [corrData, setCorrData] = useState(false);
  const [incorrData, setIncorrData] = useState(false);
  const [frenText, setfrenText] = useState("");
  const [correctData, setCorrectData] = useState(false);
  const [incorrectData, setIncorrectData] = useState(false);
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  

  useEffect(()=>{
    const fetchVocabCards = async ()=> {
      try {
        const response = await fetch('http://54.69.90.57/api/words');
        const json = await response.json();
        console.log("JSON: ", json);
        setVocabCards(json.words);
        setIsLoading(false);
      }catch(error){
        console.log("error: ", error);
      }
    };
    if(isLoading){
      fetchVocabCards();
    }
  },[isLoading]);

 const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {

      position.setValue({ x: gestureState.dx, y: gestureState.dy })
    },
    onPanResponderRelease: (evt, gestureState) => {

      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
        }).start(() => {
          if(index === vocabCards.length-1){
            setIndex(0);
          }else{
            setIndex(index+1);
          }
          position.setValue({ x: 0, y: 0 });
        })
      }
      else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
        }).start(() => {
          if(index === 0){
            setIndex(vocabCards.length-1);
          }else{
            setIndex(index-1);
          }
          position.setValue({ x: 0, y: 0 });
        })
      }
      else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start()
      }
    }
  });

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
    outputRange: ['-30deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  })

  const rotateAndTranslate = {
    transform: [{
      rotate: rotate
    },
    ...position.getTranslateTransform()
    ]
  }

  const compareEngText = () => {
    if(englText.toLowerCase() === vocabCards[index].englishText.toLowerCase()) {
      setCorrData(true);
      setIncorrData(false);
    }else{
      setCorrData(false);
      setIncorrData(true);
    }
    
  }

//french text
//export default function App() {
  const compareFrenText = () => {
    if(frenText.toLowerCase() === vocabCards[index].frenchText.toLowerCase()) {
      setCorrectData(true);
      setIncorrectData(false);
    }else{
      setCorrectData(false);
      setIncorrectData(true);
    }
  }

  const wcompareFrenText = () => {
    if (setCorrectData === false) {
      <View style = {styles.frenchContainer}>
        <Text>HIIIIIIIIII</Text>
      </View>
    }
  }

 if(isLoading){
   return(
    <View style={styles.container}>
    <View style = {styles.topContainer}>
      <Text style = {styles.topText}>Loading</Text>
    </View>
    </View>
   );
 } 

 console.log("Before Render: ", FILES_API_ROOT.concat(vocabCards[index].image));
  return (
    <Animated.View
            {...panResponder.panHandlers}
            key={index} style={[rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
    <View style={styles.container}>
      <View style = {styles.topContainer}>
        <Text style = {styles.topText}>Spelling Game</Text>
      </View>

      <View style = {styles.imgContainer}>
        <Image source={{uri: FILES_API_ROOT.concat(vocabCards[index].image)}} style ={styles.imageFormat} onPress={()=>{console.log(index)}}/> 
      </View> 

    

    <View style = {styles.englishContainer}>
      <TextInput 
      onChangeText= {(text) => setenglText(text)}
      keyboardType= "ascii-capable"
      placeholder="English Translation" style = {styles.textFormat}/> 
      {corrData ? <AntDesign name="checkcircle" size = {24} color = "#77DD77" style = {styles.englishCheckmark} /> : null}
      {incorrData ? <Entypo name="circle-with-cross" size={24} color="#FF392E" style = {styles.englishCross} /> : null}
     
      <Button title="Go" color="#3f3f3f" onPress={()=> 
        {console.log(englText);
          compareEngText();
        }}/>
    </View>
    
    <View style = {styles.frenchContainer}>
     <TextInput 
      onChangeText= {(text) => setfrenText(text)}
      keyboardType= "ascii-capable"
      //clearButtonMode = "always"
      placeholder="French Translation" style = {styles.textFormat}/> 
      {correctData ? <AntDesign name="checkcircle" size = {24} color = "#77DD77" style = {styles.FrenchCheckmark} /> : null}
      {incorrectData ? <Entypo name="circle-with-cross" size={24} color="#FF392E" style = {styles.frenchCross} /> : null}
      <Button title="Go" color="#3f3f3f" style = {styles.frenchButton} onPress={()=> 
      { console.log(frenText);
        compareFrenText();
      }}/>
    </View>
  </View> 
  </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // top 
  topText: {
    fontWeight: 'bold',
     fontSize: 21,
   },

   topContainer: {
     alignItems: 'center',
     width: "100%",
     height: "20%",
     top: "-10%",
     borderColor: 'black',
    // borderWidth: 0, 
    paddingBottom: "4%",
     backgroundColor: "#d3d3d3",
     justifyContent: 'flex-end',
   },

   //instructions
   instContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: '-10%', 
    width: "95%", 
  },

   instText: {
    fontStyle: 'italic',
     fontSize: 19,
     textAlign: "center",
  },
  
   //image 
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: "-10%",
    width: "90%",
    height: "40%",
  },
  
  englishContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: "-0.5%",
    width: "90%",
    //height: "10%",
  },

  frenchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: "-0.5%",
    width: "90%",
    //height: "10%",
  },

  imageFormat: {
    width: "95%",
    height: "80%",
  },
  textFormat: {
    borderColor: "#ccc",
    borderWidth: 2,
    paddingHorizontal: 10, 
    paddingBottom: 10,
  },

  sampleText: {
    fontSize: 100, 
  },

  englishCheckmark: {
    bottom: '60%',
    left: '95%',
    position: 'absolute',
  },

  FrenchCheckmark: {
    bottom: '60%',
    left: '95%',
    position: 'absolute',
  },

  englishCross: {
    bottom: '60%',
    left: '95%',
    position: 'absolute',
  },

  frenchCross: {
    bottom: '60%',
    left: '95%',
    position: 'absolute',
  },

  moveButtons: {
    left: '35%',
    top: '2%',
  },

  nextButton: {
    bottom: '-70%',
  },

  backButton: {
    right: 300,
    bottom: '30%',
  }
});
