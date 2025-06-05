
import { TouchableOpacity, View } from "react-native"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../components/text"
import { COLORS, TEXT_SIZE } from "../../../utils/constants"
import { useGlobalVariable } from "../../context/global"
import { AccountSecurityScreenDelete, AccountSecurityScreenGuardIcon, EditProfileScreenPen } from "../../components/vectors"
const AccountSecurityScreen = ({navigation}) => {
     const {userData} = useGlobalVariable()
     return <View style={{flex:1,backgroundColor:"white",padding:20}}>

          <CustomSemiBoldPoppingText style={{}} value={"Email address"} fontSize={TEXT_SIZE.primary} color={"black"}/>
          <View style={{alignItems:"center",justifyContent:"space-between",flexDirection:"row"}}>
           <CustomRegularPoppingText style={{}} value={userData?.email || "testemail@gmail.com"} fontSize={TEXT_SIZE.secondary} color={"#808A94"}/>
          <TouchableOpacity onPress={() => navigation.navigate("CustomEditSetting",{type:"email"})} style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
          <EditProfileScreenPen/>
          <CustomRegularPoppingText value={"Change"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
          </TouchableOpacity>
          </View>

          <CustomSemiBoldPoppingText style={{marginTop:20}} value={"Password reset"} fontSize={TEXT_SIZE.primary} color={"black"}/>
          <CustomRegularPoppingText color={"#808A94"} style={{}} value={"You can update your password anytime you want, make sure not to share your password with other people to ensure the integrity of your account."} fontSize={TEXT_SIZE.secondary}/>
          <TouchableOpacity onPressIn={()=> navigation.navigate("CustomEditSetting",{type:"password"})} style={{flexDirection:"row",marginTop:20}} onPress={() => {}}>
               <AccountSecurityScreenGuardIcon/>
               <CustomRegularPoppingText value={"Change password"} style={{marginLeft:10}} color={"#E55E6F"} />
          </TouchableOpacity>


          <CustomSemiBoldPoppingText style={{marginTop:20}} value={"Account Deletion"} fontSize={TEXT_SIZE.primary} color={"black"}/>
          <CustomRegularPoppingText color={"#808A94"} style={{}} value={"By deleting your account, all data will be erased from our server, this action is irreversible."} fontSize={TEXT_SIZE.secondary}/>


          <TouchableOpacity style={{flexDirection:"row",marginTop:20}} onPress={() => {}}>
               <AccountSecurityScreenDelete/>
               <CustomRegularPoppingText value={"Delete my account"} style={{marginLeft:10}} color={"#E55E6F"} />
          </TouchableOpacity>
     </View>
}
export default AccountSecurityScreen