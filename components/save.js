import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { StyleSheet, Text, View,Dimensions,SafeAreaView,Animated,Pressable } from 'react-native';
import Basket from './components/Basket';
import Fruit from './components/Fruit';
import { GetRandomFruit } from './components/Other';


const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const BASKET_HEIGHT = 100
const BASKET_WIDTH = 100;
const FRUIT_HEIGHT = 30
const FRUIT_WIDTH = 30;
const BASKET_MARGIN = BASKET_HEIGHT/5;
const VALUES = {'apple':50,'banana':10,'rain':0,'clock':0,'orange':25,'pepper':15,'weed':0}
const WEIGHTS = {'apple':1,'banana':1,'rain':.1,'clock':.05,'orange':1,'pepper':1,'weed':1}
const FRUITS = ['apple','banana','rain','clock','orange','pepper','weed']
MAX_ITEMS = 12;
const FRUIT_MAX_X = WINDOW_WIDTH-FRUIT_WIDTH;
const MAX_TIME = 10000
const MIN_TIME = 3000
const TARGET_LINE = WINDOW_HEIGHT-BASKET_HEIGHT+BASKET_MARGIN;
export default function App() {


  let dummyItems = {pos:{x:0,y:0},id:0,speed:0,type:'apple',status:false,checked:false,isdum:true}
  let dummyCollected = {}
  for (let i=0;i<FRUITS.length;i++){
    dummyCollected[FRUITS[i]]=0
  }
  let [renderedItems,setRenderedItems] = React.useState(Array(MAX_ITEMS).fill(dummyItems))
  let fruitPos = Array(MAX_ITEMS).fill(0)
  let [score,setScore] = React.useState(0);
  let [highScore,setHighScore] = React.useState(0);
  let [basketPos,setBasketPos] = React.useState({x:WINDOW_WIDTH/2-BASKET_WIDTH/2,y:WINDOW_HEIGHT-BASKET_HEIGHT})
 
  let [didmount,setDidmount] = React.useState(false)
  let [collected,setCollected] = React.useState(dummyCollected)
  let [timer,setTimer] = React.useState(0)
  for(let i=0;i<MAX_ITEMS;i++){
    fruitPos[i] = React.useRef(new Animated.Value(0)).current
  }


  let basket = Basket(basketPos,setBasketPos);


  function Begin(){
    MakeFruit()
  //  const interval = setInterval(()=>{MakeFruit()},1000)
  //  return()=>clearInterval(interval)
  }
 function GetNextItem(){
  let next = -1
  for(let i=0;i<MAX_ITEMS;i++){
    if(!renderedItems[i].status){//if this index is not active
      next = i
    }
  }
  return next
 }
 function MakeFruit(){
    let newid = GetNextItem()
    console.log('generating'+newid+'is'+(newid>=0?renderedItems[newid].status:'na'))
    let newfruit = GetRandomFruit(FRUITS,WEIGHTS,collected)
    let newx = FRUIT_MAX_X*Math.random()
    let newTime = MIN_TIME+Math.random()*(MAX_TIME-MIN_TIME)
    if (newid >=0){
     let newitem = {
       pos:{
         x:newx,
         y:0,
       },
       type:newfruit,
       speed:50,
       id:newid,
       status:true,
       checked:false,
       isdum:false
     }
     let newitems = renderedItems.map(x=>x)
     newitems[newid] = newitem
     console.log(newitems[newid].status)
     setRenderedItems(newitems)
     
     Animated.timing(fruitPos[newid],{
       toValue:WINDOW_HEIGHT,//WINDOW_HEIGHT-BASKET_HEIGHT+BASKET_MARGIN,
       duration:newTime,
       useNativeDriver:false
     }).start(()=>{console.log('happening')
      EndFruit(newid)
      })


    }
 }
 function HandlePress(){
  MakeFruit()
 }

 function CheckInBasket(id){
  let newitems = renderedItems.map(x=>x)
  newitems[id].checked = true;
  let basketlow =basketPos.x
  let baskethigh = basketlow+BASKET_WIDTH-FRUIT_WIDTH
  let fruitx =renderedItems[id].pos.x
  let isinbasket = fruitx>=basketlow&&fruitx<=baskethigh
  isinbasket?DoInBasket(id):MissFruit(id);
  //EndFruit(id)

 }
 function MissFruit(id){
  // Animated.timing(fruitPos[id],{
  //   toValue:WINDOW_HEIGHT,
  //   duration:1000,
  //   useNativeDriver:false
  // }).start(()=>{EndFruit(id)})
 }
 function EndFruit(id){
  let newitems = renderedItems.map(x=>x)
  newitems[id].status = false
  fruitPos[id].setValue(0)
  setRenderedItems(newitems);
 }

 function DoInBasket(id){
  let newitems = renderedItems.map(x=>x)
  newitems[id].status=false
  let fruitType = renderedItems[id].type
  let value = VALUES[fruitType]
  setScore(score+value)

  EndFruit(id)
 }
  let rendered = []
  for(let i=0;i<MAX_ITEMS;i++){
    rendered[i] = <Animated.View key={'rend'+i}
     style={{position:'absolute',left:renderedItems[i].pos.x,top:fruitPos[i],height:FRUIT_HEIGHT,
     width:FRUIT_WIDTH,opacity:renderedItems[i].status?1:1}}>{Fruit(renderedItems[i])}</Animated.View>
  }
  React.useEffect(()=>{
    Begin()
   let interval = setInterval(()=>{setTimer((old)=>old+1)},1000)
    return () => clearInterval(interval);
  },[])

 

  React.useEffect(()=>{
    for (let i=0;i<fruitPos.length;i++){
      if(fruitPos[i].__getValue()>=TARGET_LINE&&!renderedItems[i].checked){
        CheckInBasket(i)
      }
    }
  },[fruitPos])
  React.useEffect(()=>{
    didmount?MakeFruit():setDidmount(true)
  },[timer])
  let message = []
  let message2 = []
  let message3 = []
  for(let i=0;i<renderedItems.length;i++){
    message[i] = (renderedItems[i].status)?'true':'false'
    message2[i] = (renderedItems[i].isdum)?'true':'false'
    message3[i] = renderedItems[i].pos.x.toFixed(0)+', '
    
  }
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={()=>MakeFruit()}style={{marginTop:50,marginLeft:20}}><Text style={{fontSize:20}}>Score: {score}</Text></Pressable>
      <Text>{message}+hello?</Text>
      <Text>{message2}</Text>
      <Text>{message3}</Text>
      <Text>{timer}</Text>
      <Text>{renderedItems[11].status?'true':'false'}</Text>
      <View style={{position:'absolute',top:0,left:0,zIndex:99}}>{basket}</View>
      <View style={{position:'absolute',top:0,left:0}}>{rendered}</View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:20,
  },
});
