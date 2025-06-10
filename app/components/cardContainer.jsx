import React from 'react';
import {useSharedValue} from 'react-native-reanimated';
import Card from './card';
import {View,TouchableOpacity,Text,Dimensions,Image} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { FAMILLY, TEXT_SIZE,COLORS } from '../../utils/constants';
import { MatchScreenFace, MatchScreenHeartWhite, MatchScreenXmark } from './vectors';
 const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
 

const CardContainer = ({data, maxVisibleItems,isLoading}) => {
  const animatedValue = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);

  if(isLoading) {
    return ( <View>
      <View style={{position:"relative",zIndex:10,height:SCREEN_HEIGHT*0.78,width:SCREEN_WIDTH*0.9,borderRadius:20,alignItems:"center",justifyContent:"center",overflow:"hidden",backgroundColor:COLORS.light}}>
           
             

                <LinearGradient colors={["rgba(215, 168, 152, 0)",COLORS.light]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:80,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:-5,width:"100%"}} >
                       
                </LinearGradient>



                
          
           </View>

           <View style={{alignItems:"center",justifyContent:"center"}}>
           <View style={{position:"absolute",margin:"auto",zIndex:9,bottom:-15,backgroundColor:"#F5F6FC",height:50,width:SCREEN_WIDTH*0.85,borderRadius:20}}></View>
           <View style={{position:"absolute",margin:"auto",zIndex:8,bottom:-25,backgroundColor:"#F5F6FC",height:50,width:SCREEN_WIDTH*0.75,borderRadius:20}}></View>
           </View> 
    </View>
    )
  }

  if(data.length<1) {
    return ( <View>
      <View style={{position:"relative",zIndex:10,height:SCREEN_HEIGHT*0.78,width:SCREEN_WIDTH*0.9,borderRadius:20,alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
           <View style={{backgroundColor:"rgba(215, 168, 152, 0.5)",position:"absolute",top:13,left:10,zIndex:11,borderRadius:10,paddingVertical:5,paddingHorizontal:10}}> 
                <Text style={{fontFamily:FAMILLY.semibold,color:"white",textTransform:"capitalize",fontSize:TEXT_SIZE.small}}> Los angeles - 7km </Text>
           </View>
                <View style={{flexDirection:"column",alignItems:"center",justifyContent:"space-evenly",position:"absolute",bottom:28,right:20,zIndex:11}}>
                     <TouchableOpacity style={{backgroundColor:"#E55E6F",alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,marginTop:10}}><MatchScreenFace/></TouchableOpacity>
                     <TouchableOpacity style={{backgroundColor:"#D7A898",alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,marginTop:10}}><MatchScreenHeartWhite/></TouchableOpacity>
                     <TouchableOpacity style={{backgroundColor:"white",alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,marginTop:10}}><MatchScreenXmark/></TouchableOpacity>
                </View>

                <LinearGradient colors={["rgba(215, 168, 152, 0)","rgba(215, 168, 152, 1)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:80,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:-5,width:"100%"}} >
                <View style={{flexDirection:"column",marginLeft:10}}>
                <View style={{ height:30, flexDirection:"row",alignItems:"center"}}>
                <Text style={{fontSize:TEXT_SIZE.title,fontFamily:FAMILLY.semibold,color:"white"}}>Maggy, </Text>
                <Text style={{fontSize:TEXT_SIZE.title ,margin:0,padding:0,fontFamily:FAMILLY.light,color:"white",marginLeft:10,marginTop:3,textAlign:"center",textAlignVertical:"center"}}>24 ans</Text>
                </View>
                <View style={{}}>
                <Text style={{fontSize:TEXT_SIZE.secondary,fontFamily:FAMILLY.light,color:"white"}}>Revelation Church, Los Angeles</Text>
                </View>
                </View>         
                </LinearGradient>



                <TouchableOpacity onPress={() => {}} style={{width:"100%",height:"100%"}}><Image source={require("../../assets/images/test_match1.jpg")} resizeMode="cover" style={{height:"100%",width:"100%",zIndex:9}}/></TouchableOpacity>
          
           </View>

           <View style={{alignItems:"center",justifyContent:"center"}}>
           <View style={{position:"absolute",margin:"auto",zIndex:9,bottom:-15,backgroundColor:"#EAD2CA",height:50,width:SCREEN_WIDTH*0.85,borderRadius:20}}></View>
           <View style={{position:"absolute",margin:"auto",zIndex:8,bottom:-25,backgroundColor:"#F0E8E5",height:50,width:SCREEN_WIDTH*0.75,borderRadius:20}}></View>
           </View> 
    </View>
    )
  } 



  return (
    <>
      {data.map((item, index) => {
        return (
          <Card
            maxVisibleItems={maxVisibleItems}
            item={item}
            index={index}
            dataLength={data.length}
            animatedValue={animatedValue}
            currentIndex={currentIndex}
            prevIndex={prevIndex}
            key={index}
          />
        );
      })}
    </>
  );
};

export default CardContainer;