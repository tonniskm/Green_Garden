import * as React from 'react';
import { Text, View, StyleSheet, Image,PanResponder,Dimensions } from 'react-native';


const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const BASKET_HEIGHT = 100
const BASKET_WIDTH = 100;
export default function Basket(pos,setPos) {
//let [pos,setPos] = React.useState({x:WINDOW_WIDTH/2-BASKET_WIDTH/2,y:WINDOW_HEIGHT-BASKET_HEIGHT})
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder:()=>true,
    onPanResponderRelease:()=>{},
    onPanResponderMove:(evt, gestureState) => {
    const { dx, dy } = gestureState;
    let newpos = {x:pos.x+dx,y:pos.y+0}
    if( newpos.x <=0-BASKET_WIDTH/2){newpos.x=0-BASKET_WIDTH/2}
    if(newpos.x >=WINDOW_WIDTH-BASKET_WIDTH/2){newpos.x=WINDOW_WIDTH-BASKET_WIDTH/2}
    setPos(newpos)
    }
  })

  return (
    <View style={styles.container}>
      <Image style={[styles.basket,{position:'absolute',left:pos.x,top:pos.y,backgroundColor:'transparent'}]} source={require('../assets/basket.png')} {...panResponder.panHandlers}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    width:'100%',

  },
  basket:{
    width:BASKET_WIDTH,
    height:BASKET_HEIGHT,
  
  }
});
