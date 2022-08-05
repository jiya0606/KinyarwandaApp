import React from "react"
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import { Audio } from 'expo-av';

const FILES_API_ROOT = 'http://54.69.90.57/api/words/files/';
export default class DictionaryButtons extends React.Component {
    constructor(props) {
      super(props)
      this.sound = new Audio.Sound();
    }

    // audio
   // audio device adjustment
   // fetching data from server
   async componentDidMount() {
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
    playWolofSound() {
      // audio file
      const audioFile = this.props.wolofAudio;
      this.sound.unloadAsync();
      this.sound.loadAsync({uri: FILES_API_ROOT.concat(audioFile)}, this.status, false).then(()=>{
        this.sound.replayAsync();
      });
    }

    playEnglishSound() {
      // audio file
      const audioFile = this.props.englishAudio;
      this.sound.unloadAsync();
      this.sound.loadAsync({uri: FILES_API_ROOT.concat(audioFile)}, this.status, false).then(()=>{
        this.sound.replayAsync();
      });
    }

    playFrenchSound() {
      // audio file
      const audioFile = this.props.frenchAudio;
      this.sound.unloadAsync();
      this.sound.loadAsync({uri: FILES_API_ROOT.concat(audioFile)}, this.status, false).then(()=>{
        this.sound.replayAsync();
      });
    }

    render() {
      return (
        <View style = {styles.buttonContainer}>
        <TouchableOpacity
         style={styles.roundButton1}
          onPress={this.playWolofSound.bind(this)}
          >
          <Text style = {styles.buttonText}>Kinyarwanda</Text>
        </TouchableOpacity>

        {/* english button */}
        <TouchableOpacity
         style={styles.roundButton2}
          onPress={this.playEnglishSound.bind(this)}
          >
          <Text style = {styles.buttonText}>{this.props.englishText}</Text>
        </TouchableOpacity>

        {/* french button */}
          <TouchableOpacity 
            style={styles.roundButton2}
            onPress={this.playFrenchSound.bind(this)}
            >
            <Text style = {styles.buttonText}>{this.props.frenchText}</Text>
          </TouchableOpacity>
      </View>
      )
    }
}
const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "10%",
    height: "20%",
    width: "100%",
  },

  roundButton1: {
     justifyContent: 'center',
      alignItems: 'center',
      width: "90%",
      height: "30%",
      padding: 10,
      marginTop: '70%',
      marginBottom: 10,
      borderRadius: 24,
      fontSize: 100,
      backgroundColor: '#FFE5B4',
  },

  roundButton2: {
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
  buttonText: {
    fontSize: 17,
    fontFamily: 'Georgia',
  },
})