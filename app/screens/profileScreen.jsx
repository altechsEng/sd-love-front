import { SafeAreaView } from "react-native-safe-area-context"
import { View, TouchableOpacity, Image, Dimensions, FlatList, Text, Modal, StyleSheet, Pressable, ActivityIndicator, ToastAndroid } from "react-native"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../components/text"

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import { PostAddIcon, MatchProfileArrowBack, MatchProfileBirthDay, MatchProfileEducation, MatchProfileFaithChurch, MatchProfileFaithIcon1, MatchProfileFaithOccupation, MatchProfileHome, MatchProfileLang, MatchProfilePlus, MatchProfileSexIcon, MatchProfileSmallHeart, MatchProfleSmallFace, PostScreenBookMark, ProfileScreenBookMark, ProfileScreenAddPost, PostScreenDots, ProfileScreenPostEdit, ProfileScreenPostDelete, ProfileScreenManageProfile, ProfileScreenAccountSecurity, ProfileScreenTheme, ProfileScreenGlobe, ProfileScreenPermissions, ProfileScreenQuestionMark, ProfileSCreenExclamation, ProfileScreenPrivacyPolicy, ProfileScreenLogOut, HomeFeedHeart } from "../components/vectors";
import { BaseImageUrl, COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from "../../utils/constants";
import { useGlobalVariable } from "../context/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import {  useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomPostLoader from "../components/customPostLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')


const ProfileScreen = ({ navigation }) => {

 
	const [modalVisible, setModalVisible] = useState(false)
	const queryClient = useQueryClient()

	const { isProfileMenuAcitve, loadData,activeSubCat, setActiveSubCat,userData } = useGlobalVariable()
	useEffect(()=>{
		loadData()
	})

	const [posts, setPosts] = useState([
		{
			key: "post1",
			img: require("../../assets/images/test_match1.jpg"),
			postImg: require("../../assets/images/match_pro1.jpg"),
			name: "Emanuel Sama",
			time: "2h ago",
			pupil: "SD Academy"
		}])

	const [savePosts, setSavePosts] = useState([
		{
			key: "postsave1-id",
			img: require("../../assets/images/test_match1.jpg"),
			postImg: require("../../assets/images/match_pro1.jpg"),
			name: "Emanuel Sama",
			time: "2h ago",
			pupil: "SD Academy"
		}, {
			key: "postsave2",
			img: require("../../assets/images/test_match1.jpg"),
			postImg: require("../../assets/images/match_pro1.jpg"),
			name: "Emanuel Sama",
			time: "2h ago",
			pupil: "SD Academy"
		}])

	const [activePostItem,setActivePostItem] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	// const handleDeletePost = async(post) => {

	// 	try {
	// 		setIsLoading(true)
	// 		let token = await AsyncStorage.getItem("user_token")
	// 		console.log(post,"active post")
	// 		let formData = new FormData()
	// 		formData.append("post_id",post?.id || 55)
	// 	     await axios.post("/api/delete-post",formData,{headers: {"Authorization": `Bearer ${token}`}}).
	// 		then(res => {
	// 			console.log(res.data,"response data")	
	// 		setIsLoading(false)

	// 		}).catch(err => {
	// 			console.log(err.request,"eror in cathc",err)
	// 		setIsLoading(false)

	// 		})

	// 	}catch(err) {
	// 		console.log(err,"erorr in handle delte post try catch")
	// 		setIsLoading(false)

	// 	}

	// }



const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const token = await AsyncStorage.getItem("user_token");
      const formData = new FormData();
      formData.append("post_id", postId);
      return axios.post("/api/delete-post", formData, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res=>{
		console.log(res.data,"Data----")
		 ToastAndroid.show("Post deleted",1000)
		
	 }).catch(err => {
		console.log(err?.request,"opo")
	 })
    },
 
    onSuccess: () => {
      setModalVisible(false);
	 queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    }
  });

const handleDeletePost = (post) => {
    deletePostMutation.mutate(post.id)
  };

//interest
const [interest,setInterest] = useState(["Travel","Music","Fishing","Gym","Bible","Dance"])
useEffect(()=> {
if(activeSubCat == "About") {
 let data = JSON.parse(userData?.user_infos?.qP16)
 setInterest(data)
	}
},[activeSubCat])


