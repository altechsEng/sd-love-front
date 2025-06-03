import { View,Text,TouchableOpacity } from "react-native"
import { TEXT_SIZE,FAMILLY,COLORS } from "../../utils/constants"
import { LinearGradient } from "react-native-linear-gradient";
export const CustomMatchLoader = () => {

     return                     <TouchableOpacity style={{flex:1,position:"relative",alignItems:"center",justifyContent:"center",marginRight:10,borderRadius:20,width:130,overflow:"hidden",marginVertical:10,backgroundColor:COLORS.light}}  >
                               
                                 <LinearGradient colors={["rgba(215, 168, 152, 0)","white"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:50,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:-5,width:"100%"}} >
                                 <View style={{flexDirection:"column",marginLeft:10}}>
                                 <View style={{ height:19,flexDirection:"row",alignItems:"center"}}>
                                 <Text style={{fontSize:TEXT_SIZE.primary,fontFamily:FAMILLY.semibold,color:"white"}}> </Text>
                                 <Text style={{fontSize:TEXT_SIZE.primary -3,margin:0,padding:0,fontFamily:FAMILLY.light,color:"white",marginLeft:10,marginTop:3,textAlign:"center",textAlignVertical:"center",width:25,backgroundColor:COLORS.light}}> </Text>
                                 </View>
                                  <View style={{}}>
                                  <Text style={{fontSize:TEXT_SIZE.small-2,fontFamily:FAMILLY.light,color:"white"}}> </Text>
                                  </View>
                                 </View>         
                                 </LinearGradient>
      
     
                       
                           
                              {/* <Image source={item?.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/> */}
                         </TouchableOpacity>
}


export default CustomMatchLoader