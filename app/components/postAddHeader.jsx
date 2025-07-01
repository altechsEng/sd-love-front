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
 


const PostAddHeader = ({navigation}) => { 

  const {postAddData,isLoading,setIsLoading,userData,image} = useGlobalVariable()
  const queryClient = useQueryClient()



 
   const createPostMutation = useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem("user_token");
      const response = await axios.post(
        "/api/create-post",
        { text: postAddData?.text },
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
      console.log("Post creation error:", error);
      setIsLoading(false);
      ToastAndroid.show("Failed to create post", ToastAndroid.SHORT);
    }
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async ({ postId, token }) => {
      const formData = new FormData();
      formData.append('post_id', postId);

      postAddData?.media?.forEach((data) => {
        formData.append('media[]', {
          uri: data?.img?.uri,
          name: "uploadImg.jpg",
          type: "image/jpeg"
        });
      });

      return axios.post('/api/upload-post-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    onError: (error) => {
      console.error("Image upload error:", error);
      setIsLoading(false);
      ToastAndroid.show("Failed to upload images", ToastAndroid.SHORT);
    }
  });

  const handleSubmitAddPost = async () => {
    setIsLoading(true);
    
    try {
      // Step 1: Create the post
      const { postId, token } = await createPostMutation.mutateAsync();
      
      // Step 2: Upload images if they exist
      if (postAddData?.media?.length > 0) {
        await uploadImagesMutation.mutateAsync({ postId, token });
      }

      // Step 3: Invalidate queries and navigate
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({queryKey:['userPostsImages']})
      ]);
      
      ToastAndroid.show("Post created successfully", ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error("Error in post creation flow:", error);
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
            
            <TouchableOpacity onPress={()=> handleSubmitAddPost()} style={{marginLeft:20,flexDirection:"row",padding:3,alignItems:"center",justifyContent:"center",borderRadius:20,height:hp(4),width:wp(18),backgroundColor:COLORS.primary}}>
               {isLoading?<ActivityIndicator color={"white"}/>:  <Text style={{fontSize:TEXT_SIZE.small,color:"white",textAlign:"center"}}>Post</Text>}
              </TouchableOpacity>
            
            
            </View>

              

              </View>
          
}

export default PostAddHeader