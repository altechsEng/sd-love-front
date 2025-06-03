

import React,{useState} from 'react'
import {View,Text,TouchableOpacity,Image,Dimensions,FlatList,KeyboardAvoidingView,Platform} from 'react-native'
import {useRoute} from '@react-navigation/native'
import { COLORS, FAMILLY, TEXT_SIZE } from "../../utils/constants";
import { PostScreenSendComment,HomeFeedBell,PostScreenImagePicker,PostScreenBigComment,PostScreenBookMark, HomeFeedComment,PostScreenDots, HomeFeedGradient, HomeFeedHeart, HomeFeedSearch,HomeFeedShare,HomeFeedSmallArrowRight,HomeFeedThreeDots,LogoSmall, PostScreenMiniHeart } from "./vectors";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
   } from "react-native-responsive-screen";
   import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../app/components/text';
   import CustomTextInput from "../../app/components/textInput";
   import { ScrollView } from "react-native-gesture-handler";

   const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')

const MessageSender = ({action,state,setState,placeHolder}) => {
     return <View style={{paddingHorizontal:2,alignItems:"center",justifyContent:"space-evenly",flexDirection:"row",paddingTop:10}}>
     <TouchableOpacity> 
          <PostScreenImagePicker/> 
     </TouchableOpacity>
     <View style={{position:"relative",borderRadius:50,paddingVertical:0,paddingHorizontal:36,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
     <CustomTextInput RightIconStyles={null} name="comment" placeHolder={placeHolder} LeftIcon={"face"} LeftIconStyles={{position:"absolute",top:9,left:9}} RightIcon={null} setState={setState} state={state}/>
     </View>
     <TouchableOpacity onPress={()=> action()} style={{backgroundColor:COLORS.primary,height:35,width:35,borderRadius:50,alignItems:"center",justifyContent:"center"}}>
     <PostScreenSendComment/>
     </TouchableOpacity>
     </View>
}

export default MessageSender