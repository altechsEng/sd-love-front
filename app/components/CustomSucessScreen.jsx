import { useRoute } from "@react-navigation/native"
import { View,TouchableOpacity} from "react-native"
import {  CustomRegularPoppingText, CustomSemiBoldPoppingText } from "./text"
import { TEXT_SIZE,COLORS,FAMILLY } from "../../utils/constants"
import { SucessScreenTick } from "./vectors"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useGlobalVariable } from "../context/global"

const CustomSucessScreen = ({navigation}) => {
     const {type} = useRoute().params
     const {setRefreshUserData} = useGlobalVariable()
     return <View style={{flex:1,backgroundColor:"white",padding:20,alignItems:"center",justifyContent:"center"}}>

          <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
               <View style={{height:hp("10%"),marginBottom:15,width:hp("10%"),borderRadius:"100%",backgroundColor:"#6EC8BD",alignItems:"center",justifyContent:"center"}}>
               <SucessScreenTick/>
          </View>
          <CustomSemiBoldPoppingText value={`${type} Updated`} style={{textTransform:"capitalize"}} fontSize={TEXT_SIZE.primary} color={"#6EC8BD"}/>
          <CustomRegularPoppingText style={{width:wp("85%"),marginTop:15,textAlign:"center"}} value={"Your data has been changed successfully"} fontSize={TEXT_SIZE.secondary} color={"black"}/>

          </View>
          
          <TouchableOpacity onPress={()=> {
               navigation.navigate("EditProfileScreen")
                
          }} style={{borderRadius:10,marginTop:20,width:"100%",alignItems:'center',justifyContent:"center",backgroundColor:"#6EC8BD",paddingVertical:10,paddingHorizontal:20}}>
                    <CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Back to settings"/>
          </TouchableOpacity>
           
     </View>
}

export default CustomSucessScreen