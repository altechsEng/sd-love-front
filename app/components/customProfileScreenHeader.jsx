import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {View,Text,TouchableOpacity, Image} from "react-native"
import { useGlobalVariable } from "../context/global";
import { COLORS,FAMILLY,TEXT_SIZE } from "../../utils/constants";
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "./text";
import { ProfileScreenBars } from "./vectors";
import { useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomProfileScreenHeader = ({navigation}) => {
     const [isProfileMenuAcitve,setIsProfileMenuActive] = useState(false)
  
     const {setActiveSubCat,activeSubCat,image,userData} = useGlobalVariable()
  


     

     return <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:2,backgroundColor:"white",padding:20,borderColor:COLORS.light,paddingTop:60}}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                             <View style={{overflow:"hidden",height:50,width:50,borderRadius:50,marginRight:10}}>
           <Image source={image ? {uri:`${image}`}:require("../../assets/images/match_con1.jpg.jpg")} style={{height:"100%",width:"100%"}}/>
          </View>



                         
                <View style={{alignItems:"flex-start",flexDirection:"column",justifyContent:"flex-start",marginTop:9}}>
                <CustomSemiBoldPoppingText style={{marginRight:5,lineHeight:14}} fontSize={TEXT_SIZE.primary} color={"black"}   value={`Joseph Orlan`}/>
              
               <View style={{flexDirection:"row",alignItems:"center"}}>
           <CustomRegularPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.small-1} color={"#A0A7AE"}   value={`18 posts`}/>

           <View style={{backgroundColor:"white",height:25,alignItems:"center",justifyContent:"center"}}> 
                <View style={{height:5,marginBottom:2,width:5,backgroundColor:"black",borderRadius:50,borderColor:"black",borderWidth:0,marginRight:5}}></View>
           </View>
           <CustomRegularPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.small-1} color={"#A0A7AE"}   value={`283 followers`}/>
            
                       <View style={{backgroundColor:"white",height:25,alignItems:"center",justifyContent:"center"}}> 
                <View style={{height:5,marginBottom:2,width:5,backgroundColor:"black",borderRadius:50,borderColor:"black",borderWidth:0,marginRight:5}}></View>
           </View>
           <CustomRegularPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.small-1} color={"#A0A7AE"}   value={`99 following`}/>
            
               </View>



                </View>
                </View>

                <TouchableOpacity onPress={() => {
                    if(isProfileMenuAcitve == true) {
                         setIsProfileMenuActive(false)
                         setActiveSubCat("About")
                    } else {
                         setIsProfileMenuActive(true)
                         setActiveSubCat("account")
                    }
                }} style={{backgroundColor:isProfileMenuAcitve === true ? "#2E2E2E":COLORS.light,height:40,width:40,borderRadius:40,justifyContent:"center",alignItems:"center"}} >
                <ProfileScreenBars fill={isProfileMenuAcitve === true ? "white":"black"}/>
                </TouchableOpacity>
                                    
                                    </View>
}


export default CustomProfileScreenHeader