// Infinite query for user post images
const getAllPostsImages = async ({ pageParam = 1 }) => {
		try {
			 
			 
			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					'/api/get-posts-images',
					{ page: pageParam },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);
 
				 
				 
			  
				return response.data
			}
		} catch (err) {
			console.log(err.message, "in all user posts images", Object.keys(err), err?.request);
			 
			throw err; // Important for React Query error handling
		}
	};

  const {
    data:postImages,
    fetchNextPage:fetchNextPageImages,
    hasNextPage:hasNextPageImages,
    isFetchingNextPage:isFetchingNextPageImages,
    refetch:refetchImages,
    isFetching:isFetchingImages,
    isLoading: imagesLoading,
    error: imagesError,
    isRefetching:isRefetchingImages
  } = useInfiniteQuery({
    queryKey: ['userPostsImages'],
    queryFn: getAllPostsImages,
    getNextPageParam: (lastPage, allPages) => {
      // Adjust this based on your API response structure
      if (lastPage.hasMore) {
        return lastPage?.next_page;
      }
      return undefined;
    }
  });

  // Combine all pages into a single array
  const allPostsImages = postImages?.pages.flatMap(page => page.images) || [];
 
  const loadMoreImages = () => {
    if (hasNextPageImages && !isFetchingNextPageImages ) {
      fetchNextPageImages();
    }
  };


//infinite query for save posts

// Infinite query for user post images
const getAllUserSavePost = async ({ pageParam = 1 }) => {
		try {
			 
			 
			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					'/api/get-user-save-post',
					{ page: pageParam },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);
 
				 
				  
				return response.data
			}
		} catch (err) {
			console.log(err.message, "in all user posts images", Object.keys(err), err?.request);
			 
			throw err; // Important for React Query error handling
		}
	};

  const {
    data:userSavePost,
    fetchNextPage:fetchNextPageUserSavePost,
    hasNextPage:hasNextPageUserSavePost,
    isFetchingNextPage:isFetchingNextPageUserSavePost,
    refetch:refetchUserSavePost,
    isFetching:isFetchingUserSavePost,
    isLoading: userSavePostLoading,
    error: userSavePostError,
    isRefetching:isRefetchingUserSavePost
  } = useInfiniteQuery({
    queryKey: ['userSavePosts'],
    queryFn: getAllUserSavePost,
    getNextPageParam: (lastPage, allPages) => {
      // Adjust this based on your API response structure
      if (lastPage.hasMore) {
        return lastPage?.next_page;
      }
      return undefined;
    }
  });

  // Combine all pages into a single array
  const allUserSavePost = userSavePost?.pages.flatMap(page => page.savePosts) || [];
 
  const loadMoreUserSavePost = () => {
    if (hasNextPageUserSavePost && !isFetchingNextPageUserSavePost ) {
      fetchNextPageUserSavePost();
    }
  };


// Infinite query for posts
const getAllPosts = async ({ pageParam = 1 }) => {
		try {
			 
			 
			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					'/api/get-all-user-posts',
					{ page: pageParam },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);
 
				 
				 
			 
				return response.data
			}
		} catch (err) {
			console.log(err.message, "in all user posts", Object.keys(err), err?.request);
			 
			throw err; // Important for React Query error handling
		}
	};
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
    isLoading: postsLoading,
    error: postsError,
    isRefetching
  } = useInfiniteQuery({
    queryKey: ['userPosts'],
    queryFn: getAllPosts,
    getNextPageParam: (lastPage, allPages) => {
      // Adjust this based on your API response structure
      if (lastPage.hasMore) {
        return lastPage?.next_page;
      }
      return undefined;
    }
  });

  // Combine all pages into a single array
  const allPosts = data?.pages.flatMap(page => page.posts) || [];
 
  

  // Load more posts when reaching end of list
  const loadMorePosts = () => {
    if (hasNextPage && !isFetchingNextPage ) {
      fetchNextPage();
    }
  };

