import axios from "axios"
import {View,Text,TouchableOpacity,Image, ToastAndroid} from "react-native"
import { CustomSemiBoldPoppingText } from "./text";
import { PostScreenXMark } from "./vectors";
import { COLORS, FAMILLY, TEXT_SIZE } from '../../utils/constants';
import {  useGlobalVariable } from "../context/global";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
   } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
 


const PostAddHeader = ({navigation}) => { 

  const {postAddData} = useGlobalVariable()

const handleSubmitAddPost = async() => {
  console.log("in function -- called")

try{
   
    const formData = new FormData();



  // Append text
  formData.append("text", postAddData.text);

  // Append media (fixed syntax)
  // if (postAddData.media?.length > 0) {
  //   formData.append("media", {  // <-- "media" as string literal
  //     uri: postAddData.media[0].img.uri,
  //     type: postAddData.media[0].img.type || "image/jpeg", // Fallback MIME type
  //     name: postAddData.media[0].img.fileName || "upload.jpg", // Fallback filename
  //   } );  
  // }

 

     console.log(formData,"ssss")
  let token = await AsyncStorage.getItem("user_token")
    await axios.post(
      "/api/new-post",
       formData,
      {headers:{
        "Accept":"application/json",
        "Content-Type":"application/json",
        "Content-Type":"multipart/form-data",
         "Authorization":`Bearer ${token}` 
      }}
    ).then((res) => {
      console.log(res.data) 
      ToastAndroid.show(res.data.message,1000)
      navigation.navigate("BottomTabsHome",{screen:"Feeds"})
    }).catch(err => {
     console.log(err.request,"skk")
    console.log( err?.response?.data,"okayy lets see",Object.keys(err))
    })
    
} catch(err) {
  console.log(err)
}

 

 
};

return <View style={{backgroundColor:"white",paddingHorizontal:20}}>
              <View style={{height:50}}></View> 
              <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

              <View style={{flexDirection:"row",alignItems:"center"}}>

              <TouchableOpacity onPress={()=> navigation.goBack()} style={{justifyContent:"center"}}>
              <PostScreenXMark/>
            </TouchableOpacity>
            <View style={{overflow:"hidden",height:50,width:50,borderRadius:50,marginHorizontal:10}}>
                <Image source={require("../../assets/images/test_match1.jpg")} style={{height:"100%",width:"100%"}}/>
                </View>

            <CustomSemiBoldPoppingText style={{}} fontSize={TEXT_SIZE.primary } color={"black"}   value={'Sam Orlan'}/>
            
              </View>
            
            <TouchableOpacity onPress={()=> handleSubmitAddPost()} style={{marginLeft:20,flexDirection:"row",padding:3,alignItems:"center",justifyContent:"center",borderRadius:20,height:hp(4),width:wp(18),backgroundColor:COLORS.primary}}>
                <Text style={{fontSize:TEXT_SIZE.small,color:"white",textAlign:"center"}}>Post</Text>
              </TouchableOpacity>
            
            
            </View>

              

              </View>
          
}

export default PostAddHeader