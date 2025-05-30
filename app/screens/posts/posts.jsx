import React,{useState} from 'react'
import {View,Text,TouchableOpacity,Image,Dimensions,FlatList,KeyboardAvoidingView,Platform, ToastAndroid} from 'react-native'
import {useRoute} from '@react-navigation/native'
import { COLORS, FAMILLY, TEXT_SIZE } from "../../../utils/constants";
import { PostScreenSendComment,HomeFeedBell,PostScreenImagePicker,PostScreenBigComment,PostScreenBookMark, HomeFeedComment,PostScreenDots, HomeFeedGradient, HomeFeedHeart, HomeFeedSearch,HomeFeedShare,HomeFeedSmallArrowRight,HomeFeedThreeDots,LogoSmall, PostScreenMiniHeart } from "../../components/vectors.js";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
   } from "react-native-responsive-screen";
   import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../app/components/text';
   import CustomTextInput from "../../../app/components/textInput";
   import { ScrollView } from "react-native-gesture-handler";
import MessageSender from '../../../app/components/messageSender.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

   const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')


const PostScreen = ({navigation}) => {
 let {item} = useRoute().params
 const [comment,setComment]  = useState("")
 const [showComment,setShowComment] = useState(false)
 const [data,setData]= useState([
     {
          key:"post122",
          img:require("../../../assets/images/test_match1.jpg"),
          comment:"Lorem ipsum dolor sit amet consectetur. Commodo sapien metus et a vitae a nec. Enim blandit mauris habitasse mattis justo. Tellus lorem massa auctor.",
          name:"Maggy McLeen",
          time:"23h ago",
  
     },
     {
          key:"post102",
          img:require("../../../assets/images/test_match1.jpg"),
          comment:"Lorem ipsum dolor sit amet consectetur. Commodo sapien metus et a vitae a nec. Enim blandit mauris habitasse mattis justo.",
          name:"Maggy McLeen",
          time:"23h ago",
          replies:[
{               key:"post102rep2",
               img:require("../../../assets/images/test_match1.jpg"),
               comment:"Lorem ipsum dolor sit amet consectetur. Commodo sapien metus et a vitae a nec. Enim blandit mauris habitasse mattis justo.",
               name:"Maggy McLeen",
               time:"23h ago",}
          ]
  
     },
 
 ])


 const [isLike,setIslike] = useState(false)


const handleBookMark = async(postId) => {
     try {
    
     let token = await AsyncStorage.getItem("user_token")
   

     if(token)  {
           console.log(" beofre",token)
      await axios.post(`/api/save-post`,{postId},{
          headers:{
               "Authorization":`Bearer ${token}`,
          }
           
     }).then((res) => {
          console.log(postId,"op---soOD,",token)
        console.log(res.data,"repsonse data save post")

     if(res.data.status === 200) {
          ToastAndroid.show("Post saved sucessfully",1000)
     }
     }).catch((err) => {
          console.log(err,"error in catch")
     })

  
     }

     } catch(err) {
          console.log(err,"the error",token)
     }
}

 const RenderData = ({item}) => {
    
     return <View style={{borderBottomWidth:2,borderColor:COLORS.light,paddingVertical:10,backgroundColor:"white"}}>
          <View style={{flexDirection:"row",width:"80%"}}>
              <View style={{overflow:"hidden",height:50,width:50,borderRadius:50,marginRight:10}}>
               <Image source={item.img} style={{height:"100%",width:"100%"}}/>
               </View>
               

               <View>
               <View style={{alignItems:"center",flexDirection:"row",justifyContent:"space-between"}}>

               <View style={{alignItems:"center",flexDirection:"row"}}>
               <CustomSemiBoldPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.primary-2} color={"black"}   value={`${item.name}`}/>
               <View style={{backgroundColor:"white",height:25,alignItems:"center",justifyContent:"center"}}> 
               <View style={{height:5,marginBottom:2,width:5,backgroundColor:"black",borderRadius:50,borderColor:"black",borderWidth:0,marginRight:5}}></View>
               </View>
               <CustomRegularPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.small} color={"#A0A7AE"}   value={`${item.time}`}/>
               
               </View>


               <View style={{ }}>
                    <PostScreenDots/>
               </View>

               </View>
               <CustomRegularPoppingText style={{}} fontSize={TEXT_SIZE.small} color={null}   value={item.comment}/>

               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row"}}>
                    <TouchableOpacity>
                    <CustomRegularPoppingText style={{marginRight:10}} fontSize={TEXT_SIZE.small -1 } color={null}   value={'Reply'}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>setIslike(!isLike)}>
                    <CustomRegularPoppingText style={{}} fontSize={TEXT_SIZE.small -1 } color={isLike?"#FF5656":null}   value={'Like'}/>
                    </TouchableOpacity>

                    </View>
                    
                    <View style={{flexDirection:"row"}}>
                         <TouchableOpacity>
                         <PostScreenMiniHeart color={isLike==true?"#FF5656":"none"}/>
                         </TouchableOpacity>
                         <CustomRegularPoppingText style={{marginLeft:5}} fontSize={TEXT_SIZE.small -1 } color={null}   value={23}/>
                    </View>
               </View>

               </View>



          </View>


          <View style={{flexDirection:"row",width:"80%"}}>
                    <FlatList
                    data={item.replies}
                    renderItem={({item})=> {
                         return <View style={{flexDirection:"row",marginTop:10,width:"80%",marginLeft:20}}>
                                            <View style={{overflow:"hidden",height:50,width:50,borderRadius:50,marginRight:10}}>
               <Image source={item.img} style={{height:"100%",width:"100%"}}/>
               </View>
               

               <View>
               <View style={{alignItems:"center",flexDirection:"row",justifyContent:"flex-start"}}>
               <CustomSemiBoldPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.primary-2} color={"black"}   value={`${item.name}`}/>
          <View style={{backgroundColor:"white",height:25,alignItems:"center",justifyContent:"center"}}> 
               <View style={{height:5,marginBottom:2,width:5,backgroundColor:"black",borderRadius:50,borderColor:"black",borderWidth:0,marginRight:5}}></View>
          </View>
          <CustomRegularPoppingText style={{marginRight:5}} fontSize={TEXT_SIZE.small} color={"#A0A7AE"}   value={`${item.time}`}/>
               
               </View>
               <CustomRegularPoppingText style={{}} fontSize={TEXT_SIZE.small} color={null}   value={item.comment}/>

               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row"}}>
 

                    <TouchableOpacity onPress={()=>setIslike(!isLike)}>
                    <CustomRegularPoppingText style={{}} fontSize={TEXT_SIZE.small -1 } color={isLike?"#FF5656":null}   value={'Like'}/>
                    </TouchableOpacity>

                    </View>
                    
                    <View style={{flexDirection:"row"}}>
                         <TouchableOpacity>
                         <PostScreenMiniHeart color={isLike==true?"#FF5656":"none"}/>
                         </TouchableOpacity>
                         <CustomRegularPoppingText style={{marginLeft:5}} fontSize={TEXT_SIZE.small -1 } color={null}   value={23}/>
                    </View>
               </View>

               </View>
                         </View>
                    } }
                    keyExtractor={item => item?.key}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    />
               </View>
  
         
     </View>
 }

     return (
         
 
<View style={{backgroundColor:"white",flex:1}}>

                
<View style={{flexDirection:"column",paddingVertical:10,borderBottomWidth:2,borderTopWidth:2,borderColor:COLORS.light}}>
     <View style={{paddingHorizontal:20}}>
     <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>
     <View style={{flex:2,flexDirection:"row"}}>
     <TouchableOpacity style={{borderRadius:50,height:50,width:50,overflow:"hidden",alignItems:"center"}}><Image source={item.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/></TouchableOpacity>
     <View style={{flexDirection:"column",justifyContent:"center",marginLeft:10}}>
     <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.primary,fontFamily:FAMILLY.semibold}}>{item.name}</Text>
     <Text style={{color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>{item.time}</Text>
     </View>
     </View>

     <TouchableOpacity style={{alignItems:"center",justifyContent:"center"}}>
           <PostScreenDots/>
          </TouchableOpacity>
     </View> 

     <View style={{marginVertical:10}}>
          <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.secondary,fontFamily:FAMILLY.light}}>
          Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae.
          </Text>
     </View> 


     </View>



     <TouchableOpacity style={{height:200,margin:0,padding:0,width:"100%"}}>
          {/* <Image source={item.postImg} resizeMode="cover" style={{width:"100%",height:"100%"}}/> */}
          <Image source={require("../../../assets/images/post_1.jpg")} resizeMode="cover" style={{width:"100%",height:"100%"}}/>
     </TouchableOpacity> 

     <View style={{paddingHorizontal:20,height:30,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}} >

          <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
          <TouchableOpacity><HomeFeedHeart/></TouchableOpacity>
          <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}>0</Text>
          </View>

          <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
          <TouchableOpacity onPress={() => setShowComment(!showComment)}><HomeFeedComment/></TouchableOpacity>
          <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}>0</Text>
          </View>

          <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
               <TouchableOpacity><HomeFeedShare/></TouchableOpacity>
               <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}>825</Text>
          </View>

          </View>

          <View>
               <TouchableOpacity onPress={() => handleBookMark(1)}><PostScreenBookMark/></TouchableOpacity>
          </View>

     </View>

</View>

<View style={{height:SCREEN_HEIGHT*0.35,borderBottomWidth:2,borderColor:COLORS.light,alignItems:"center",justifyContent:"center",flexDirection:"column"}}>

{ showComment ? <View style={{paddingHorizontal:10}}>
<CustomRegularPoppingText style={{textAlign:"left",marginTop:10,alignSelf:"flex-start"}} fontSize={TEXT_SIZE.primary+1} color={null}  value={'Comments'}/>
<FlatList
data={data}
renderItem={RenderData}
showsVerticalScrollIndicator={false}
showsHorizontalScrollIndicator={false}
initialNumToRender={10}

/>
</View> : <View style={{alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
<PostScreenBigComment/>
<CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.small} value="There is no comment yet."/>
</View> }
</View>


<MessageSender placeHolder={"Add a comment"} action={() => null} state={comment} setState={setComment}/>
 
</View>


 


 
 

 

 
     )

}

export default PostScreen