const renderLoader = () => {
		return isFetchingNextPage ? (
			<ActivityIndicator size="large" color={COLORS.blue} />
		) : null;
	};

 


	const renderPosts = ({ item }) => {

	  if (isFetching) {
		return <CustomPostLoader />
	 }

	 
 
	 
				return (<View  style={{ flex: 1, marginVertical: 10, marginRight: 20, width: wp(90), flexDirection: "column" }}>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
					<View style={{ flex: 2, flexDirection: "row" }}>
						<TouchableOpacity style={{ borderRadius: 50, height: 50, width: 50, overflow: "hidden", alignItems: "center" }}>
							<Image source={item?.user?.user_image? {uri:`${BaseImageUrl}/${item?.user?.user_image}`} :item?.img} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
							</TouchableOpacity>
						<View style={{ flexDirection: "column", justifyContent: "center", marginLeft: 10 }}>
							<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.secondary - 2, fontFamily: FAMILLY.semibold }}>{item?.user?.firstname ? `${item?.user?.firstname} ${item?.user?.lastname }`: item?.name}</Text>
							<Text style={{ lineHeight: 12, color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(new Date(item?.created_at)).fromNow()|| item?.time}</Text>
						</View>
					</View>

					<TouchableOpacity onPress={() => {
						setModalVisible(true)
						setActivePostItem(item)
					}} style={{ backgroundColor: "white", height: 25, width: 80, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
						<PostScreenDots />
					</TouchableOpacity>
				</View>
				<View style={{ marginVertical: 10 }}>
					<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>
						{item?.text ||"Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae."}
					</Text>
				</View>
				{/* <TouchableOpacity style={{ height: 200, margin: 0, padding: 0, overflow: "hidden", borderRadius: 20 }}>
					<Image source={item.postImg} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
				</TouchableOpacity> */}

				<TouchableOpacity onPress={() => navigation.navigate("Post", { item })} style={{ height: 200, margin: 0, padding: 0, overflow: "hidden", borderRadius: 20 }}>
				<Image source={item?.media?.length > 0 ?  { uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}` } : require("../../assets/images/blog_test.jpg")} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
				</TouchableOpacity>

			</View>
		)
	 


	}

	const renderSavePosts = ({ item }) => {

		if(isFetchingUserSavePost) {
			return <CustomPostLoader/>
		}

		   
		return (<View style={{ flex: 1, marginVertical: 10, marginRight: 20, width: wp(90), flexDirection: "column" }}>

				<View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
					<View style={{ flex: 2, flexDirection: "row" }}>
						<TouchableOpacity style={{ borderRadius: 50, height: 50, width: 50, overflow: "hidden", alignItems: "center" }}>
							<Image source={item?.user?.user_image ? {uri:`${BaseImageUrl}/${item?.user?.user_image}`} :  item?.img } resizeMode="cover" style={{ height: "100%", width: "100%" }} />
							</TouchableOpacity>
						<View style={{ flexDirection: "column", justifyContent: "center", marginLeft: 10 }}>
 	                              <Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.secondary - 2, fontFamily: FAMILLY.semibold }}>{item?.user?.firstname ? `${item?.user?.firstname} ${item?.user?.lastname }`: item?.name}</Text>
							<Text style={{ lineHeight: 12, color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(new Date(item?.created_at)).fromNow()|| item?.time}</Text>
						</View>
					</View>

					<TouchableOpacity onPress={() => {}} style={{ backgroundColor: "white", height: 25, width: 80, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
						{/* <PostScreenDots /> */}
					</TouchableOpacity>
				</View>
				<View style={{ marginVertical: 10 }}>
					<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>
						{item?.text ||"Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae."}
					</Text>
				</View>
				<TouchableOpacity onPress={() => navigation.navigate("Post", { item })}  style={{ height: 200, margin: 0, padding: 0, overflow: "hidden", borderRadius: 20 }}>
				<Image source={item?.media?.length > 0 ?  { uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}` } : require("../../assets/images/blog_test.jpg")} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
				</TouchableOpacity>

			</View>
		)
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 20, paddingTop: 10 }}>
			{activeSubCat != "account" &&
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						{['About', "Posts", "Photos"].map((cat) => (
							<TouchableOpacity key={cat} onPress={() => setActiveSubCat(cat)} style={{ marginRight: 10, backgroundColor: activeSubCat == cat ? COLORS.primary : "#F5F6FC", height: 30, width: 70, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
								<CustomRegularPoppingText style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.small} value={cat} color={activeSubCat == cat ? "white" : "#808A94"} />
							</TouchableOpacity>
						))}

						<TouchableOpacity onPress={() => setActiveSubCat("savePost")} style={{ height: 30, width: 30, borderRadius: 100, backgroundColor: activeSubCat == "savePost" ? COLORS.primary : "#F5F6FC", alignItems: "center", justifyContent: "center" }}>
							<ProfileScreenBookMark fill={activeSubCat === "savePost" ? "white" : "#808A94"} />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => navigation.navigate("PostAdd")} style={{ marginLeft: 10, height: 30, width: 30, borderRadius: 100, backgroundColor: "#2E2E2E", alignItems: "center", justifyContent: "center" }}>
							<ProfileScreenAddPost />
						</TouchableOpacity>
					</View>
				</View>
			}

			{activeSubCat == "About" && (
				<View style={{ marginTop: 20, marginBottom: 10 }}>
					<CustomSemiBoldPoppingText fontSize={TEXT_SIZE.primary} value="Bio" style={{}} color={null} />
					<CustomRegularPoppingText fontSize={TEXT_SIZE.medium} color={null} style={{}} value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt dolore aperiam maiores quisquam quod. Quod accusantium architecto non molestias odit." />

					<View style={{ marginTop: 20, marginBottom: 10 }}>
						<CustomSemiBoldPoppingText style={{}} color={null} fontSize={TEXT_SIZE.primary} value="Interests" />
						<View className={'mt-2'} style={{ flexDirection: "row", flexWrap: "wrap" }}>
							{interest.map((d) => (
								<View className={'py-2'} key={d} style={{ marginRight: 10, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: COLORS.light }}>
									<CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d} />
								</View>
							))}
						</View>
					</View>

					<CustomSemiBoldPoppingText style={{ marginTop: 15, marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Basic info" />

					<View>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileSexIcon /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Gender" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={userData?.user_infos?.qP1 || "Not specified"} />
							</View>
						</View>

						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileBirthDay /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Birthday" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={dayjs(userData?.user_infos?.qP2).format("DD MMMM YYYY") || "Not specified"} />
							</View>
						</View>


						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileHome /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Home" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary}  value={`${userData?.country} - ${userData?.city} - ${userData?.address}` || "Not specified"}/>
							</View>
						</View>


						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileLang /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Language" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value="English, French" />
							</View>
						</View>
					</View>

					<CustomSemiBoldPoppingText style={{ marginTop: 15, marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Faith" />

					<View>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileFaithIcon1 /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Gave my life to God" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary}  value={userData?.user_infos?.qS2 || "Not specified"} />
							</View>
						</View>

						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileFaithChurch /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Church" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value="Revelation Church, Los Angeles" />
							</View>
						</View>


						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileFaithOccupation /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Occupation" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value="Choir Leader" />
							</View>
						</View>
					</View>

					<CustomSemiBoldPoppingText style={{ marginTop: 15, marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Education" />

					<View>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileEducation /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Masters Degree" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value="Lorem Ipsum university" />
							</View>
						</View>
					</View>

					<CustomSemiBoldPoppingText style={{ marginTop: 15, marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Profession" />

					<View>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileEducation /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Resource Manager at" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value="Lorem Ipsum company" />
							</View>
						</View>
					</View>

					<View style={{ marginTop: 15, marginBottom: 10 }}>
						<CustomSemiBoldPoppingText style={{ marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Skills" />
						<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
							{["Dancing", "Acting", "Singing", "Writing"].map((d) => (
								<View key={d} style={{ marginRight: 10, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: COLORS.light }}>
									<CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d} />
								</View>
							))}
						</View>
					</View>

					<View style={{ height: 30 }}></View>
				</View>
			)}

			{activeSubCat == "Posts" && (
				<FlatList
				     refreshing={isRefetching}
					onRefresh={() =>queryClient.refetchQueries({queryKey:["userPosts"]})}
					data={allPosts.length>0?allPosts:posts}
					renderItem={renderPosts}
					keyExtractor={(item) => item?.key || item?.id}
					horizontal={true}
				 
					showsHorizontalScrollIndicator={false}
					ListFooterComponent={renderLoader}
					onEndReached={loadMorePosts}
					onEndReachedThreshold={0.3}
					ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center"}}

					 

				/>
			)}

			{activeSubCat == "Photos" && (
				<View style={{ marginTop: 20, flexDirection: "row", flexWrap: "wrap" }}>
					<FlatList data={ allPostsImages?.length>0?allPostsImages:[{ testimg: require("../../assets/images/match_pro1.jpg") }, { testimg: require("../../assets/images/match_pro2.jpg") }, { testimg: require("../../assets/images/match_pro3.jpg") }]}
						keyExtractor={(item) => item?.testimg || item?.id}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						horizontal={true}
						refreshing={isRefetchingImages}
					     onRefresh={() =>queryClient.refetchQueries({queryKey:["userPostsImages"]})}
					     
						ListFooterComponent={renderLoader}
					     onEndReached={loadMoreImages}
					     onEndReachedThreshold={0.3}
						ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center"}}


						renderItem={({ item }) => {
							 
							return ( <View style={{ height: 100, width: 100, marginRight: 5, marginBottom: 5, borderRadius: 5, overflow: "hidden" }}>
								<Image source={ item?.img ? {uri:`${item.img}`} : item?.testimg} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
							</View>
							)
						}}
					/>
				</View>
			)}

			{activeSubCat == "savePost" && (
				<View>
					<CustomSemiBoldPoppingText style={{ marginVertical: 20 }} color={"black"} fontSize={TEXT_SIZE.primary + 2} value={"Save post"} />
					<FlatList
						data={allUserSavePost.length>0?allUserSavePost:savePosts}
						renderItem={renderSavePosts}
						keyExtractor={(item,index) => item?.key || item?.id}
						horizontal={true}
						showsHorizontalScrollIndicator={false}

						refreshing={isRefetchingUserSavePost}
					     onRefresh={() =>queryClient.refetchQueries({queryKey:["userSavePosts"]})}
					     
						ListFooterComponent={renderLoader}
					     onEndReached={loadMoreUserSavePost}
					     onEndReachedThreshold={0.3}
						ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center"}}

					/>
				</View>
			)}

			{activeSubCat === "account" && (
				<View style={{ marginVertical: 10 }}>

					<View className={'gap-5'}>
						<TouchableOpacity onPress={() => navigation.navigate("EditProfileScreen")} style={{ flexDirection: "row", alignItems: "center" }}>
							<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
								<ProfileScreenManageProfile />
							</View>
							<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Manage profile info"} />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => navigation.navigate("AccountSecurityScreen")} style={{ flexDirection: "row", alignItems: "center" }}>
							<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
								<ProfileScreenAccountSecurity />
							</View>
							<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Account & Security"} />
						</TouchableOpacity>

						<View style={{ height: 2, backgroundColor: COLORS.light, width: "100%" }}></View>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileScreenTheme />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Theme"} />
							</View>

							<CustomRegularPoppingText style={{}} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"} />
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileScreenGlobe />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Language"} />
							</View>

							<CustomRegularPoppingText style={{}} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"} />
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileScreenPermissions />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Manage app permissions"} />
							</View>

							<CustomRegularPoppingText style={{}} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"} />
						</TouchableOpacity>

						<View style={{ height: 2, backgroundColor: COLORS.light, width: "100%" }}></View>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileScreenQuestionMark />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Help"} />
							</View>

							<CustomRegularPoppingText style={{}} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"} />
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileSCreenExclamation />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"About SDlove"} />
							</View>

							<CustomRegularPoppingText style={{}} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"} />
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileScreenPrivacyPolicy />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={"black"} value={"Privacy policy"} />
							</View>

							<CustomRegularPoppingText style={{}} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"} />
						</TouchableOpacity>

						<View style={{ height: 2, backgroundColor: COLORS.light, width: "100%" }}></View>

						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ alignItems: "center", marginRight: 20, justifyContent: "center", height: 35, width: 35, borderRadius: 30, backgroundColor: COLORS.light }}>
									<ProfileScreenLogOut />
								</View>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.primary} style={{}} color={COLORS.red} value={"Logout"} />
							</View>
						</TouchableOpacity>
					</View>


				</View>
			)}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				{/* Semi-transparent overlay (simulates blur effect) */}
				<Pressable
					style={styles.overlay}
					onPress={() => setModalVisible(false)}
				>
					{/* Actual modal content */}
					<View style={styles.modalContainer}>
						<View className={'gap-6 py-8'} style={styles.modalContent}>
							<TouchableOpacity style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }} onPress={() => navigation.navigate("PostEdit",{item:activePostItem})}>
								<ProfileScreenPostEdit />
								<CustomRegularPoppingText color={null} style={{ marginLeft: 20 }} value={"Edit post"} fontSize={TEXT_SIZE.primary} />
							</TouchableOpacity>


							<TouchableOpacity onPress={()=>handleDeletePost(activePostItem)} style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row"}}>
								<ProfileScreenPostDelete />
								{isLoading? <ActivityIndicator color={COLORS.primary}/> : <CustomRegularPoppingText color={null} style={{ marginLeft: 20 }} value={"Delete post"} fontSize={TEXT_SIZE.primary} />}
							</TouchableOpacity>
						</View>
					</View>
				</Pressable>
			</Modal>

		</ScrollView>
	)

}


const styles = StyleSheet.create({
	container: {
		flex: 1,

		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: '#2196F3',
		padding: 15,
		borderRadius: 10,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
	},
	modalContainer: {
		width: '100%',
		// height: SCREEN_HEIGHT * 0.89,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: 'hidden',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		// height: '100%',
		// justifyContent: 'flex-start',
		// alignItems: 'flex-start',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	modalText: {
		fontSize: 16,
		marginBottom: 20,
	},
	closeButton: {
		backgroundColor: '#2196F3',
		padding: 10,
		borderRadius: 10,
		alignItems: 'center',
	},
	closeButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default ProfileScreen