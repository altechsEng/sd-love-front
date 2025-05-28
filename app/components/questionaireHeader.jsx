import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native'
import { LinearGradient } from "react-native-linear-gradient";
import { useGlobalVariable } from '../context/global';
import { HeaderBackArrowBlack } from './vectors';
import { COLORS, FAMILLY, TEXT_SIZE } from '../../utils/constants';

export const QuestionaireHeader = ({navigation,text}) => {
       const {questionnaireProgress} = useGlobalVariable()
      
     return             <View style={{height:80,backgroundColor:"white"}}>
                 <View style={{height:50}}></View>
                 <View style={{backgroundColor:"white",alignItems:"center",justifyContent:"space-between",flexDirection:"row",padding:10}}>
                   
                   <View style={{flexDirection:"row"}}>
                   <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop:2,height:30,width:30,borderRadius:20,backgroundColor:"#F3F3F3",alignItems:"center",justifyContent:"center"}} >
                     <HeaderBackArrowBlack/>
                   </TouchableOpacity>
                   
       
                   </View>
     
     
                   <View style={{alignItems:"center",justifyContent:"center"}}>
                   <Text style={{color:'#808A94',fontFamily:FAMILLY.semibold,fontSize:TEXT_SIZE.small}}>{text}</Text>
                   <Text style={{color:COLORS.black,fontFamily:FAMILLY.semibold,fontSize:TEXT_SIZE.secondary}}>{text}</Text>
                   </View>
       
       
                   <TouchableOpacity style={{borderRadius:50,height:30,width:30,backgroundColor:COLORS.primary,padding:5,alignItems:"center",justifyContent:"center"}}>
                     <Text style={{color:"white",fontSize:TEXT_SIZE.secondary,fontFamily:FAMILLY.semibold}}>3</Text>
                   </TouchableOpacity>
       
     
                 </View>
     
 
                 <View style={{height:5,backgroundColor:"#D9D9D9"}}>
             
                     <View style={{height:'100%',width:`${questionnaireProgress/29 *100}%`,overflow:"hidden"}}>
                    <LinearGradient colors={["rgba(215, 168, 152, 0)","rgba(215, 168, 152, 1)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:80,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:-5,width:"100%"}} >      
                    </LinearGradient>
                     </View>
                 </View>
                
                 <View style={{height:50}}></View>
                 </View>
}