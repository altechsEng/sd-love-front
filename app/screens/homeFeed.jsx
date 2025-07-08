import React, { useCallback, useRef, useState, useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native"
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HomeFeedBell, HomeFeedComment, HomeFeedGradient, HomeFeedHeart, HomeFeedSearch, HomeFeedShare, HomeFeedSmallArrowRight, HomeFeedThreeDots, LogoSmall, PostAddIcon, PostScreenBookMark, PostScreenDots } from "../components/vectors.js";
import { BaseImageUrl, COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from "../../utils/constants.js";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import CustomPostLoader from "../components/customPostLoader.jsx";
import CustomMatchLoader from "../components/customMatchLoader.jsx";
import { calculateAge } from "../../utils/functions.js";
import FontAwesome from '@expo/vector-icons/FontAwesome';

dayjs.extend(relativeTime)

export default function HomeFeed({ navigation }) {
	const [newMatches, setNewMatches] = useState([
		{
			key: "match1",
			img: require("../../assets/images/test_img1.jpg"),
			name: "Emie",
			age: 27,
			location: "Chicago - 7km"
		},
		{
			key: "match2",
			img: require("../../assets/images/test_img2.jpg"),
			name: "Emi",
			age: 27,
			location: "Chicago - 7km"
		},
		{
			key: "match3",
			img: require("../../assets/images/test_img3.jpg"),
			name: "Emi",
			age: 27,
			location: "Chicago - 7km"
		},
		{
			key: "match4",
			img: require("../../assets/images/test_img4.jpg"),
			name: "Emi",
			age: 27,
			location: "Chicago - 7km"
		},
		{
			key: "match5",
			img: require("../../assets/images/test_img5.jpg"),
			name: "Emi",
			age: 327,
			location: "Chicago - 7km"
		}
	])

	const [posts, setPosts] = useState([
		{
			key: "post1",
			img: require("../../assets/images/test_person1.png"),
			postImg: require("../../assets/images/blog_test.jpg"),
			name: "Emanuel Sama",
			time: "2h ago",
			pupil: "SD Academy"
		},
		{
			key: "post2",
			img: require("../../assets/images/test_person1.png"),
			postImg: require("../../assets/images/blog_test1.jpg"),

			name: "Emanuel Sama",
			time: "2h ago",
			pupil: "SD Academy"
		}
	])

	const getAllPosts = async ({ pageParam = 1 }) => {
		try {

			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					'/api/get-all-posts',
					{ page: pageParam },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);



				return response.data
			}
		} catch (err) {
			console.log(err.message, "in getAllPost", Object.keys(err), err?.request);

			throw err; // Important for React Query error handling
		}
	};

	const getAllMatches = async ({ pageParam = 1 }) => {
		try {

			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					"/api/show-matches",
					{ page: pageParam },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);
				return response.data
			}
		} catch (err) {
			console.log(err.message, "in getAllmatches", Object.keys(err), err?.request);
			throw err; // Important for React Query error handling
		}
	};

	const {
		data: postData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetching
	} = useInfiniteQuery({
		queryKey: ["posts"],
		queryFn: getAllPosts,
		getNextPageParam: (lastPage) => {
			if (lastPage.hasMore) {
				return lastPage?.next_page;
			}
			return undefined;
		}
	});

	const {
		data: matchData,
		fetchNextPage: fetchNextPageMatch,
		hasNextPage: hasNextPageMatch,
		isFetchingNextPage: isFetchingNextPageMatch,
		isFetching: isFetchingMatch
	} = useInfiniteQuery({
		queryKey: ["matches"],
		queryFn: getAllMatches,
		getNextPageParam: (lastPage) => {
			if (lastPage.hasMore) {
				return lastPage?.next_page;
			}
			return undefined;
		}
	});

	// FLATTEN ALL PAGES INTO SINGLE ARRAY
	const allPosts = postData?.pages.flatMap(page => page?.posts) ?? [];
	const allmatches = matchData?.pages.flatMap(page => page?.matches) ?? [];

	const loadMorePost = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const loadMoreMatch = () => {
		if (hasNextPageMatch && !isFetchingNextPageMatch) {
			fetchNextPageMatch();
		}
	};

	const bookMarkMutation = useMutation({
		mutationFn: async ({ postId }) => {
			let token = await AsyncStorage.getItem("user_token");
			if (token) {
				let response = await axios.post('/api/save-post', { postId }, {
					headers: {
						"Authorization": `Bearer ${token}`,
					}
				})

				return { status: response.data.status, data: response.data }
			}
		},
		onError: (error) => {
			console.error("book mark error:", error);
			ToastAndroid.show("Failed to save post", ToastAndroid.SHORT);
		}
	})

	const handleBookMark = async (postId) => {
		let result = await bookMarkMutation.mutateAsync({ postId })
		if (result.status === 200) {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['userSavePosts'] })
			]);
			ToastAndroid.show("Post saved successfully", 1000);
		};
	}

	const renderLoaderMatch = () => {
		return isFetchingMatch ? (
			<ActivityIndicator size="large" color={COLORS.blue} />
		) : null;
	}

	const renderLoader = () => {
		return isFetching ? (
			<ActivityIndicator size="large" color={COLORS.blue} />
		) : null;
	};

	const renderMatches = ({ item, index }) => {

		let age = calculateAge(item?.match_user?.user_infos?.qP2)
		if (isFetchingMatch) {
			return <CustomMatchLoader />
		}

		return (
			<TouchableOpacity onPress={() => navigation.navigate("MatchConnection", { item })} style={{ flex: 1, position: "relative", alignItems: "center", justifyContent: "center", marginRight: 10, borderRadius: 20, width: 130, overflow: "hidden", marginVertical: 10 }}>
				<LinearGradient colors={["rgba(215, 168, 152, 0)", "rgba(215, 168, 152, 1)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 50, alignSelf: "flex-start", position: "absolute", zIndex: 10, bottom: -5, width: "100%" }} >
					<View style={{ flexDirection: "column", marginLeft: 10 }}>
						<View style={{ height: 19, flexDirection: "row", alignItems: "center" }}>
							<Text style={{ fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, color: "white" }}>{item?.match_user?.firstname ? `${item?.match_user?.firstname}...` : item?.name}</Text>
							<Text style={{ fontSize: TEXT_SIZE.primary - 3, margin: 0, padding: 0, fontFamily: FAMILLY.light, color: "white", marginLeft: 10, marginTop: 3, textAlign: "center", textAlignVertical: "center" }}>{age || item?.age || 25}ans</Text>
						</View>
						<View style={{}}>
							<Text style={{ fontSize: TEXT_SIZE.small - 2, fontFamily: FAMILLY.light, color: "white" }}>{item?.match_user?.city || item?.location}</Text>
						</View>
					</View>
				</LinearGradient>
				<Image source={item?.match_user?.user_image !== undefined ? { uri: `${BaseImageUrl}/${item?.match_user?.user_image}` } : item?.img} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
			</TouchableOpacity>
		)

	}

	const renderPosts = ({ item, index }) => {

		if (isFetching) {
			return <CustomPostLoader />
		}

		return (
			<View key={item?.key} style={{ flex: 1, marginVertical: 20, marginRight: 20, flexDirection: "column" }}>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
					<View clasName='' style={{ flex: 2, flexDirection: "row" }}>
						<TouchableOpacity style={{ borderRadius: 50, height: 40, width: 40, overflow: "hidden", alignItems: "center" }}><Image source={item?.user?.user_image ? { uri: `${BaseImageUrl}/${item?.user?.user_image}` } : require("../../assets/images/test_person1.png")} resizeMode="cover" style={{ height: "100%", width: "100%" }} /></TouchableOpacity>
						<View className='justify-center' style={{ marginLeft: 10 }}>
							<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, lineHeight: 20 }}>{item?.user?.firstname} {item?.user?.lastname}</Text>
							<Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(item?.created_at).fromNow() || "2h ago"}</Text>
						</View>
					</View>
					<TouchableOpacity >
						<PostScreenDots />
					</TouchableOpacity>
				</View>

				<TouchableOpacity onPress={() => navigation.navigate("Post", { item })} style={{ margin: 0, padding: 0, overflow: "hidden" }}>
					<View style={{ marginVertical: 10 }}>
						<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.light }}>
							{item?.text || "Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae."}
						</Text>
					</View>
					{item?.media?.length > 0 &&
						<Image source={item?.media?.length > 0 ? { uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}` } : require("../../assets/images/blog_test.jpg")} resizeMode="cover" style={{ width: "100%", height: 280, borderRadius: 20 }} />
					}
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
				<View style={{ height: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>

					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
						<View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
							<TouchableOpacity>
								{item?.is_liked ? <HomeFeedHeart stroke={COLORS.primary} fill={COLORS.primary} /> : <HomeFeedHeart stroke={"gray"} fill={"white"} />}
							</TouchableOpacity>
							<Text style={{ fontFamily: FAMILLY.light, marginLeft: 5 }}>{item?.likes_count || 0}</Text>
						</View>

						<View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
							<TouchableOpacity onPress={() => navigation.navigate("Post", { item })}><HomeFeedComment stroke={"gray"} fill={"white"} /></TouchableOpacity>
							<Text style={{ fontFamily: FAMILLY.light, marginLeft: 5 }}>{item?.comment_count || 0}</Text>
						</View>

						<View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
							<TouchableOpacity><HomeFeedShare fill={"gray"} /></TouchableOpacity>
							<Text style={{ fontFamily: FAMILLY.light, marginLeft: 8 }}>825</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={() => handleBookMark(item?.id)}
					>
						<PostScreenBookMark />
					</TouchableOpacity>

				</View>
			</View>
		)
	}

	return (
		<View clasName={'bg-green-100'} style={{ flex: 1 }}>
			<View clasName={'flex flex-row items-center justify-between py-4'} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, backgroundColor: "white", position: "relative", borderBottomWidth: 0, borderColor: COLORS.light }}>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingLeft: 20 }}>
					<LogoSmall />
					<Text style={{ marginLeft: 15, fontSize: TEXT_SIZE.title, color: COLORS.primary, fontWeight: "bold", fontFamily: FAMILLY.semibold, marginVertical: 10 }}>SDLOVE</Text>
				</View>

				<View clasName={'gap-8'} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingRight: 20 }}>
					<TouchableOpacity>
						<HomeFeedSearch />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={{ marginLeft: 20, }}><HomeFeedBell /></TouchableOpacity>
				</View>
			</View>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "white", position: "relative" }}>

				<View style={{ flexDirection: "row", height: 40, alignContent: "center", alignItems: "center", justifyContent: "space-between", marginVertical: 0, paddingHorizontal: 20 }}>
					<View ><Text style={{ fontSize: TEXT_SIZE.title, color: COLORS.gray, fontWeight: "bold", fontFamily: FAMILLY.semibold }}>New Matches</Text></View>
					<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
						<Text onPress={() => navigation.navigate("Match")} style={{ fontSize: TEXT_SIZE.mediam, fontFamily: FAMILLY.regular, color: COLORS.primary, marginRight: 15, textAlignVertical: "center" }}>see all</Text>
						<View style={{ marginTop: 1 }}><HomeFeedSmallArrowRight /></View>
					</TouchableOpacity>
				</View>

				<View style={{ paddingLeft: 20 }}>
					<FlatList
						data={allmatches.length > 0 ? allmatches : newMatches}
						renderItem={renderMatches}
						keyExtractor={(item) => item?.key || item?.id}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						style={{ height: 180 }}

						onEndReached={loadMoreMatch}
						onEndReachedThreshold={0.5}
						ListFooterComponent={renderLoaderMatch}
						ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center" }}

					/>
				</View>

				{/* <View style={{ paddingLeft: 20 }}>
					<FlatList
						data={allPosts.length == 0 ? posts : allPosts}
						renderItem={renderPosts}
						keyExtractor={(item) => item?.key || item?.id}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						onEndReached={loadMorePost}
						onEndReachedThreshold={0.5}
						ListFooterComponent={renderLoader}
						ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center" }}
					/>
				</View> */}
				<View style={{ paddingLeft: 20 }}>
					<FlatList
						data={allPosts.length == 0 ? posts : allPosts}
						renderItem={renderPosts}
						keyExtractor={(item) => item?.key || item?.id}
						horizontal={false}
						showsHorizontalScrollIndicator={false}
						onEndReached={loadMoreMatch}
						onEndReachedThreshold={0.5}
						ListFooterComponent={renderLoader}
						ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center", paddingBottom: 50 }}
					/>
				</View>
				<View style={{ height: 100 }}></View>
			</ScrollView>
			<TouchableOpacity clasName={'absolute'} onPress={() => navigation.navigate("PostAdd")} style={{ height: 50, width: 50, position: "absolute", zIndex: 99, bottom: 20, right: 10, borderRadius: 100, backgroundColor: "#2E2E2E", alignItems: "center", justifyContent: "center" }}>
				<PostAddIcon />
			</TouchableOpacity>
		</View>
	)
}