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

  let dummyItems = []
  for (let i=0;i<MAX_ITEMS;i++){
    dummyItems[i] = {pos:{x:0,y:0},id:i,speed:0,type:'banana',status:false,checked:false,isdum:true}
  }
//let dummyItems = {pos:{x:50}}
  let dummyCollected = {}
  for (let i=0;i<FRUITS.length;i++){
    dummyCollected[FRUITS[i]]=0
  }
//  let [renderedItems,setRenderedItems] = React.useState(dummyItems)
  let fruitPos = Array(MAX_ITEMS).fill(0)
  let fruitX = [];function setFruitX(){}
  let fruitSpeed = [];function setFruitSpeed(){}
  let fruitType = [];function setFruitType(){}
  let fruitStatus = [];function setFruitStatus(){}
  let fruitChecked = []
  function setFruitChecked(){}
  let [score,setScore] = React.useState(0);
  let [highScore,setHighScore] = React.useState(0);
  let [basketPos,setBasketPos] = React.useState({x:WINDOW_WIDTH/2-BASKET_WIDTH/2,y:WINDOW_HEIGHT-BASKET_HEIGHT})
 
  let [didmount,setDidmount] = React.useState(false)
  let [collected,setCollected] = React.useState(dummyCollected)
  let [missed,setMissed] = React.useState(dummyCollected)
  let [active,setActive] = React.useState(dummyCollected)
  let [timer,setTimer] = React.useState(0)
  let [last,setLast] = React.useState(0)
  for(let i=0;i<MAX_ITEMS;i++){
    fruitPos[i] = React.useRef(new Animated.Value(0)).current
    // [fruitX[i],setFruitX[i]] = React.useState(0);
    // [fruitSpeed[i],setFruitSpeed[i]] = React.useState(0);
    // [fruitType[i],setFruitType[i]] = React.useState('apple')
    // [fruitStatus[i],setFruitStatus[i]] = React.useState(false)
    // [fruitChecked[i],setFruitChecked[i]] = React.useState(false)
    fruitX[i] = React.useRef(0);
    fruitSpeed[i] = React.useRef(0);
    fruitType[i] = React.useRef('weed');
    fruitStatus[i] = React.useRef(false);
    fruitChecked[i] = React.useRef(false);
  }


  let basket = Basket(basketPos,setBasketPos);


  function Begin(){
    let newid = GetNextItem()
    MakeFruit(newid)
    setLast(0)
    StartTimer()
    function StartTimer(){
      let start = Date.now();
      function UpdateTimer(){
        let interval = Date.now()-start
        setTimer(interval/1000)
        request1 = requestAnimationFrame(UpdateTimer)

      }
      requestAnimationFrame(UpdateTimer)
    }
  }
  //  const interval = setInterval(()=>{MakeFruit()},1000)
  //  return()=>clearInterval(interval)
  
 function GetNextItem(){
  let next = -1
  for(let i=0;i<MAX_ITEMS;i++){
    if(!fruitStatus[i].current){//if this index is not active
      next = i
    }
  }
  return next
 }
 function MakeFruit(newid){

    let newfruit = GetRandomFruit(FRUITS,WEIGHTS,active)
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
     fruitX[newid].current = newx
     fruitType[newid].current = newfruit
     fruitStatus[newid].current = true
     fruitChecked[newid].current = false
    //  let newitems = renderedItems.map(x=>x)
    //  newitems[newid] = newitem
    //  setRenderedItems(newitems)
     
     Animated.timing(fruitPos[newid],{
       toValue:WINDOW_HEIGHT,//WINDOW_HEIGHT-BASKET_HEIGHT+BASKET_MARGIN,
       duration:newTime,
       useNativeDriver:false
     }).start(()=>{
      EndFruit(newid)
      })


    }
 }
 function HandlePress(){
  let newid = GetNextItem()
  MakeFruit(newid)
 }

 function CheckInBasket(id){
  //let newitems = renderedItems.map(x=>x)
 // newitems[id].checked = true;
 fruitChecked[id].current = true
  let basketlow =basketPos.x
  let baskethigh = basketlow+BASKET_WIDTH-FRUIT_WIDTH
  let fruitx =fruitX[id].current//renderedItems[id].pos.x
  let isinbasket = fruitx>=basketlow&&fruitx<=baskethigh
  isinbasket?DoInBasket(id):MissFruit(id);
  //EndFruit(id)

 }
 function MissFruit(id){
  // let newmissed = {...missed}
  // let thisFruit = fruitType[id].current
  // newmissed[thisFruit] = newmissed[thisFruit] + 1
  // setMissed(newmissed)
  // if(thisFruit=="weed"){
  //   let newactive = {...active}
  //   newactive[thisFruit] = newactive[thisFruit] + 1
  //   setActive(newactive)
  // }
 }
 function CancelFruit(id){
  fruitPos[id].stopAnimation(()=>{EndFruit(id)})
 }
 function EndFruit(id){
  // let newitems = renderedItems.map(x=>x)
  // newitems[id].status = false
  fruitStatus[id].current = false
  fruitPos[id].setValue(-2*FRUIT_HEIGHT)
  // setRenderedItems(newitems);
  //fruitPos[id].stopAnimation(()=>{
    // let newitems = renderedItems.map(x=>x)
    // newitems[id].status = false
    // fruitPos[id].setValue(0)
    // setRenderedItems(newitems);
  //})
 
 }

 function DoInBasket(id){
  let value = VALUES[fruitType[id].current]
  let thisFruit = fruitType[id].current
  setScore(score+value)
   let newcollected = {...collected}
   newcollected[fruitType[id].current] = newcollected[fruitType[id].current] + 1
   setCollected(newcollected)
  CancelFruit(id)
  if(thisFruit =='weed'&&active.weed>0){
    let newactive = {...active}
    newactive.weed = newactive.weed - 1
    setActive(newactive)
  }
  if(thisFruit=='rain'&&thisFruit=='sun'){
    let newactive = {...active}
    newactive[thisFruit]= newactive[thisFruit] + 1
    setActive(newactive)
  }
 }
  let rendered = []
  for(let i=0;i<MAX_ITEMS;i++){
    rendered[i] = <Animated.View key={'rend'+i}
     style={{position:'absolute',left:fruitX[i].current,top:fruitPos[i],height:FRUIT_HEIGHT,
     width:FRUIT_WIDTH,opacity:fruitStatus[i].current?1:0}}>{Fruit({status:fruitStatus[i].current,id:i,type:fruitType[i].current})}</Animated.View>
  }
  React.useEffect(()=>{
    Begin()
  //  let interval = setInterval(()=>{setTimer((old)=>old+1)},1000)
  //   return () => clearInterval(interval);
  return()=>{cancelAnimationFrame(request1)}
  },[])

 

  React.useEffect(()=>{
    for (let i=0;i<fruitPos.length;i++){
      if(fruitPos[i].__getValue()>=TARGET_LINE&&!fruitChecked[i].current){
        CheckInBasket(i)
      }
    }
  },[fruitPos])
  React.useEffect(()=>{
    if(timer>0){
      if(timer-last>=1){
        setLast(timer)
        let newid = GetNextItem()
        MakeFruit(newid)
      }
    }
  },[timer])
  let message = []
  let message2 = []
  let message3 = []
  // for(let i=0;i<renderedItems.length;i++){
  //   message[i] = (renderedItems[i].status)?'true':'false'
  //   message2[i] = (renderedItems[i].type)
  //   message3[i] = renderedItems[i].pos.x.toFixed(0)+', '
    
  // }
  //console.log(collected)
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={()=>{let newid = GetNextItem();MakeFruit(newid)}}style={{marginTop:50,marginLeft:20}}><Text style={{fontSize:20}}>Score: {score}</Text></Pressable>
      <Text>{JSON.stringify(collected)}</Text>
      <Text>{timer}</Text>
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
