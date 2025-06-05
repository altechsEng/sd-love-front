
import { useRoute } from "@react-navigation/native"
import {View,TouchableOpacity,Text,} from "react-native"
import { CustomRegularPoppingText } from "./text"
import { TEXT_SIZE,COLORS } from "../../utils/constants"
import CustomTextInput from "./textInput"
import { useGlobalVariable } from "../context/global"
 

const HolderComponent = ({navigation}) => {
     const {type} = useRoute().params
     const {updateSettingData,isLoading} = useGlobalVariable()
     if(!type) type = ""
     return <View style={{flex:1,backgroundColor:"white",padding:20}}>
          {type=="email" ? 
<View style={{flex:5}}>
     <CustomRegularPoppingText color={"black"} fontSize={TEXT_SIZE.secondary} value={"Enter email verification code we sent at new@email.com, then press on Next."}/>
     <View style={{marginTop:10,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:36,width:"100%", backgroundColor:"#F5F6FC",}}>
     <CustomTextInput RightIconStyles={null} name="pass" placeHolder="" LeftIcon={"key"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null}   setState={(text) => setUpdateSettingData((prev) => ({...prev,emailCode:text}))} state={updateSettingData.emailCode}/>
     </View>
</View> : null}


          {type=="password" ? 
<View style={{flex:5}}>
     <CustomRegularPoppingText color={"black"} fontSize={TEXT_SIZE.secondary} value={"Your password is secret and should not be shared with others. Enter your new password in the form below"}/>
     <View style={{marginTop:10,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:36,width:"100%", backgroundColor:"#F5F6FC",}}>
     <CustomTextInput  RightIconStyles={{position:"absolute",top:12,right:18}} RightIcon="eye" name="pass" placeHolder="" LeftIcon={"lock"} LeftIconStyles={{position:"absolute",top:15,left:18}}    setState={(text) => setUpdateSettingData((prev) => ({...prev,password:text}))} state={updateSettingData.password}/>
     </View>
</View> : null}


   <TouchableOpacity onPress={() => {}} style={{borderRadius:10,alignItems:'center',justifyContent:"center",backgroundColor:type=="email"?COLORS.primary:COLORS.red,paddingVertical:10,paddingHorizontal:20}}>
         {isLoading ? <ActivityIndicator color="white"/>:
          <CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value={type=="email"?"Next":"Change password"}/> }
     </TouchableOpacity> 
     </View>
}

export default HolderComponent