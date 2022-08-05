import React, {useState} from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Dropdown} from 'react-native-element-dropdown';
import DictionaryCards from './sub-games/dictionaryCard/DictionaryCards';
import EnglishTilesGame from './sub-games/RevisedEnglishTilesGame/EnglishTilesGame';
import FrenchTilesGame from './sub-games/FrenchTilesGame/FrenchTilesGame';
import TextInputGame from './sub-games/TextInputGame/TextInputGame';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const categories =[ {label:'Animal', value:'animal'},{label:'Food', value:'food'},{label:'Fruit', value:'fruits'}]
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  
  
  
  return (
    <>
    <View style = {styles.textCont}>
    <Text style = {styles.h2textFormat}>welcome to</Text>
      <Text style = {styles.h1textFormat}>Kinyarwanda World!</Text>
    </View>
    <View style = {styles.imgCont}>
      <Image style = {styles.imageFormat} source={require('./assets/logo3.png')} />
    </View>
      <Dropdown 
        style={[styles.dropdown]}
        maxHeight={300}
        labelField="label"
        valueField="value" 
        data={categories} 
        value={selectedCategory}
        onChange={item=>setSelectedCategory(item.value)}
      />
      
    {selectedCategory != null && <>
      <View styles={styles.button}>
        <Button
          title="Go to Dictionary cards"
          onPress={() =>
            navigation.navigate('DictionaryCards',{category: selectedCategory})
          }
          color='gray'
        />
        <Button
          title="Go to English Tiles Game"
          onPress={() =>
            navigation.navigate('EnglishTilesGame',)
          }
          color='gray'
        />
        <Button
          title="Go to French Tiles Game"
          onPress={() =>
            navigation.navigate('FrenchTilesGame',)
          }
          color='gray'
        />
        <Button
          title="Go to Text Input Game"
          onPress={() =>
            navigation.navigate('TextInputGame',)
          }
          color='gray'
        />
      </View>
    </>
    }
    </>
  );
};

const DictionaryCardsGameApp = (props) => {
  const {category} = props.route.params;
  return <DictionaryCards category={category}/>;
};

const EnglishTilesGameApp = () => {
  return <EnglishTilesGame/>;
};

const FrenchTilesGameApp = () => {
  return <FrenchTilesGame/>;
};

const TextInputGameApp = () => {
  return <TextInputGame/>;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Games' }}
        />
        <Stack.Screen name="DictionaryCards" component={DictionaryCardsGameApp} />
        <Stack.Screen name="EnglishTilesGame" component={EnglishTilesGameApp} />
        <Stack.Screen name="FrenchTilesGame" component={FrenchTilesGameApp} />
        <Stack.Screen name="TextInputGame" component={TextInputGameApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingTop: '30',
    paddingBottom: '30'
  },
  dropdown: {
    width: '60%',
    height: '7%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: '-9%', 
    marginLeft: '19%',
    paddingHorizontal: 8,
    top: '-7%',
  },

  dropdownStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },

  imgCont: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    top: '-5%',
  },

  textCont: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '5%',
  },

  h1textFormat: {
    fontSize: 30,
    fontFamily: 'Georgia',
  },

  h2textFormat: {
    fontSize: 15,
    fontFamily: 'Georgia',
  },

  imageFormat: {
    width: "90%",
    height: "70%",
  },
});
