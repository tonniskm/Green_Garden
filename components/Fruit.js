import * as React from 'react';
import { Text, View, StyleSheet, Image,PanResponder,Dimensions } from 'react-native';


const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const FRUIT_HEIGHT = 30
const FRUIT_WIDTH = 30;
export function GetIcon(type){
  let icon=
  type=="apple"?require('../assets/apple.png'):
  type=="avocado"?require('../assets/avocado.png'):
  type=="banana"?require('../assets/banana.png'):
  type=="bell_pepper"?require('../assets/bell_pepper.png'):
  type=="clock"?require('../assets/clock.png'):
  type=="corn"?require('../assets/corn.png'):
  type=="durian"?require('../assets/durian.png'):
  type=="onion"?require('../assets/onion.png'):
  type=="orange"?require('../assets/orange.png'):
  type=="peach"?require('../assets/peach.png'):
  type=="pepper"?require('../assets/pepper.png'):
  type=="pineapple"?require('../assets/pineapple.png'):
  type=="prickly_pear"?require('../assets/prickly_pear.png'):
  type=="rain"?require('../assets/rain.png'):
  type=="strawberry"?require('../assets/strawberry.png'):
  type=="weed"?require('../assets/weed.png'):
  type=="sun"?require('../assets/sun.png'):
  {}
  return icon
}
export default function Fruit(item) {

  let [pos,setPos] =React.useState({x:0,y:0})
  let icon =GetIcon(item.type)
    


  return(
    <View style={styles.container}>

      <Image style={[styles.fruit,{left:pos.x,top:pos.y,}]} source={icon}/>
 
    </View>

  )
}



const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    width:'100%',

  },
  fruit:{
    width:FRUIT_WIDTH,
    height:FRUIT_HEIGHT,
    position:'absolute'
  }
});