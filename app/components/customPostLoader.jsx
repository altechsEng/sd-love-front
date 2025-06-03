import {View,TouchableOpacity,Text} from "react-native"
import { COLORS,TEXT_SIZE,FAMILLY } from "../../utils/constants"
import { HomeFeedComment, HomeFeedHeart, HomeFeedShare, HomeFeedThreeDots } from "./vectors"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const CustomPostLoader = () => {
     return                <View   style={{flex:1,marginVertical:10,marginRight:20,width:wp(80),flexDirection:"column"}}>
                         <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>
                         <View style={{flex:2,flexDirection:"row"}}>
                         <TouchableOpacity style={{borderRadius:50,height:50,width:50,overflow:"hidden",alignItems:"center",backgroundColor:COLORS.light}}> 

                         </TouchableOpacity>
                         <View style={{flexDirection:"column",justifyContent:"center",marginLeft:10}}>
                         <Text style={{width:hp("10%"),marginBottom:5,color:COLORS.black,fontSize:TEXT_SIZE.secondary-2,fontFamily:FAMILLY.semibold,backgroundColor:COLORS.light}}> </Text>
                         <Text style={{color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light,backgroundColor:COLORS.light}}> </Text>
                         </View>
                         </View>
     
                         <View style={{backgroundColor:COLORS.light,height:25,width:80,borderRadius:20,alignItems:"center",justifyContent:"center"}}><Text style={{color:"white",fontSize:TEXT_SIZE.secondary-2}}> </Text></View>
                         </View> 
                         <View style={{marginVertical:10,backgroundColor:COLORS.light}}>
                              <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>
                         
                              </Text>
                         </View> 
     
                         <TouchableOpacity style={{height:200,margin:0,padding:0,overflow:"hidden",borderRadius:20,backgroundColor:COLORS.light}}>
                             
                         </TouchableOpacity>
     
                       
                         <View style={{height:30,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
     
                              <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}} >
     
                              <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                              <TouchableOpacity><HomeFeedHeart stroke={COLORS.light} fill={COLORS.light}/></TouchableOpacity>
                              <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}></Text>
                              </View>
     
                              <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                              <TouchableOpacity  ><HomeFeedComment fill={COLORS.light} stroke={COLORS.light}/></TouchableOpacity>
                              <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}></Text>
                              </View>
     
                              <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                   <TouchableOpacity><HomeFeedShare stroke={COLORS.light} fill={COLORS.light}/></TouchableOpacity>
                                   <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}></Text>
                              </View>
     
                              </View>
     
                              <View>
                                   <TouchableOpacity><HomeFeedThreeDots fill={COLORS.light}/></TouchableOpacity>
                              </View>
     
                         </View>
                    </View>
}

export default CustomPostLoader