import axios from "axios"
import {View,Text,TouchableOpacity,Image} from "react-native"
import { CustomSemiBoldPoppingText } from "./text";
import { PostScreenXMark } from "./vectors";
import { COLORS, FAMILLY, TEXT_SIZE } from '../../utils/constants';
import { useGlobalVariable } from "../context/global";


const PostAddHeader = ({navigation}) => { 


const handleSubmitAddPost = async() => {
const {postAddData} = useGlobalVariable()
  const formData = new FormData();

  // Append text
  formData.append("text", postAddData.text);

  // Append media (fixed syntax)
  if (postAddData.media?.length > 0) {
    formData.append("media", {  // <-- "media" as string literal
      uri: postAddData.media[0].img.uri,
      type: postAddData.media[0].img.type || "image/jpeg", // Fallback MIME type
      name: postAddData.media[0].img.fileName || "upload.jpg", // Fallback filename
    } );  
  }

  let headers =  {
          "Accept": "application/json",
          "Content-Type": `multipart/form-data`,
        }

  try {
    const response = await axios.post(
      "https://sdlove-api.altechs.africa/api/new-post",
       formData,
      {headers}
    );
    console.log(response.data);
  } catch (err) {
     console.log(err,"erroross",err.request,Object.keys(err.request))
    console.log( err?.response?.data,"okayy lets see",Object.keys(err.response))
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
            
            <TouchableOpacity onPress={()=> {
              handleSubmitAddPost()
            }} style={{marginLeft:20,flexDirection:"row",padding:3,alignItems:"center",justifyContent:"center",borderRadius:20,height:hp(4),width:wp(18),backgroundColor:COLORS.primary}}>
                <Text style={{fontSize:TEXT_SIZE.small,color:"white",textAlign:"center"}}>Post</Text>
              </TouchableOpacity>
            
            
            </View>

              <View style={{height:20}}></View>

              </View>
          
}

export default PostAddHeader