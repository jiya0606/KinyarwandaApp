import React from 'react';
import { Button, StyleSheet, View} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

export default class SubmitButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            correctAnswer: false,
            wrongAnswer: false,
        }
    }

    render(){
    return <View style = {styles.iconContainer}>
      <Button title="Submit" color= '#00000' onPress={()=> { 
       // console.log("DropZoneMeasurements: ", measurements);
        const origLetters = this.props.originalLetters;
        const userAnswer = this.props.userAnswer;
        console.log("USer Anser: ", userAnswer );
        console.log("Original : ", origLetters );
        let answerFound = true; 
        origLetters.forEach((original_letter, i) => {
          console.log("Original: ",original_letter, "  User: ", userAnswer[i] );
          if(original_letter!==userAnswer[i]){
            answerFound = false;
          }
        });
        if (answerFound === true) {
           console.log('right asnwer');
           this.setState({
             ...this.state,
             correctAnswer: true,
             wrongAnswer: false,
           });
        }

        if (answerFound === false) {
          console.log('wrong asnwer');
          this.setState({
            ...this.state,
            wrongAnswer: true,
            correctAnswer: false,
          });
          this.props.onWrongAnswer();
        }
      }}/>
      {
        this.state.correctAnswer &&
          <AntDesign name="checkcircleo" size={20} color="#149414" style = {styles.iconFormat} />
        }

        {
          this.state.wrongAnswer &&
          <Feather name="x-circle" size={20} color="#B53737" style = {styles.iconFormat} />
        }
    </View>
    }
}

const styles = StyleSheet.create({
    // buttonPosition: {
    //     position: 'absolute',
    //   },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },  

    iconFormat: {
        top: 8.5,
        left: 240,
        position: 'absolute',
    },
});