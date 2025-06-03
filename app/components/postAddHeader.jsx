import axios from "axios"
import {View,Text,TouchableOpacity,Image, ToastAndroid, ActivityIndicator} from "react-native"
import { CustomSemiBoldPoppingText } from "./text";
import { PostScreenXMark } from "./vectors";
import { COLORS, FAMILLY, TEXT_SIZE } from '../../utils/constants';
import {  useGlobalVariable } from "../context/global";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
   } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState,useEffect } from "react";
 


const PostAddHeader = ({navigation}) => { 

  const {postAddData,isLoading,setIsLoading,userData,image} = useGlobalVariable()




 
const createPost = async() => {
  setIsLoading(true)
  try {
    let token = await AsyncStorage.getItem("user_token")
    let postId = await axios.post("/api/create-post",{text:postAddData?.text},{
      headers:{
    'Content-Type': 'multipart/form-data',
    'Authorization':`Bearer ${token}`
      }
    }).then((res) => {

   
  return res.data?.post?.id
}).catch(err => {
  setIsLoading(false)
  console.log(err,"a problem occured post add")
})

    return {
      token,
      postId
    }

  

  } catch(err) {
    console.log(err,"in create post")
    throw(err)
  }
}
const handleSubmitAddPost = async() => {
 let {postId,token} =  await createPost()

const formData = new FormData();
formData.append('post_id', postId)

 
postAddData?.media?.map((data) => {
   console.log(data,"foram data--dasingle")
    formData.append('media[]', {
    uri: data?.img?.uri,
    name: "uploadImg.jpg",
    type:  "image/jpeg"
  })
})

console.log(formData,"Form data")
 
await axios.post('/api/upload-post-images', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization':`Bearer ${token}`
  }
}).then((res) => {
  console.log(res.data,"post images uploaded")
  setIsLoading(false)
  ToastAndroid.show("Post created sucessfully",1000)
  navigation.goBack()
}).catch(err => {
  setIsLoading(false)
  console.log(err,"a problem occured upading post images",err.request,Object.keys(err))
})



}

return <View style={{backgroundColor:"white",paddingHorizontal:20}}>
              <View style={{height:50}}></View> 
              <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

              <View style={{flexDirection:"row",alignItems:"center"}}>

              <TouchableOpacity onPress={()=> navigation.goBack()} style={{justifyContent:"center"}}>
              <PostScreenXMark/>
            </TouchableOpacity>
            <View style={{overflow:"hidden",height:50,width:50,borderRadius:50,marginHorizontal:10}}>
                <Image source={image?{uri:`${image}`} : require("../../assets/images/test_match1.jpg")} style={{height:"100%",width:"100%"}}/>
                </View>

            <CustomSemiBoldPoppingText style={{}} fontSize={TEXT_SIZE.primary } color={"black"}   value={`${userData?.firstname} ${userData?.lastname}` || 'Sam Orlan'}/>
            
              </View>
            
            <TouchableOpacity onPress={()=> handleSubmitAddPost()} style={{marginLeft:20,flexDirection:"row",padding:3,alignItems:"center",justifyContent:"center",borderRadius:20,height:hp(4),width:wp(18),backgroundColor:COLORS.primary}}>
               {isLoading?<ActivityIndicator color={"white"}/>:  <Text style={{fontSize:TEXT_SIZE.small,color:"white",textAlign:"center"}}>Post</Text>}
              </TouchableOpacity>
            
            
            </View>

              

              </View>
          
}

export default PostAddHeader