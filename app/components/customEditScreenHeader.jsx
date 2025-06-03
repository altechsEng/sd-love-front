import axios from "axios"
import { TEXT_SIZE,COLORS,FAMILLY } from "../../utils/constants"
import { useGlobalVariable } from "../context/global"
import { CustomRegularPoppingText } from "./text"
import { CustomEditScreenTick, HeaderBackArrowBlack } from "./vectors"
import {View,TouchableOpacity, ActivityIndicator, ToastAndroid} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CustomProfileScreenHeader = ({navigation}) => {

   const {updateSettingData,setUpdateSettingData,isLoading,setIsLoading,settingType} = useGlobalVariable()
   const handleSubmission = async() => {
     setIsLoading(true)
     try {

               console.log(updateSettingData,"Datoo.....")
          let data = {
               ...updateSettingData,
               country:updateSettingData?.country?.name,
               phone_code:updateSettingData?.country?.dial_code,
               settingType
          }
          let token = await AsyncStorage.getItem("user_token")

     
           
          await axios.post("/api/update-profile-info",data,{
               headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
               }
          }).then(async(res) => {
             
              let info = JSON.stringify({
              user:res.data?.user_data?.user,
              user_info:res.data?.user_data?.user_info,
              user_image:`https://sdlove-api.altechs.africa/storage/app/private/public/user_images/${res.data?.user_image}` || null
            })

              console.log(res.data,"Res datat in custom profile screen axios then",info)
           await AsyncStorage.setItem("user_data",info)
               ToastAndroid.show("Profile info updated sucessfully",1000)
               navigation.navigate("CustomSucessScreen",{type:settingType})
               setIsLoading(false)
          }).catch((err) => {
               console.log(err,"error in custom profile screen axios then",err?.errors,err.request)
               setIsLoading(false)
          })

     } catch(err) {
          console.log(err,"error in handle submition of custom edit screen header")
          throw(err)
     }
  }


     return  <View style={{backgroundColor:"white",justifyContent:"space-between",alignItems:"center",flexDirection:"row",padding:20,borderBottomColor:COLORS.light,borderBottomWidth:2,height:100}}>
              
              
             <TouchableOpacity onPress={() => navigation.goBack()} style={{alignSelf:"flex-end"}}>
              <HeaderBackArrowBlack/>
              </TouchableOpacity>
              


             <TouchableOpacity onPress={() => handleSubmission()} style={{alignSelf:"flex-end",flexDirection:"row",justifyContent:"center",alignItems:"center"}}  >
               {isLoading?<ActivityIndicator color={COLORS.primary}/> :               <View style={{height:15}}>
                <CustomEditScreenTick/>
              </View>}
              <CustomRegularPoppingText style={{marginLeft:10}} color={COLORS.red} fontSize={TEXT_SIZE.primary} value="Save"/>
             </TouchableOpacity>
            
            </View>
          
}

export default CustomProfileScreenHeader