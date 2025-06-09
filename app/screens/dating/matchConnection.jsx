import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../app/components/text';
import { MatchConnectionBackArrow, MatchConnectionHeart } from '../../components/vectors';
import { BaseImageUrl, COLORS, TEXT_SIZE } from '../../../utils/constants';
import React, { useEffect } from 'react'
import {View,Dimensions,Image,TouchableOpacity} from "react-native"
import { LinearGradient } from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from '@react-navigation/native';
import { useGlobalVariable } from '../../context/global';

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')

export default function MatchConnection({navigation}) {

     const {item} = useRoute().params
     const {userData,image} = useGlobalVariable()
     const maleImage = item?.match_user?.user_infos[0]?.qP1 === "Homme" ? `${BaseImageUrl}/${item?.match_user?.user_image}` : image
     const femaleImage = item?.match_user?.user_infos[0]?.qP1 === "Femme" ? `${BaseImageUrl}/${item?.match_user?.user_image}` : image
     
     useEffect(()=> {
          console.log(image,"user data....",item?.score)
     },[])
 
     return (
          <View style={{backgroundColor:"white",alignItems:"center",flex:1}}>


          <LinearGradient colors={["rgba(215, 168, 152, 1)","rgba(255, 255, 255, 0.03)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:SCREEN_HEIGHT*0.6,width:"100%",position:"relative"}} >      
          <View style={{paddingHorizontal:20,backgroundColor:""}}>
          <View style={{height:50}}></View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems:"flex-start",justifyContent:"flex-start"}}>
          <MatchConnectionBackArrow/>
          </TouchableOpacity>
          </View>
          
          <View style={{position:"absolute",alignSelf:"center"}}>
               <View style={{top:hp(25), height:240,width:240,borderRadius:"100%",backgroundColor:'rgba(215, 168, 152, 0.35)'}}></View>
          </View>

          <View style={{position:"absolute",alignSelf:"center"}}>
          <View style={{top:hp(22.3),height:280,width:280,borderRadius:"100%",borderColor:'#D7A898',borderWidth:1}}></View>
          </View>


          <View style={{position:"absolute",alignSelf:"center"}}>
          <View style={{top:hp(10),height:500,width:500,borderRadius:"100%",borderColor:'#D7A898',borderWidth:1,borderStyle:"dashed"}}></View>
          </View>

          <CustomSemiBoldPoppingText style={{textAlign:"center",marginVertical:20}} color="#D0917B" fontSize={TEXT_SIZE.title+8} value={ `${item?.score}%` || "89%"}/>

          <View style={{position:"relative",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
          <View style={{transform:[{rotate:"-4.58deg"}],position:"absolute",top:hp(2),left:40,zIndex:8,overflow:"hidden",height:200,width:150,borderRadius:20,padding:3,backgroundColor:"white"}}>
         <Image source={ {uri:`${maleImage}`}||require('../../../assets/images/match_con1.jpg.jpg')} style={{borderRadius:20,width:"100%",height:"100%"}} resizeMode='cover'/>
         </View>

         <View style={{position:"absolute",top:hp(20),zIndex:11,alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,backgroundColor:COLORS.primary}}>
          <MatchConnectionHeart/>
         </View>

         <View style={{position:"absolute",top:hp(8),right:40,transform:[{rotate:"11deg"}],zIndex:10,overflow:"hidden",height:200,width:150,borderRadius:20,padding:3,backgroundColor:"white"}}>
         <Image source={{uri:`${femaleImage}`} || require('../../../assets/images/test_match1.jpg')} style={{borderRadius:20,width:"100%",height:"100%"}} resizeMode='cover'/>
         </View>
          </View>
          
          </LinearGradient>


          <View style={{alignItems:"center",width:"80%",justifyContent:"center",marginTop:50}}>
               <CustomSemiBoldPoppingText style={''} value={`it is a match, ${userData?.firstname} ${userData?.lastname}`} color="black" fontSize={TEXT_SIZE.title}/>
               <CustomRegularPoppingText style={{textAlign:"center",width:"80%",margin:"auto"}} 
               value={`You and ${item?.match_user?.firstname} ${item?.match_user?.lastname} have matched, start a conversation with each other now.`} color="#5E5E5E" fontSize={TEXT_SIZE.small}/>
          </View>

     
          <TouchableOpacity style={{marginTop:60,width:"80%",paddingVertical:10,borderRadius:20,backgroundColor:COLORS.primary}}>
                    <CustomRegularPoppingText fontSize={TEXT_SIZE.small+2} value={`Connect with ${item?.match_user?.firstname} ${item?.match_user?.lastname}`} style={{textAlign:"center"}} color={"white"}/>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => navigation.navigate("MatchProfile",{item})} style={{marginTop:10,width:"80%",paddingVertical:10,borderRadius:20,backgroundColor:"rgba(215, 168, 152, 0.13)"}}>
                    <CustomRegularPoppingText fontSize={TEXT_SIZE.small+2} value="View profile" style={{textAlign:"center"}} color={COLORS.primary}/>
               </TouchableOpacity>
     

          </View>
     )
}