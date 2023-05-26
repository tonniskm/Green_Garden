import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { StyleSheet, Text, View,Dimensions,SafeAreaView,Animated,Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Basket from './components/Basket';
import Fruit from './components/Fruit';
import { FRUITS, GetActiveCount, GetRandomFruit, GetValue } from './components/Other';
import { playSound } from './components/Sounds';
import Totals from './components/Totals';
import Achievements from './components/Achievements';



const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const BASKET_HEIGHT = 100
const BASKET_WIDTH = 100;
const FRUIT_HEIGHT = 30
const FRUIT_WIDTH = 30;
const BASKET_MARGIN = BASKET_HEIGHT/5;

MAX_ITEMS = 12;
const FRUIT_MAX_X = WINDOW_WIDTH-FRUIT_WIDTH;
const MAX_TIME = 10000
const MIN_TIME = 3000
const TARGET_LINE = WINDOW_HEIGHT-BASKET_HEIGHT+BASKET_MARGIN;
const TIME_LIMIT = 60000
let dummyItems = []
for (let i=0;i<MAX_ITEMS;i++){
  dummyItems[i] = {pos:{x:0,y:0},id:i,speed:0,type:'banana',status:false,checked:false,isdum:true}
}
//let dummyItems = {pos:{x:50}}
let dummyCollected = {}
for (let i=0;i<Object.keys(FRUITS).length;i++){
  let type = Object.keys(FRUITS)[i]
  for(let j=0;j<FRUITS[type].length;j++){
    dummyCollected[FRUITS[type][j]]=0
  }
}
let dummyAchievements = {
No_weeds:{title:"No Weeds in the Garden",description:"Let no weeds go uncaught.",status:false}, //cleanup
High_achieve:{title:"High Achiever",description:"Score over 2000 points in one game.",status:false}, //cleanup
Ash:{title:"Gotta Catch 'em All!",description:"Catch one of everything.",status:false}, //cleanup
Legendary:{title:"Legendary",description:"Catch the three highest scoring fruits in one game.",status:false}, //cleanup
//Grinder:{title:"Grinder",description:"Score 50,000 points through all playthroughs.",status:false},
Picky_Eater:{title:"Picky Eater",description:"Catch only 1 type of food in a game.",status:false}, //cleanup
No:{title:"You Can't Make Me!",description:"Catch nothing in a game.",status:false}, //cleanup 
Going:{title:"I Know Where I'm Going",description:"Catch only suns or only rains.",status:false} //cleanup
}
export default function App() {

//  let [renderedItems,setRenderedItems] = React.useState(dummyItems)
  let fruitPos = Array(MAX_ITEMS).fill(0)
  let fruitX = []
  let fruitSpeed = []
  let fruitType = []
  let fruitStatus = []
  let fruitChecked = []
  let [score,setScore] = React.useState(0);
  let [highScore,setHighScore] = React.useState(0);
  let [basketPos,setBasketPos] = React.useState({x:WINDOW_WIDTH/2-BASKET_WIDTH/2,y:WINDOW_HEIGHT-BASKET_HEIGHT})
  let [didCheck,setDidCheck] = React.useState(false)
  let [collected,setCollected] = React.useState(dummyCollected)
  let [missed,setMissed] = React.useState(dummyCollected)
  let [active,setActive] = React.useState(dummyCollected)
  let [timer,setTimer] = React.useState(0)
  let [last,setLast] = React.useState(0)
  let [gameActive,setGameActive] = React.useState(0)
  let [showScreen,setShowScreen] = React.useState(1)
  let [totalCollected,setTotalCollected] = React.useState(dummyCollected)
  let [achievements,setAchievements] = React.useState(dummyAchievements)
  let [screenView,setScreenView] = React.useState('default')
  let [achievementGet,setAchievementGet] = React.useState(false)
  for(let i=0;i<MAX_ITEMS;i++){
    fruitPos[i] = React.useRef(new Animated.Value(0)).current
    fruitX[i] = React.useRef(0);
    fruitSpeed[i] = React.useRef(0);
    fruitType[i] = React.useRef('weed');
    fruitStatus[i] = React.useRef(false);
    fruitChecked[i] = React.useRef(false);
  }

  let basket = Basket(basketPos,setBasketPos);


  function Begin(){
    setDidCheck(false)
    let newid = GetNextItem()
    setActive(dummyCollected);
    setCollected(dummyCollected);
    setMissed(dummyCollected)
    MakeFruit(newid)
    setAchievementGet(false)
    setLast(0)
    setScore(0)
    StartTimer()
    function StartTimer(){
      let start = Date.now();
      function UpdateTimer(){
        let interval = Date.now()-start
        setTimer(interval/1000)
        request1 = requestAnimationFrame(UpdateTimer)
        if(interval>=TIME_LIMIT){
          cancelAnimationFrame(request1)
          EndGame()
        }
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

    let newfruit = GetRandomFruit(active)
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
  setGameActive(1)
  }
 React.useEffect(()=>{
  if(gameActive==1){
    Begin()
    setShowScreen(0)
  }else{
    if(!gameActive==0){
    //  cancelAnimationFrame(request1)
    }
  }
  return ()=>{}
 },[gameActive])
 
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
  let newmissed = {...missed}
  let thisFruit = fruitType[id].current
  newmissed[thisFruit] = newmissed[thisFruit] + 1
  setMissed(newmissed)
  if(thisFruit=="weed"){
    let newactive = {...active}
    newactive[thisFruit] = newactive[thisFruit] + 1
    setActive(newactive)
  }
 }
 function CancelFruit(id){
  fruitPos[id].stopAnimation(()=>{EndFruit(id)})
 }
 function EndFruit(id){
  fruitStatus[id].current = false
  fruitPos[id].setValue(-2*FRUIT_HEIGHT)
  CheckGameOver();
 }
 function DoInBasket(id){
  let thisFruit = fruitType[id].current
  let value = GetValue(thisFruit)
  setScore(score+value)
  if(score+value>=highScore){
    setHighScore(score+value)
  }
    playSound('ping')
   let newcollected = {...collected}
   newcollected[fruitType[id].current] = newcollected[fruitType[id].current] + 1
   setCollected(newcollected)
  CancelFruit(id)
  if(thisFruit =='weed'&&active.weed>0){
    let newactive = {...active}
    newactive.weed = newactive.weed - 1
    setActive(newactive)
  }
  if(thisFruit=='rain'||thisFruit=='sun'||thisFruit=='clock'){
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
    getData()
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

  React.useEffect(()=>{
    let activeCount = GetActiveCount(fruitStatus)
    if(timer>2&&activeCount==0&&!didCheck){
      Cleanup()
    }
  },[showScreen])

  function CheckGameOver(){
    let activeCount = GetActiveCount(fruitStatus)

    if(activeCount==0&&timer>2){
      setShowScreen(1)
     // Cleanup()
    }else{}
  }
 

  function Cleanup(){
    setDidCheck(true)
    playSound('win')
    let newCollected = {...totalCollected}
    for (let i=0;i<Object.keys(totalCollected).length;i++){
      let thisFruit = Object.keys(totalCollected)[i]
      newCollected[thisFruit] = totalCollected[thisFruit] + collected[thisFruit]
    }
    setTotalCollected(newCollected);
    let newAchievements = {...achievements}
    if(newAchievements.No_weeds.status==false&&missed.weed==0){newAchievements.No_weeds.status=true;setAchievementGet(true)}
    if(newAchievements.High_achieve.status==false&&score>2000){newAchievements.High_achieve.status=true;setAchievementGet(true)}
    let totalMissing = 0
    let typesCaught = 0
    let no_caught = 0
    let suns_caught = collected.sun
    let rains_caught = collected.rain
    for (let i=0;i<Object.keys(newCollected).length;i++){ //overall
      if(newCollected[Object.keys(newCollected)[i]]==0){
        totalMissing = totalMissing + 1
      }
    }
    for (let i=0;i<Object.keys(collected).length;i++){//this game
      let type = Object.keys(collected)[i]

      if(collected[type]>0&&type!="sun"&&type!="rain"&&type!="weed"){typesCaught=typesCaught+1}
      no_caught = collected[type] + no_caught

    }

  
    if(newAchievements.Ash.status==false&&totalMissing==0){newAchievements.Ash.status=true;setAchievementGet(true)}
    if(newAchievements.Legendary.status==false&&collected["durian"]>0&&collected["peach"]>0&&collected["pepper"]>0){newAchievements.Legendary.status=true;setAchievementGet(true)}
    if(newAchievements.Picky_Eater.status==false&&typesCaught==1){newAchievements.Picky_Eater.status=true;setAchievementGet(true)}
    if(newAchievements.No.status==false&&no_caught==0){newAchievements.No.status=true;setAchievementGet(true)}
    if(newAchievements.Going.status==false&&((suns_caught>0&&rains_caught==0)||(suns_caught==0&&rains_caught>0))){newAchievements.Going.status=true;setAchievementGet(true)}
    setAchievements(newAchievements)
    writeData({highScore:highScore,totalCollected:newCollected,achievements:newAchievements})
    setActive(dummyCollected)
  }

  function EndGame(){
    setGameActive(2)
    
    
    //cancelAnimationFrame(request1)
  }

  const getData = async() =>{
    try{
      const saveddata = await AsyncStorage.getItem("highscores");
      const thedata = JSON.parse(saveddata)
      if(!thedata){}else{
        setHighScore(thedata.highScore);
        setTotalCollected(thedata.totalCollected);
        setAchievements(thedata.achievements)
      }
    // setRead(thedata)
    }catch(e){
      console.log(e)
    }
  }

  const writeData = async(data) =>{
    try {
      await AsyncStorage.setItem("highscores", JSON.stringify(data));
    }catch(e){
      console.log(e)
    }
  }





  let beginMessage = `Welcome!\nPush to begin!`
  let achieveMessage = achievementGet?`Achievement Unlocked!\n`:""
  let highMessage = score==highScore?`High Score!\n`:""
  gameActive>1?beginMessage = `Game Over!\n${achieveMessage}${highMessage}Play again?`:{}




 

  let beginScreen = screenView=='default'?<View 
  style={{height:WINDOW_HEIGHT*0.4,width:WINDOW_WIDTH*0.5,backgroundColor:'lightgreen',position:'absolute',left:WINDOW_WIDTH/2-WINDOW_WIDTH*0.25,
  top:WINDOW_HEIGHT/2-WINDOW_HEIGHT*0.2,borderRadius:25,transform:[{scale:showScreen}]
}}>
  <Pressable disabled={showScreen==1?false:true} style={{flex:1,width:'100%',alignItems:'center',justifyContent:'center'}} onPress={()=>HandlePress()}><Text style={{fontSize:22,fontWeight:'bold',textAlign:'center'}}>{beginMessage}</Text></Pressable>
  </View>:[]
function ViewScreen(screen){
  setScreenView(screen)
}
let totalScreen = screenView=='totals'?Totals(totalCollected,setScreenView,WINDOW_WIDTH,WINDOW_HEIGHT):[]
let achievementScreen = screenView=='achievements'?Achievements(achievements,setScreenView,WINDOW_WIDTH,WINDOW_HEIGHT):[]
let showTime = Math.max(0,(60-timer).toFixed(2))
  return (
    <SafeAreaView style={styles.container}>
      {beginScreen}
      <View style={{marginTop:50,marginLeft:20}}>
      <Text style={{fontSize:20}}>Score: {score}</Text>
      <Text style={{fontSize:20}}>High Score: {highScore}</Text>
      <Pressable onPress={()=>ViewScreen('totals')} disabled={showScreen==1?false:true} style={{backgroundColor:'lightblue',alignSelf:'flex-start',borderRadius:5}}><Text style={{fontSize:20}}>View Totals</Text></Pressable>
      <Pressable onPress={()=>ViewScreen('achievements')} disabled={showScreen==1?false:true} style={{backgroundColor:'pink',alignSelf:'flex-start',borderRadius:5}}><Text style={{fontSize:20}}>View Achievements</Text></Pressable>
      {totalScreen}
      {achievementScreen}
      <Text style={{fontSize:20}}>Time Remaining: {showTime}s</Text>
      </View>
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
