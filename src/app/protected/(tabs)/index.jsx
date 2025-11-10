import React, { useCallback, useRef, useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, Pressable, ScrollView } from "react-native"
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HomeFeedBell, HomeFeedComment, HomeFeedGradient, HomeFeedHeart, HomeFeedSearch, HomeFeedShare, HomeFeedSmallArrowRight, HomeFeedThreeDots, LogoSmall, PostAddIcon, PostScreenBookMark, PostScreenDots } from "../../../components/vectors.js";
import { BaseImageUrl, COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from "../../../utils/constants.js";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import CustomPostLoader from "../../../components/customPostLoader.jsx";
import CustomMatchLoader from "../../../components/customMatchLoader.jsx";
import { calculateAge } from "../../../utils/functions.js";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../components/text.jsx";
import Ionicons from "@expo/vector-icons/Ionicons.js";
import { Link, router, Stack, useNavigation } from "expo-router";

dayjs.extend(relativeTime)

export default function Index() {

	const navigation = useNavigation();

	const [contentHeight, setContentHeight] = useState(0);
	const [scrollViewHeight, setScrollViewHeight] = useState(0);
	// Calculate if user has scrolled to the bottom
	const handleScroll = useCallback((event) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		const contentHeight = event.nativeEvent.contentSize.height;
		const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

		// Trigger load more when 50px from bottom
		if (contentHeight - (offsetY + scrollViewHeight) < 50 &&
			hasNextPage &&
			!isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Measure content height when it changes
	const handleContentSizeChange = useCallback((w, h) => {
		setContentHeight(h);
	}, []);

	// Measure ScrollView height
	const handleLayout = useCallback((event) => {
		setScrollViewHeight(event.nativeEvent.layout.height);
	}, []);

	const getAllPosts = async ({ pageParam = 1 }) => {
		try {

			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					'/api/get-all-posts',
					{ page: pageParam },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);

				console.log(response.data, "response data posts");


				return response.data
			}
		} catch (err) {
			console.log(err.message, "in getAllPost", Object.keys(err), err?.request);

			throw err; // Importa
			// nt for React Query error handling
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
			if (lastPage?.hasMore) {
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
			if (lastPage?.hasMore) {
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
			<Link href={{ pathname: '/protected/dating/match-connection', params: { item:JSON.stringify(item) } }} asChild>
				<TouchableOpacity style={{ flex: 1, position: "relative", alignItems: "center", justifyContent: "center", marginRight: 10, borderRadius: 20, width: 130, overflow: "hidden", marginVertical: 10 }}
					// onPress={() => router.navigate("/protected/dating/match-connection", { item })}
				>
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
			</Link>
		)
	}

	const renderPosts = ({ item, index }) => {

		if (isFetching) {
			return <CustomPostLoader />
		}

		if (!item) {
			return (
				<View style={{ height: hp("60%"), alignItems: "center", justifyContent: "center" }}>
					<View style={{ marginBottom: 15, borderRadius: "100%", alignItems: "center", justifyContent: "center" }}>
						<FontAwesome name="newspaper-o" size={64} color="gray" />
					</View>
					<CustomSemiBoldPoppingText value={`No post found`} style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.primary + 2} color={"black"} />
				</View>
			)
		}

		return (
			<View key={item?.key} style={{ flex: 1, marginVertical: 20, marginRight: 20, flexDirection: "column" }}>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
					<View clasName='' style={{ flex: 2, flexDirection: "row" }}>
						<TouchableOpacity style={{ borderRadius: 50, height: 40, width: 40, overflow: "hidden", alignItems: "center" }}><Image source={{ uri: `${BaseImageUrl}/${item?.user?.user_image}` }} resizeMode="cover" style={{ height: "100%", width: "100%" }} /></TouchableOpacity>
						<View className='justify-center' style={{ marginLeft: 10 }}>
							<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, lineHeight: 20 }}>{item?.user?.firstname} {item?.user?.lastname}</Text>
							<Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(item?.created_at).fromNow() || "2h ago"}</Text>
						</View>
					</View>
					<TouchableOpacity >
						<PostScreenDots />
					</TouchableOpacity>
				</View>

				<Pressable onPress={() => router.navigate("/protected/posts/posts", { item })} style={{ margin: 0, padding: 0, overflow: "hidden" }}>
					<View style={{ marginVertical: 10 }}>
						<Text style={{ lineHeight: 22, color: COLORS.black, fontSize: TEXT_SIZE.primary, fontWeight: FAMILLY.light }}>
							{item?.text}
						</Text>
					</View>
					{item?.media?.length > 0 &&
						<View className='relative'>
							<Image source={item?.media?.length > 0 ? { uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}` } : <></>} resizeMode="cover" style={{ width: "100%", height: 280, borderRadius: 20 }} />
							{item?.media?.length > 1 &&
								<View className='absolute flex flex-row items-center justify-center' style={{ bottom: 10, right: 10, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
									<Text style={{ color: "white", fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.semibold }}>+{item?.media?.length - 1}</Text>
									<Ionicons className='ml-2' name="images-outline" size={16} color="white" />
								</View>
							}
						</View>
					}
				</Pressable>
				<View style={{ height: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>

					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
						<View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
							<TouchableOpacity>
								{item?.is_liked ? <HomeFeedHeart stroke={COLORS.primary} fill={COLORS.primary} /> : <HomeFeedHeart stroke={"#2E2E2E"} fill={"white"} />}
							</TouchableOpacity>
							<Text style={{ fontFamily: FAMILLY.light, marginLeft: 5 }}>{item?.likes_count || ''}</Text>
						</View>

						<View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
							<TouchableOpacity onPress={() => navigation.navigate("Post", { item })}><HomeFeedComment stroke={"#2E2E2E"} fill={"white"} /></TouchableOpacity>
							<Text style={{ fontFamily: FAMILLY.light, marginLeft: 5 }}>{item?.comment_count || ''}</Text>
						</View>

						{/* <View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity><HomeFeedShare fill={"gray"} /></TouchableOpacity>
              <Text style={{ fontFamily: FAMILLY.light, marginLeft: 8 }}>825</Text>
            </View> */}
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
		<View clasName={'bg-green-100'} style={{ flex: 1, backgroundColor: "white" }}>
			<Stack.Screen
				options={{
					headerTitle: props => (
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
							<LogoSmall />
							<Text style={{ marginLeft: 15, fontSize: TEXT_SIZE.title, color: COLORS.primary, fontWeight: "bold", fontFamily: FAMILLY.semibold, marginVertical: 10 }}>SDLOVE</Text>
						</View>
					),
					headerRight: () =>
					(
						<View clasName={'gap-8'} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingRight: 20 }}>
							<TouchableOpacity>
								<HomeFeedSearch />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => router.navigate("/protected/notifications")} style={{ marginLeft: 20, }}><HomeFeedBell /></TouchableOpacity>
						</View>
					),
				}}
			/>
			<ScrollView
				onScroll={handleScroll}
				scrollEventThrottle={16}
				onContentSizeChange={handleContentSizeChange}
				onLayout={handleLayout}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ backgroundColor: "white", position: "relative" }}>
				{allmatches.length > 0 &&
					<>
						<View style={{ flexDirection: "row", height: 40, alignContent: "center", alignItems: "center", justifyContent: "space-between", marginVertical: 0, paddingHorizontal: 20 }}>
							<View ><Text style={{ fontSize: TEXT_SIZE.title, color: COLORS.gray, fontWeight: "bold", fontFamily: FAMILLY.semibold }}>New Matches</Text></View>
							<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
								<Text onPress={() => navigation.navigate("Match")} style={{ fontSize: TEXT_SIZE.mediam, fontFamily: FAMILLY.regular, color: COLORS.primary, marginRight: 15, textAlignVertical: "center" }}>see all</Text>
								<View style={{ marginTop: 1 }}><HomeFeedSmallArrowRight /></View>
							</TouchableOpacity>
						</View>

						<View style={{ paddingLeft: 20 }}>
							<FlatList
								data={allmatches.length > 0 ? allmatches : null}
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
					</>
				}

				{allPosts.length > 0 ?
					<>
						<View style={{ paddingLeft: 20 }}>
							<FlatList
								data={allPosts}
								renderItem={renderPosts}
								keyExtractor={(item) => item?.key || item?.id}
								horizontal={false}
								scrollEnabled={false}
								showsHorizontalScrollIndicator={false}
								onEndReached={loadMoreMatch}
								onEndReachedThreshold={0.5}
								ListFooterComponent={renderLoader}
								ListFooterComponentStyle={{ alignItems: "center", justifyContent: "center", paddingBottom: 50 }}
							/>
						</View>
					</>
					:
					<View className='bg-slate-100' style={{ height: hp("60%"), alignItems: "center", justifyContent: "center" }}>
						<View style={{ marginBottom: 15, borderRadius: "100%", alignItems: "center", justifyContent: "center" }}>
							<FontAwesome name="newspaper-o" size={64} color="gray" />
						</View>
						<CustomSemiBoldPoppingText value={`No post to display`} style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.primary + 2} color={"black"} />
						<CustomRegularPoppingText style={{ width: wp("85%"), marginTop: 5, textAlign: "center" }} value={"Your posts and those of the people you follow will appear here"} fontSize={TEXT_SIZE.medium} color={"gray"} />
						<TouchableOpacity className='flex items-center ' onPress={() => router.navigate("/protected/posts/post-add")} style={{ marginTop: 10, width: "80%", paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.black }}>
							<CustomRegularPoppingText fontSize={TEXT_SIZE.small + 2} value={`Add a post`} style={{ textAlign: "center" }} color={"white"} />
						</TouchableOpacity>
					</View>
				}
				<View style={{ height: 100 }}></View>
			</ScrollView>
			<TouchableOpacity clasName={'absolute'} onPress={() => router.navigate("/protected/posts/post-add")} style={{ height: 50, width: 50, position: "absolute", zIndex: 99, bottom: 20, right: 10, borderRadius: 100, backgroundColor: "#2E2E2E", alignItems: "center", justifyContent: "center" }}>
				<PostAddIcon />
			</TouchableOpacity>
		</View>
	)
}