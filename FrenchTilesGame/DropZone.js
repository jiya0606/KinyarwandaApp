import React, { Component } from "react";
import { StyleSheet, View, Text, Animated, UIManager, findNodeHandle } from "react-native";
import LetterComponent from "/Users/jiya/FrenchTilesGame/LetterComponent.js";
import DropTiles from '/Users/jiya/FrenchTilesGame/DropTiles.js';


export default class Screen extends Component {
    constructor(props) {
        super(props);
        this.props.measurements 
    }

  render() {
    return <View style={styles.dropZoneContainer}>
        {this.props.letters.map((letter)=>{
           return <DropTiles letter={letter}
           measurements = {this.props.measurements}
           />;
            
        })}
      </View>;
  } 
}

const SQUARE_RADIUS = 45;
const styles = StyleSheet.create({
    dropZoneContainer: {
        top: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
      },
  ballContainer: {
    height:150
  },
  row: {
    flexDirection: "row"
  },  

  //this is the grey box!!
  dropZone: {
    height: 150,
    backgroundColor: "#a9a9a9",
    //position: 'absolute',
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold"
  },
    square: {
        backgroundColor: "#656565",
        width: SQUARE_RADIUS + 1,
        height: SQUARE_RADIUS + 1,
        borderRadius: 7,
        justifyContent: 'center',
        alignContent: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowColor: '#a9a9a9',
    },
});