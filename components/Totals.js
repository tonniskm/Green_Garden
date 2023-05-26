import * as React from 'react';
import { Text, View, StyleSheet, Image,PanResponder,Dimensions,ScrollView, Pressable } from 'react-native';
import Fruit, { GetIcon } from './Fruit';



export default function Totals(totalCollected,setScreenView,width,height){
    let rendered = []
    for (let i=0;i<Object.keys(totalCollected).length;i++){
        let type = Object.keys(totalCollected)[i]
        let count = totalCollected[type]
        let opacity = 1
        if(count==0){opacity=0.5}
        let icon = GetIcon(type)
        rendered[i] = <View key={"total"+type} style={{height:40,alignItems:'center',flexDirection:'row'}}>
            <Image source={icon} style={{height:30,width:30,opacity:opacity}}/>
            <Text style={{fontSize:20}}> {type}: {count}</Text>
        </View>
    }
    function GoBack(){
        setScreenView('default')
    }
    return(
        <View style={{position:'absolute',left:0,top:0,backgroundColor:'blue',width:0.9*width,height:0.8*height,zIndex:999}}>
            <Pressable onPress={()=>GoBack()} style={{width:'100%',alignItems:'center'}}><Text style={{fontSize:25}}>Back</Text></Pressable>
            <Text style={{fontSize:25}}>Total Collected:</Text>
            <ScrollView style={{backgroundColor:'red'}}>
            {rendered}
            </ScrollView>

        </View>
    )
}