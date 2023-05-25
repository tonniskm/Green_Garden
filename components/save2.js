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
//  let fruitPos = Array(MAX_ITEMS).fill(0)
let fruitPos = [];function setFruitPos(){}
  let [score,setScore] = React.useState(0);
  let [highScore,setHighScore] = React.useState(0);
  let [basketPos,setBasketPos] = React.useState({x:WINDOW_WIDTH/2-BASKET_WIDTH/2,y:WINDOW_HEIGHT-BASKET_HEIGHT})
 
  let [didmount,setDidmount] = React.useState(false)
  let [collected,setCollected] = React.useState(dummyCollected)
  let [timer,setTimer] = React.useState(0)
  let [test,setTest] = React.useState(0)
  let [last,setLast] = React.useState(0)
  for(let i=0;i<MAX_ITEMS;i++){
   // fruitPos[i] = React.useRef(new Animated.Value(0)).current
   //fruitPos[i] = React.useRef(0).current
   [fruitPos[i],setFruitPos[i]] = React.useState(0)
  }


  let basket = Basket(basketPos,setBasketPos);
  let fallID = Array(MAX_ITEMS)
 
  function Begin(){
    MakeFruit()
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
  React.useEffect(()=>{
    if(timer>0){
      if(timer-last>=1){
        setLast(timer)
        MakeFruit()
      }
    }
  },[timer])
  
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
    let newfruit = GetRandomFruit(FRUITS,WEIGHTS,collected)
    let newx = FRUIT_MAX_X*Math.random()
    let newTime = (MIN_TIME+Math.random()*(MAX_TIME-MIN_TIME))/1000
    let newSpeed = WINDOW_HEIGHT/newTime //px per s
    if (newid >=0){
     let newitem = {
       pos:{
         x:newx,
         y:0,
       },
       type:newfruit,
       speed:newSpeed,
       id:newid,
       status:true,
       checked:false,
       isdum:false
     }
     let newitems = renderedItems.map(x=>x)
     newitems[newid] = newitem

     setRenderedItems(newitems)
    //  Animated.timing(fruitPos[newid],{
    //    toValue:WINDOW_HEIGHT,//WINDOW_HEIGHT-BASKET_HEIGHT+BASKET_MARGIN,
    //    duration:newTime,
    //    useNativeDriver:false
    //  }).start(()=>{console.log('happening')
    //   EndFruit(newid)
    //   })
    StartFall()
     function StartFall(){
      let startF = Date.now()
      function AnimateFall(){
        const intervalF = (Date.now()-startF)/1000
        let newpos = intervalF*newSpeed
       // console.log(newpos)
        //fruitPos[newid].current = TARGET_LINE/2
        setFruitPos[newid](newpos)
        if(newpos<=WINDOW_HEIGHT){
          fallID[newid] = requestAnimationFrame(AnimateFall)
        }else{
          cancelAnimationFrame(fallID[newid])
          setFruitPos[newid](0)
        //  StartFall()
        }
      }
      requestAnimationFrame(AnimateFall)
     }


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
  setFruitPos[id](0);
 // fruitPos[id].setValue(0)
  setRenderedItems(newitems);
  cancelAnimationFrame(fallID[id])
 }

 function DoInBasket(id){
  // let newitems = renderedItems.map(x=>x)
  // newitems[id].status=false
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
    //requestAnimationFrame(playAnimation)
    return ()=>{cancelAnimationFrame(request1)}
  },[])


  function UpdateLocations(delta){
    console.log('here')
  }
  let lastTime
  let totalTime
  let timeSince
  function playAnimation(time) {
    if (lastTime != null) {
      const delta = time - lastTime
    //  UpdateLocations(delta)
      if (totalTime!=null){
        totalTime=totalTime+delta/1000
      }else{totalTime=0}
      if (timeSince!=null){
        timeSince = timeSince+delta/1000
      }else{timeSince=0}
    }
    if(timeSince >=1){MakeFruit();timeSince=0}

    lastTime = time
    //console.log(renderedItems[11].status)
    requestAnimationFrame(playAnimation)
    //setTimer(totalTime)
  }

  React.useEffect(()=>{
    // for (let i=0;i<fruitPos.length;i++){
    //     if(fruitPos[i]>=TARGET_LINE.length&&!renderedItems.checked){
    //       CheckInBasket(i)
    //     }
    // }
  },[fruitPos])


  let message = []
  let message2 = []
  let message3 = []
  for(let i=0;i<renderedItems.length;i++){
    message[i] = (renderedItems[i].status)?'true':'false'
    message2[i] = fruitPos[i]
    message3[i] = renderedItems[i].pos.x.toFixed(0)+', '
    
  }
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={()=>MakeFruit()}style={{marginTop:50,marginLeft:20}}><Text style={{fontSize:20}}>Score: {score}</Text></Pressable>
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
