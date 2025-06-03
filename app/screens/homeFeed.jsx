import React, { useCallback, useRef, useState,useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler";
import {View,Text,TouchableOpacity,Image, FlatList, ActivityIndicator} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HomeFeedBell, HomeFeedComment, HomeFeedGradient, HomeFeedHeart, HomeFeedSearch,HomeFeedShare,HomeFeedSmallArrowRight,HomeFeedThreeDots,LogoSmall, PostAddIcon } from "../components/vectors.js";
import { COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from "../../utils/constants.js";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import {useInfiniteQuery} from "@tanstack/react-query"
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import CustomPostLoader from "../components/customPostLoader.jsx";
import CustomMatchLoader from "../components/customMatchLoader.jsx";

dayjs.extend(relativeTime)

export default function HomeFeed({navigation}) {
     const [newMatches,setNewMatches] = useState([
          {
               key:"match1",
               img:require("../../assets/images/test_img1.jpg"),
               name:"Emi",
               age:27,
               location:"Chicago - 7km"
          } ,
          {
               key:"match2",
               img:require("../../assets/images/test_img2.jpg"),
               name:"Emi",
               age:27,
               location:"Chicago - 7km"
          },
          {
               key:"match3",
               img:require("../../assets/images/test_img3.jpg"),
               name:"Emi",
               age:27,
               location:"Chicago - 7km"
          } ,
          {
               key:"match4",
               img:require("../../assets/images/test_img4.jpg"),
               name:"Emi",
               age:27,
               location:"Chicago - 7km"
          },
          {
               key:"match5",
               img:require("../../assets/images/test_img5.jpg"),
               name:"Emi",
               age:327,
               location:"Chicago - 7km"
          }
     ])


          const [posts,setPosts] = useState([
          {
               key:"post1",
               img:require("../../assets/images/test_person1.png"),
               postImg:require("../../assets/images/blog_test.jpg"),
               name:"Emanuel Sama",
               time:"2h ago",
               pupil:"SD Academy"
          },
          {
               key:"post2",
               img:require("../../assets/images/test_person1.png"),
               postImg:require("../../assets/images/blog_test1.jpg"),

               name:"Emanuel Sama",
               time:"2h ago",
               pupil:"SD Academy"
          }
     ])



     const isSearching = useRef(false);
      const getAllPost = async({pageParam = 0}) => {
        try {
            isSearching.current = true;
            let url = '/api/get-all-posts';
            let token = await AsyncStorage.getItem("user_token");
            
            if(token) {
                const response = await axios.post(
                    url,
                    {offset: pageParam, limit: POST_LIMIT},
                    {headers: {"Authorization": `Bearer ${token}`}}
                );

                isSearching.current = false;
                return {
                    posts: response?.data?.posts,
                    nextOffset: response?.data?.next_offset,
                };
            }
        } catch(err) {
            console.log(err.message, "in getAllPost",Object.keys(err),err?.request);
            isSearching.current = false;
            throw err; // Important for React Query error handling
        }
    };

    const { 
        data, 
        fetchNextPage, 
        hasNextPage,
        isFetchingNextPage,
        isFetching 
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: getAllPost,
        getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
        initialPageParam: 0,
    });

    // FLATTEN ALL PAGES INTO SINGLE ARRAY
    const allPosts = data?.pages.flatMap(page => page?.posts) ?? [];

    const loadMoreItem = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }  
    };

    const renderLoader = () => {
        return isFetchingNextPage ? (
            <ActivityIndicator size="large" color={COLORS.blue} />
        ) : null;
    };



 
     




     const renderMatches = ({item,index}) => {
        
          if(isFetching){
               return <CustomMatchLoader/>
          }

               


               return (
                    <TouchableOpacity style={{flex:1,position:"relative",alignItems:"center",justifyContent:"center",marginRight:10,borderRadius:20,width:130,overflow:"hidden",marginVertical:10}} key={item.key}>
                          
                            <LinearGradient colors={["rgba(215, 168, 152, 0)","rgba(215, 168, 152, 1)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:50,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:-5,width:"100%"}} >
                            <View style={{flexDirection:"column",marginLeft:10}}>
                            <View style={{ height:19,flexDirection:"row",alignItems:"center"}}>
                            <Text style={{fontSize:TEXT_SIZE.primary,fontFamily:FAMILLY.semibold,color:"white"}}>{item.name}</Text>
                            <Text style={{fontSize:TEXT_SIZE.primary -3,margin:0,padding:0,fontFamily:FAMILLY.light,color:"white",marginLeft:10,marginTop:3,textAlign:"center",textAlignVertical:"center"}}>{item.age}ans</Text>
                            </View>
                             <View style={{}}>
                             <Text style={{fontSize:TEXT_SIZE.small-2,fontFamily:FAMILLY.light,color:"white"}}>{item.location}</Text>
                             </View>
                            </View>         
                            </LinearGradient>
 

                  
                      
                         <Image source={item?.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/>
                    </TouchableOpacity>
               )
          
     }

     const renderPosts = ({item,index}) => {

          if(isFetching){
           return <CustomPostLoader/>
          }
           

           
          return (

               <View key={item?.key} style={{flex:1,marginVertical:10,marginRight:20,width:wp(80),flexDirection:"column"}}>
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>
                    <View style={{flex:2,flexDirection:"row"}}>
                    <TouchableOpacity style={{borderRadius:50,height:50,width:50,overflow:"hidden",alignItems:"center"}}><Image source={item?.img || require("../../assets/images/test_person1.png")} resizeMode="cover" style={{height:"100%",width:"100%"}}/></TouchableOpacity>
                    <View style={{flexDirection:"column",justifyContent:"center",marginLeft:10}}>
                    <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.secondary-2,fontFamily:FAMILLY.semibold}}>{item?.user?.firstname || "Johan mark"}</Text>
                    <Text style={{color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>{dayjs(item?.created_at).fromNow() || "2h ago"}</Text>
                    </View>
                    </View>

                    <View style={{backgroundColor:COLORS.primary,height:25,width:80,borderRadius:20,alignItems:"center",justifyContent:"center"}}><Text style={{color:"white",fontSize:TEXT_SIZE.secondary-2}}>SD Academy</Text></View>
                    </View> 
                    <View style={{marginVertical:10}}>
                         <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>
                         {item?.text || "Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae."}
                         </Text>
                    </View> 

                    <TouchableOpacity onPress={()=> navigation.navigate("Post",{item})} style={{height:200,margin:0,padding:0,overflow:"hidden",borderRadius:20}}>
                         <Image source={ item?.media?.length > 0 ? {uri:`https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}`}   : require("../../assets/images/blog_test.jpg")  } resizeMode="cover" style={{width:"100%",height:"100%"}}/>
                    </TouchableOpacity>

                    {/* <FlatList
                    data={item.media || [{url:null}]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={true}
                    renderItem={(subitem)=> {
                         return <TouchableOpacity onPress={()=> navigation.navigate("Post",{item:{...subitem,...item}})} style={{height:200,margin:0,padding:0,overflow:"hidden",borderRadius:20}}>
                         <Image source={subitem?.url ? {uri:`https://sdlove-api.altechs.africa/storage/app/private/public/post_images/${subitem?.url}`} : require("../../assets/images/blog_test.jpg")} resizeMode="cover" style={{width:"100%",height:"100%"}}/>
                    </TouchableOpacity> 
                    }}
                    /> */}
                    <View style={{height:30,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>

                         <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}} >

                         <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                         <TouchableOpacity><HomeFeedHeart stroke={"#2E2E2E"} fill={"white"}/></TouchableOpacity>
                         <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}>{item?.likes_count || 0}</Text>
                         </View>

                         <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                         <TouchableOpacity onPress={() => navigation.navigate("Post",{item})}><HomeFeedComment stroke={"#2E2E2E"} fill={"white"}/></TouchableOpacity>
                         <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}>0</Text>
                         </View>

                         <View style={{marginRight:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                              <TouchableOpacity><HomeFeedShare fill={"#2E2E2E"}/></TouchableOpacity>
                              <Text style={{fontFamily:FAMILLY.light,marginLeft:5}}>825</Text>
                         </View>

                         </View>

                         <View>
                              <TouchableOpacity><HomeFeedThreeDots fill={"#5E5E5E"}/></TouchableOpacity>
                         </View>

                    </View>
               </View>
          )
     }


     return (
      
                                       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:"white",position:"relative"}}>
 
               <View style={{ flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-start",paddingLeft:20}}>
                     <LogoSmall/>
                     <Text style={{marginLeft:15,fontSize:TEXT_SIZE.title,color:COLORS.primary,fontWeight:"bold",fontFamily:FAMILLY.semibold,marginVertical:10}}>SDLOVE</Text>

                    </View>

                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-end",paddingRight:20}}>
                         <TouchableOpacity>
                         <HomeFeedSearch/>
                         </TouchableOpacity>
                         <View style={{marginLeft:15,}}><HomeFeedBell/></View>
                         
                    </View>
               </View>

               <View style={{flexDirection:"row",height:40,alignContent:"center",alignItems:"center",justifyContent:"space-between",marginVertical:0,paddingHorizontal:20}}>
               <View ><Text style={{fontSize:TEXT_SIZE.title,color:COLORS.gray,fontWeight:"bold",fontFamily:FAMILLY.semibold}}>New Matches</Text></View>
               <TouchableOpacity style={{ flexDirection:"row",alignItems:"center",justifyContent:"center" }}>
  
                    <Text style={{ fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.regular,color:COLORS.primary,marginRight:15,textAlignVertical:"center"}}>see all</Text>
                    <View style={{marginTop:1}}><HomeFeedSmallArrowRight/></View>
               </TouchableOpacity>
               </View>


               <View style={{paddingLeft:20}}>
               <FlatList
               data={newMatches}
               renderItem={renderMatches}
               keyExtractor={(item)=> item?.key || item?.id}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               style={{height:180}}
               />
               </View>


               <View style={{paddingLeft:20}}>
               <FlatList
               data={allPosts.length == 0 ? posts : allPosts}
               renderItem={renderPosts}
               keyExtractor={(item)=> item?.key || item?.id}
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               onEndReached={loadMoreItem}
               onEndReachedThreshold={0.5}
               ListFooterComponent={renderLoader}
               ListFooterComponentStyle={{alignItems:"center",justifyContent:"center",paddingBottom:50}}
              
               />
               </View>


               <View style={{height:100}}>

               </View>
               <TouchableOpacity onPress={()=>navigation.navigate("PostAdd")} style={{height:50,width:50,zIndex:99,bottom:20,right:10,position:"absolute",borderRadius:100,backgroundColor:"#2E2E2E",alignItems:"center",justifyContent:"center"}}>
                    <PostAddIcon/>
               </TouchableOpacity>
          
                
          </ScrollView>
          
      
     )
}