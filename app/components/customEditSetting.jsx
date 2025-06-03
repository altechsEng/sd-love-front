import { useRoute } from "@react-navigation/native"
import {TouchableOpacity, View,ActivityIndicator} from "react-native"
import { CustomRegularPoppingText } from "./text"
import { COLORS, TEXT_SIZE } from "../../utils/constants"
import CustomTextInput from "./textInput"
import { useState } from "react"
 

const CustomEditSetting = ({navigation}) => {
   let {type} = useRoute().params
   const [isLoading,setLoading] = useState(false)
   const [state,setState] = useState(null)
     return <View style={{flex:1,backgroundColor:"white",padding:20}}>
<View style={{flex:5}}>
          <CustomRegularPoppingText fontSize={TEXT_SIZE.secondary} color={COLORS.black} style={{marginTop:20}} value={"Before you proceed, you should note that people may note be able to easily find you after changing your name."}/>
     
     <View style={{marginTop:20,position:"relative",borderRadius:50,paddingVertical:0,paddingHorizontal:36,width:"100%",     backgroundColor:"#F5F6FC",}}>
  <CustomTextInput RightIconStyles={null} name="firstname" placeHolder="First Name" LeftIcon={"person"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null} setState={setState} state={state}/>
     </View>

<View style={{marginTop:20,position:"relative",borderRadius:50,paddingVertical:0,paddingHorizontal:36,width:"100%",     backgroundColor:"#F5F6FC",}}>
   <CustomTextInput RightIconStyles={null} name="lastnames" placeHolder="Last Name" LeftIcon={"person"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null} setState={setState} state={state}/>
     </View>
</View>
       
        
<View style={{}}>
                <TouchableOpacity onPress={() => handleSubmission()} style={{borderRadius:10,alignItems:'center',justifyContent:"center",backgroundColor:COLORS.primary,paddingVertical:10,paddingHorizontal:20}}>
               {isLoading ? <ActivityIndicator color="white"/>:
                <CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Suivant"/> }
           </TouchableOpacity>
</View>
     
     </View>
}


export default CustomEditSetting