import { useRoute } from "@react-navigation/native"
import { View,TouchableOpacity} from "react-native"
import {  CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../components/text"
import { TEXT_SIZE,COLORS,FAMILLY } from "../../utils/constants"
import { SucessScreenTick } from "../components/vectors"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useGlobalVariable } from "../context/global"

const AccountDeleted = ({navigation}) => {

     const {type} = useRoute().params

     return <View style={{flex:1,backgroundColor:"white",padding:20,alignItems:"center",justifyContent:"center"}}>

          <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
               <View style={{height:hp("10%"),marginBottom:15,width:hp("10%"),borderRadius:"100%",backgroundColor:"#6EC8BD",alignItems:"center",justifyContent:"center"}}>
               <SucessScreenTick/>
          </View>
          <CustomSemiBoldPoppingText value={`${type} Updated`} style={{textTransform:"capitalize"}} fontSize={TEXT_SIZE.primary} color={"#6EC8BD"}/>
          <CustomRegularPoppingText style={{width:wp("85%"),marginTop:15,textAlign:"center"}} value={"Your account and all your data where deleted successfully"} fontSize={TEXT_SIZE.secondary} color={"black"}/>

          </View>
          
          <TouchableOpacity onPress={()=> {
               navigation.navigate("Login")
                
          }} style={{borderRadius:10,marginTop:20,width:"100%",alignItems:'center',justifyContent:"center",backgroundColor:"#6EC8BD",paddingVertical:10,paddingHorizontal:20}}>
                    <CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Login"/>
          </TouchableOpacity>
           
     </View>
}

export default AccountDeleted