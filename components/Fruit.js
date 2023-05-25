import * as React from 'react';
import { Text, View, StyleSheet, Image,PanResponder,Dimensions } from 'react-native';


const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const FRUIT_HEIGHT = 30
const FRUIT_WIDTH = 30;

export default function Fruit(item) {

  let [pos,setPos] =React.useState({x:0,y:0})
  let icon =item.type=="apple"?require('../assets/apple.png'):
    item.type=="banana"?require('../assets/banana.png'):
    item.type=="clock"?require('../assets/clock.png'):
    item.type=="orange"?require('../assets/orange.png'):
    item.type=="pepper"?require('../assets/pepper.png'):
    item.type=="rain"?require('../assets/rain.png'):
    item.type=="weed"?require('../assets/weed.png'):
    {}
    


  return(
    <View style={styles.container}>

      <Image style={[styles.fruit,{left:pos.x,top:pos.y,}]} source={icon}/>
      <Text style={{position:"absolute",left:0,top:0}}>{item.id}</Text>
      <Text style={{position:"absolute",left:0,top:20}}>{item.status?"true":"false"}</Text>
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