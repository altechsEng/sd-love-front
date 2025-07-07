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
import { useMutation, useQueryClient } from "@tanstack/react-query";
 


const PostEditHeader = ({navigation}) => { 

  const {postEditData,isLoading,setIsLoading,userData,image,editingPostItem} = useGlobalVariable()
  const queryClient = useQueryClient()



 
   const updatePostMutation = useMutation({
    mutationFn: async ({post_id}) => {
      const token = await AsyncStorage.getItem("user_token");
      const response = await axios.post(
        "/api/update-post",
        { text: postEditData?.text , post_id },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return { postId: response.data?.post?.id, token };
    },
    onError: (error) => {
      console.log("Post update error:", error?.request);
      setIsLoading(false);
      ToastAndroid.show("Failed to update post", ToastAndroid.SHORT);
    }
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async ({ postId, token }) => {
      const oldMedia = []
      const newMedia = []
      let allMedia = postEditData?.media
      const formData = new FormData();

      formData.append('post_id', postId);
      postEditData?.media?.forEach((data) => {
        if(data?.isOld == true) {
          oldMedia.push(data)
        }else{
        formData.append('newMedia[]', {
          uri: data?.img?.uri,
          name: "uploadImg.jpg",
          type: "image/jpeg"
        });
         newMedia.push(data)
        }



      });

   

      if(newMedia.length >0) {
        const response =  await axios.post('/api/upload-updated-post-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
 
     
  
     let responseMedia = response.data?.media
      return {
        newMedia,oldMedia,response : response.data,allMedia:[...oldMedia,...responseMedia]
      }
      } else {
      return {
        newMedia,oldMedia,response : {status:200},allMedia
      }
      }
    },
    onError: (error) => {
      console.error("Image upload in update post error:", error.request);
      setIsLoading(false);
      ToastAndroid.show("Failed to update and upload images", ToastAndroid.SHORT);
    }
  });


  const manageImagesMutatin = useMutation({
    mutationFn:async({oldMedia,newMedia,token,postId,allMedia})=>{
      let formData = new FormData()
      formData.append('post_id',postId)
      let old = JSON.stringify(oldMedia)
      let newD = JSON.stringify(newMedia)
      let allM= JSON.stringify(allMedia)
      formData.append('oldMedia',old)
      formData.append('newMedia',newD)
      formData.append('allMedia',allM)


    

     const response =  await axios.post("/api/manage-updated-post-images", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log(response.data,"nmngae imagesmuatttion")
      return {response:response.data}
    },
    onError: (error) => {
      console.error("mange image mediat post error:", error.request);
      setIsLoading(false);
      ToastAndroid.show("Failed to mdofiy and upload images", ToastAndroid.SHORT);
    }
  })

  const handleSubmitEditPost = async () => {
    setIsLoading(true);
    
    try {
      let post_id = editingPostItem?.id

      
      // Step 1: Create the post
      const { postId, token } = await updatePostMutation.mutateAsync({post_id});
      
      // Step 2: Upload images if they exist
      if (postEditData?.media?.length > 0) {
       let {oldMedia,newMedia,response,allMedia} =   await uploadImagesMutation.mutateAsync({ postId, token });
     
       if(response?.status  == 200){
        await manageImagesMutatin.mutateAsync({oldMedia,newMedia,token,postId,allMedia})
       }
      }

      // Step 3: Invalidate queries and navigate
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({queryKey:['userPostsImages']})
      ]);
      
      ToastAndroid.show("Post updated successfully", ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error("Error in post update flow:", error);
    } finally {
      setIsLoading(false);
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
                <Image source={image?{uri:`${image}`} : require("../../assets/images/test_match1.jpg")} style={{height:"100%",width:"100%"}}/>
                </View>

            <CustomSemiBoldPoppingText style={{}} fontSize={TEXT_SIZE.primary } color={"black"}   value={`${userData?.firstname} ${userData?.lastname}` || 'Sam Orlan'}/>
            
              </View>
            
            <TouchableOpacity onPress={()=> handleSubmitEditPost()} style={{marginLeft:20,flexDirection:"row",padding:3,alignItems:"center",justifyContent:"center",borderRadius:20,height:hp(4),width:wp(18),backgroundColor:COLORS.primary}}>
               {isLoading?<ActivityIndicator color={"white"}/>:  <Text style={{fontSize:TEXT_SIZE.small,color:"white",textAlign:"center"}}>Edit</Text>}
              </TouchableOpacity>
            
            
            </View>

              

              </View>
          
}

export default PostEditHeader