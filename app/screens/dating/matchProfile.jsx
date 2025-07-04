import { CustomMeduimPoppingText, CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../app/components/text";
import { MatchProfileArrowBack, MatchProfileBirthDay, MatchProfileEducation, MatchProfileFaithChurch, MatchProfileFaithIcon1, MatchProfileFaithOccupation, MatchProfileHome, MatchProfileLang, MatchProfilePlus, MatchProfileSexIcon, MatchProfileSmallHeart, MatchProfleSmallFace } from "../../components/vectors";
import { COLORS, TEXT_SIZE,FAMILLY, BaseImageUrl, POST_LIMIT, BasePostImageUrl } from "../../../utils/constants";
import React, { useEffect, useRef, useState } from "react"
import {View,Text,Image,TouchableOpacity, Dimensions,ScrollView,FlatList} from "react-native"
 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomPostLoader from "../../components/customPostLoader";
import relativeTime from "dayjs/plugin/relativeTime"

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
dayjs.extend(relativeTime)

 export default function MatchProfile({navigation}) {
     const {item} = useRoute().params
     const [interest,setInterest] = useState(["Travel","Music","Fishing","Gym","Bible","Dance"])
     useEffect(()=> {
          let data = JSON.parse(item?.match_user?.user_infos?.qP16)
          setInterest(data)
           
          
          
     },[])

 

              
                const getMatchPost = async({pageParam = 1}) => {
                  try {

                     
                     
                      let url = '/api/show-match-posts';
                      let token = await AsyncStorage.getItem("user_token");
                      let matchId = item?.match_id
                      
                      if(token) {
                          const response = await axios.post(
                              url,
                              {page:pageParam,matchId},
                              {headers: {"Authorization": `Bearer ${token}`}}
                          );
          
                           
                         
                         console.log(response.data,":::response-data")
                          return response.data
                      }
                  } catch(err) {
                      console.log(err.message, "in getAllMatches",Object.keys(err),err?.request);
                     
                      throw err; // Important for React Query error handling
                  }
              };


              const getMatchImages = async({pageParam = 1}) => {
                  try {

                     
                     
                      let url = '/api/show-match-images';
                      let token = await AsyncStorage.getItem("user_token");
                      let matchId = item?.match_id
                      
                      if(token) {
                          const response = await axios.post(
                              url,
                              {page:pageParam,matchId},
                              {headers: {"Authorization": `Bearer ${token}`}}
                          );
          
                           
                         
                         
                          return response.data
                      }
                  } catch(err) {
                      console.log(err.message, "in getAllMatches images",Object.keys(err),err?.request);
                     
                      throw err; // Important for React Query error handling
                  }
              };
          
              const { 
                  data:postData, 
                  fetchNextPage, 
                  hasNextPage,
                  isFetchingNextPage,
                  isFetching 
              } = useInfiniteQuery({
                  queryKey: ["match_posts"],
                  queryFn: getMatchPost,
                  getNextPageParam: (lastPage) => {
          if (lastPage.hasMore) {
             return lastPage?.next_page;
          }
         return undefined;
                  },
                   
              });


              const { 
                  data:matchImages, 
                  fetchNextPage:fetchNextPageMatch, 
                  hasNextPage:hasNextPageMatch,
                  isFetchingNextPage:isFetchingNextPageMatch,
                  isFetching:isFetchingMatch
              } = useInfiniteQuery({
                  queryKey: ["match_images"],
                  queryFn: getMatchImages,
                  getNextPageParam: (lastPage) => {
          if (lastPage.hasMore) {
             return lastPage?.next_page;
          }
         return undefined;
                  },
                   
              });
          
              // FLATTEN ALL PAGES INTO SINGLE ARRAY
              const allMatchPost = postData?.pages.flatMap(page => {
                 return page?.match_posts
              }) ?? [];7

               const allMatchImages = matchImages?.pages.flatMap(page => {
                 return page?.match_images
              }) ?? [];
          
              const loadMoreMatchPost= () => {
                  if (hasNextPage && !isFetchingNextPage) {
                      fetchNextPage();
                  }  
              };

          const loadMoreMatchImages= () => {
                  if (hasNextPageMatch && !isFetchingNextPageMatch) {
                      fetchNextPageMatch();
                  }  
              };
          
              const renderLoaderPost = () => {
                  return isFetching ? (
                      <ActivityIndicator size="large" color={COLORS.blue} />
                  ) : null;
              };

            const renderLoaderMatch= () => {
                  return isFetchingMatch ? (
                      <ActivityIndicator size="large" color={COLORS.blue} />
                  ) : null;
              };

     const [activeSubCat ,setActiveSubCat] = useState('About')
 

          const [posts,setPosts] = useState([
               {
                    key:"post1",
                    img:require("../../../assets/images/test_match1.jpg"),
                    postImg:require("../../../assets/images/match_pro1.jpg"),
                    name:"Emanuel Sama",
                    time:"2h ago",
                    pupil:"SD Academy"
               }])



          const renderPosts = ({item,index}) => {
                
            if (isFetching) {
                    return <CustomPostLoader />
               }

                
               return (
                    <View   style={{flex:1,marginVertical:10,marginRight:20,width:wp(90),flexDirection:"column"}}>
                         <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>
                         <View style={{flex:2,flexDirection:"row"}}>
                         <TouchableOpacity style={{borderRadius:50,height:50,width:50,overflow:"hidden",alignItems:"center"}}><Image source={item?.user?.user_image? {uri:`${BaseImageUrl}/${item?.user?.user_image}`} : require("../../../assets/images/test_match1.jpg")} resizeMode="cover" style={{height:"100%",width:"100%"}}/></TouchableOpacity>
                         <View style={{flexDirection:"column",justifyContent:"center",marginLeft:10}}>
                                   <Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.secondary - 2, fontFamily: FAMILLY.semibold }}>{item?.user?.firstname || "Johan mark"}</Text>
                                   <Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(item?.created_at).fromNow() || "2h ago"}</Text>
                         </View>
                         </View>
     
                         <View style={{backgroundColor:COLORS.primary,height:25,width:80,borderRadius:20,alignItems:"center",justifyContent:"center"}}><Text style={{color:"white",fontSize:TEXT_SIZE.secondary-2}}>SD Academy</Text></View>
                         </View> 
                         <View style={{marginVertical:10}}>
                         <Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>
                              {item?.text || "Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae."}
                         </Text>
                         </View> 
                    
                         
                         <TouchableOpacity onPress={() => navigation.navigate("Post", { item })} style={{ height: 200, margin: 0, padding: 0, overflow: "hidden", borderRadius: 20 }}>
                              <Image source={item?.media?.length > 0 ? { uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}` } : require("../../../assets/images/blog_test.jpg")} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
                         </TouchableOpacity>
                    </View>
               )
          }

        
     return (<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={{backgroundColor:"white",padding:20,flex:1}}>
          
          
          <View style={{height:SCREEN_HEIGHT*0.5,borderRadius:20,alignItems:"center",position:"relative",overflow:"hidden"}}>
          <TouchableOpacity onPress={()=> navigation.goBack()} style={{top:10,position:"absolute",left:15,zIndex:10}}>
              <MatchProfileArrowBack/>
              </TouchableOpacity>
              <Image style={{height:"100%",width:"100%"}} resizeMode="cover" source={{uri:`${BaseImageUrl}/${item?.match_user?.user_image}`} || require('../../../assets/images/test_match1.jpg')}/>
          </View>
          <CustomSemiBoldPoppingText value={`${item?.match_user?.firstname} ${item?.match_user?.lastname}` || "Magy McLeen"} color="black" fontSize={TEXT_SIZE.title+3} style={{textAlign:"left",marginTop:20}}/>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
               <View>
               <CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.secondary} value="Revelation Church, Los Angeles"/>
               <CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.small} value="Choir Leader"/>
               </View>

               <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"center",alignSelf:"flex-start"}}>
                    <View style={{marginRight:5}}>
                    <MatchProfilePlus/>
                    </View>
                    <CustomMeduimPoppingText style={{textTransform:"capitalize",lineHeight:18,marginTop:1}} color={COLORS.primary} fontSize={TEXT_SIZE.secondary} value="FOLLOW"/>
               </TouchableOpacity>
          </View>


          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:20}}>

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
               {['About',"Posts","Photos"].map((cat) => (
               <TouchableOpacity key={cat} onPress={() => setActiveSubCat(cat)} style={{marginRight:10,backgroundColor:activeSubCat ==cat ?COLORS.primary:"#F5F6FC",paddingHorizontal:10,borderRadius:20}}>
                    <CustomRegularPoppingText style={{textTransform:"capitalize"}} fontSize={TEXT_SIZE.small} value={cat} color={activeSubCat ==cat? "white":"#808A94"}/>
               </TouchableOpacity>


               ))}
 
          </View>

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
               <TouchableOpacity style={{marginRight:10,alignItems:"center",justifyContent:"center",backgroundColor:COLORS.red,height:25,width:25,borderRadius:20}}><MatchProfleSmallFace/></TouchableOpacity>
               <TouchableOpacity style={{alignItems:"center",justifyContent:"center",backgroundColor:COLORS.primary,height:25,width:25,borderRadius:20}}><MatchProfileSmallHeart/></TouchableOpacity>
          </View>

          </View>

          {activeSubCat == "About" && (
     <View style={{marginTop:20}}>
     <CustomRegularPoppingText fontSize={TEXT_SIZE.small} value="Bio" style={{}} color={null}/>
     <CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt dolore aperiam maiores quisquam quod. Quod accusantium architecto non molestias odit."/>
     
     <View style={{marginTop:30}}>
          <CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.primary} value="Interests"/>
          <View style={{flexDirection:"row",flexWrap:"wrap"}}>
          { interest.map((d) => (
               <View key={d} style={{marginRight:10,marginBottom:5,paddingHorizontal:6,borderRadius:10,backgroundColor:COLORS.light}}>
                 <CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d}/>
               </View>
          ))}
          </View>

         
     </View>

     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Basic info"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileSexIcon/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Gender"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value={item?.match_user?.user_infos?.qP1 || "Not specified"}/>
           </View>
     </View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileBirthDay/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Birthday"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value={dayjs(item?.match_user?.user_infos?.qP2).format("DD MMMM YYYY") || "Not specified"}/>
           </View>
     </View>


     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileHome/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Home"/>
          <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value={`${item?.match_user?.country} - ${item?.match_user?.city} - ${item?.match_user?.address}` || "Not specified"}/>
           </View>
     </View>


     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileLang/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Language"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="English, French"/>
           </View>
     </View>


     </View>


     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Faith"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileFaithIcon1/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Gave my life to God"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value={item?.match_user?.user_infos?.qS2 || "Not specified"}/>
           </View>
     </View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileFaithChurch/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Church"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Revelation Church, Los Angeles"/>
           </View>
     </View>


     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileFaithOccupation/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Occupation"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Choir Leader"/>
           </View>
     </View>


     </View>


     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Education"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileEducation/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value={item?.match_user?.user_infos?.qP11 || "Not specified"}/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Lorem Ipsum university"/>
           </View>
     </View>


     

 


 


     </View>


     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Profession"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileEducation/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Resource Manager at"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Lorem Ipsum company"/>
           </View>
     </View>
     </View>


     <View style={{height:30}}></View>
     </View>
     )}


     {activeSubCat == "Posts" && (
      <FlatList
      data={allMatchPost.length>0 ?allMatchPost: posts}
      renderItem={renderPosts}
      keyExtractor={(item)=> item?.key || item?.id}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{marginBottom:50}}

	 onEndReached={loadMoreMatchPost}
	 onEndReachedThreshold={0.5}
	 ListFooterComponent={renderLoaderPost}
	 ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center"}}
      
      />
     )}

     {activeSubCat == "Photos" && (
          <View style={{marginTop:20,flexDirection:"row",flexWrap:"wrap"}}>
               <FlatList data={allMatchImages.length>0? allMatchImages: [{img:require("../../../assets/images/match_pro1.jpg")},{img:require("../../../assets/images/match_pro2.jpg")},{img:require("../../../assets/images/match_pro3.jpg")}]}
                keyExtractor={(item) => item?.content || item?.img}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal={true}

                onEndReached={loadMoreMatchImages}
	           onEndReachedThreshold={0.5}
	           ListFooterComponent={renderLoaderMatch}
	           ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center"}}

                renderItem={({item}) => {
                     console.log(item,"itemoooo---")
                    return       <View style={{height:100,width:100,marginRight:10,marginBottom:5,borderRadius:5,overflow:"hidden"}}>
                         <Image source={item?.content ? {uri:`${BasePostImageUrl}/${item?.content}`} : item?.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/>
                    </View>
                }}
               />
          </View>
     )}

     
    <View style={{height:20}}></View>
     </ScrollView>)
}