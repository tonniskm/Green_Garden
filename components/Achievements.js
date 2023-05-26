import * as React from 'react';
import { Text, View, StyleSheet, Image,PanResponder,Dimensions,ScrollView, Pressable } from 'react-native';
import Fruit, { GetIcon } from './Fruit';


export default function Achievements(achievements,setScreenView,WINDOW_WIDTH,WINDOW_HEIGHT){
    let rendered = []
    for (let i=0;i<Object.keys(achievements).length;i++){
        let name = Object.keys(achievements)[i]
        let thisOne = achievements[Object.keys(achievements)[i]]
        let title =thisOne.title
        let description = thisOne.description
        let status = thisOne.status
        let opacity = status?1:0.5
        let icon = name=="No_weeds"?require('../assets/Achievements/weed.png'):
        name=="High_achieve"?require('../assets/Achievements/dollar.png'):
        name=="Ash"?require('../assets/Achievements/pokeball.png'):
        name=="Legendary"?require('../assets/Achievements/ring-bell.png'):
        name=="Picky_Eater"?require('../assets/Achievements/cutlery.png'):
        name=="No"?require('../assets/Achievements/cancel.png'):
        name=="Going"?require('../assets/Achievements/sun.png'):
        require('../assets/Achievements/weed.png');
        let color = status?'lightgreen':'pink'

        rendered[i] = <View key={title} style={{alignItems:'center',flexDirection:'row',borderColor:'black',borderWidth:1,backgroundColor:color}}>
            <Image source={icon} style={{height:30,width:30,opacity:opacity}}/>
            <View style={{marginLeft:5}}>
                <Text style={{fontSize:20}}>{title}</Text>
                <View style={{}}><Text style={{fontSize:15,width:'90%'}}>{description}</Text></View>
            </View>
        </View>
    }
    function GoBack(){
        setScreenView('default')
    }
    
    return(
        <View style={{position:'absolute',left:0,top:0,backgroundColor:'lightblue',width:0.9*WINDOW_WIDTH,height:0.8*WINDOW_HEIGHT,zIndex:999}}>
            <Pressable onPress={()=>GoBack()} style={{width:'100%',alignItems:'center'}}><Text style={{fontSize:25}}>Back</Text></Pressable>
            <Text style={{fontSize:25}}>Achievements:</Text>
            <ScrollView style={{backgroundColor:'pink'}}>
            {rendered}
            </ScrollView>

        </View>
    )
}