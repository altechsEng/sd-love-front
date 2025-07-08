import { CustomMeduimPoppingText, CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../app/components/text";
import { MatchProfileArrowBack, MatchProfileBirthDay, MatchProfileEducation, MatchProfileFaithChurch, MatchProfileFaithIcon1, MatchProfileFaithOccupation, MatchProfileHome, MatchProfileLang, MatchProfilePlus, MatchProfileSexIcon, MatchProfileSmallHeart, MatchProfleSmallFace } from "../../components/vectors";
import { COLORS, TEXT_SIZE, FAMILLY, BaseImageUrl, POST_LIMIT, BasePostImageUrl } from "../../../utils/constants";
import React, { useEffect, useRef, useState } from "react"
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, FlatList } from "react-native"

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
import relativeTime from "dayjs/plugin/relativeTime";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
dayjs.extend(relativeTime)

export default function MatchProfile({ navigation }) {
	const { item } = useRoute().params
	const [interest, setInterest] = useState(["Travel", "Music", "Fishing", "Gym", "Bible", "Dance"])
	const [churchOccupations, setchurchOccupations] = useState(["Travel", "Music", "Fishing", "Gym", "Bible", "Dance"])
	useEffect(() => {
		let data = JSON.parse(item?.match_user?.user_infos?.qP16)
		setInterest(data)
		setchurchOccupations(JSON.parse(item?.match_user?.user_infos?.qS10) || ["Travel", "Music", "Fishing", "Gym", "Bible", "Dance"])
		console.log(item?.match_user?.firstname, "poppp---")
	}, [])

	const isSearching = useRef(false);
	const getMatchPost = async ({ pageParam = 0 }) => {
		try {
			isSearching.current = true;
			let url = '/api/show-match-posts';
			let token = await AsyncStorage.getItem("user_token");
			let matchId = item?.match_id

			if (token) {
				const response = await axios.post(
					url,
					{ offset: pageParam, limit: POST_LIMIT, matchId },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);

				isSearching.current = false;

				return {
					match_posts: response?.data?.match_posts,
					match_images: response?.data?.match_images,
					nextOffset: response?.data?.next_offset,
				};
			}
		} catch (err) {
			console.log(err.message, "in getAllMatches", Object.keys(err), err?.request);
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
		queryKey: ["match_posts"],
		queryFn: getMatchPost,
		getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,

	});

	// FLATTEN ALL PAGES INTO SINGLE ARRAY
	const allMatchPost = data?.pages.flatMap(page => {

		return page?.match_posts
	}) ?? []; 7

	const allMatchImages = data?.pages.flatMap(page => {
		return page?.match_images
	}) ?? [];

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
	const [activeSubCat, setActiveSubCat] = useState('About')

	const [posts, setPosts] = useState([
		{
			key: "post1",
			img: require("../../../assets/images/test_match1.jpg"),
			postImg: require("../../../assets/images/match_pro1.jpg"),
			name: "Emanuel Sama",
			time: "2h ago",
			pupil: "SD Academy"
		}])

	const renderPosts = ({ item, index }) => {

		if (isFetching) {
			return <CustomPostLoader />
		}
		return (
			<View style={{ flex: 1, marginVertical: 10, marginRight: 20, width: wp(90), flexDirection: "column" }}>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
					<View style={{ flex: 2, flexDirection: "row" }}>
						<TouchableOpacity style={{ borderRadius: 50, height: 50, width: 50, overflow: "hidden", alignItems: "center" }}><Image source={{ uri: `${BaseImageUrl}/${item?.user?.user_image}` } || require("../../../assets/images/test_match1.jpg")} resizeMode="cover" style={{ height: "100%", width: "100%" }} /></TouchableOpacity>
						<View style={{ flexDirection: "column", justifyContent: "center", marginLeft: 10 }}>
							<Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.secondary - 2, fontFamily: FAMILLY.semibold }}>{item?.user?.firstname || "Johan mark"}</Text>
							<Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(item?.created_at).fromNow() || "2h ago"}</Text>
						</View>
					</View>

					<View style={{ backgroundColor: COLORS.primary, height: 25, width: 80, borderRadius: 20, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "white", fontSize: TEXT_SIZE.secondary - 2 }}>SD Academy</Text></View>
				</View>
				<View style={{ marginVertical: 10 }}>
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

	return (
		<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={{ backgroundColor: "white", padding: 20, flex: 1 }}>

			<View style={{ height: SCREEN_HEIGHT * 0.5, borderRadius: 20, alignItems: "center", position: "relative", overflow: "hidden" }}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ top: 15, position: "absolute", left: 15, zIndex: 10 }}>
					<MatchProfileArrowBack />
				</TouchableOpacity>
				<Image style={{ height: "100%", width: "100%" }} resizeMode="cover" source={{ uri: `${BaseImageUrl}/${item?.match_user?.user_image}` } || require('../../../assets/images/test_match1.jpg')} />
			</View>
			<CustomSemiBoldPoppingText value={`${item?.match_user?.firstname} ${item?.match_user?.lastname}` || "Magy McLeen"} color="black" fontSize={TEXT_SIZE.title + 3} style={{ textAlign: "left", marginTop: 20 }} />
			{/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View>
					<CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.secondary} value={item?.match_user?.user_infos?.qS3} />
					<CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.small} value="Choir Leader" />
				</View>
			</View> */}
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<CustomRegularPoppingText style={{ marginRight: 5 }} fontSize={TEXT_SIZE.medium} color={"#A0A7AE"} value={`18 posts`} />

				<View style={{ backgroundColor: "white", height: 25, alignItems: "center", justifyContent: "center" }}>
					<View style={{ height: 5, marginBottom: 2, width: 5, backgroundColor: "black", borderRadius: 50, borderColor: "black", borderWidth: 0, marginRight: 5 }}></View>
				</View>
				<CustomRegularPoppingText style={{ marginRight: 5 }} fontSize={TEXT_SIZE.medium} color={"#A0A7AE"} value={`283 followers`} />

				<View style={{ backgroundColor: "white", height: 25, alignItems: "center", justifyContent: "center" }}>
					<View style={{ height: 5, marginBottom: 2, width: 5, backgroundColor: "black", borderRadius: 50, borderColor: "black", borderWidth: 0, marginRight: 5 }}></View>
				</View>
				<CustomRegularPoppingText style={{ marginRight: 5 }} fontSize={TEXT_SIZE.medium} color={"#A0A7AE"} value={`99 following`} />
			</View>

			<View className='gap-3 mt-4' style={{ flexDirection: "row", alignItems: "center" }}>
				<TouchableOpacity className='border border-[#D7A898] rounded-3xl px-6 py-3' style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "flex-start" }}>
					<View style={{ marginRight: 5 }}>
						<MatchProfilePlus />
					</View>
					<CustomMeduimPoppingText style={{ textTransform: "capitalize", lineHeight: 18 }} color={COLORS.primary} fontSize={TEXT_SIZE.medium} value="Follow" />
				</TouchableOpacity>
				<TouchableOpacity className='border border-[#D7A898] bg-[#D7A898] rounded-3xl px-6 py-3' style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "flex-start" }}>
					{/* <View style={{ marginRight: 5 }}>
						<MatchProfilePlus />
					</View> */}
					<CustomMeduimPoppingText style={{ textTransform: "capitalize", lineHeight: 18 }} color={'white'} fontSize={TEXT_SIZE.medium} value="Request engagement" />
				</TouchableOpacity>
				<TouchableOpacity className='border border-[#D7A898]' style={{ alignItems: "center", justifyContent: "center", height: 42, width: 42, borderRadius: 22 }}><MatchProfileSmallHeart strock='#D7A898' /></TouchableOpacity>
			</View>

			<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30, borderBottomWidth: 2, borderBottomColor: "#F5F6FC" }}>

				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
					{['About', "Posts", "Photos"].map((cat) => (
						<TouchableOpacity key={cat} onPress={() => setActiveSubCat(cat)} className='px-5' style={{ borderBottomWidth: 2, borderBottomColor: activeSubCat == cat ? COLORS.primary : "#ffff", height: 40, alignItems: "center", justifyContent: "center" }}>
							<CustomSemiBoldPoppingText style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.medium + 1} value={cat} color={activeSubCat == cat ? COLORS.primary : "#808A94"} />
						</TouchableOpacity>
					))}
				</View>

				{/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
					<TouchableOpacity style={{ marginRight: 10, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.red, height: 35, width: 35, borderRadius: 20 }}><MatchProfleSmallFace /></TouchableOpacity>
					<TouchableOpacity style={{ alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, height: 35, width: 35, borderRadius: 20 }}><MatchProfileSmallHeart /></TouchableOpacity>
				</View> */}

			</View>

			{activeSubCat == "About" && (
				<View style={{ marginTop: 20, marginBottom: 10 }}>
					<CustomSemiBoldPoppingText fontSize={TEXT_SIZE.primary} value="Bio" style={{}} color={null} />
					<CustomRegularPoppingText fontSize={TEXT_SIZE.medium} color={null} style={{}} value="No biography" />

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
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={item?.match_user?.user_infos?.qP1} />
							</View>
						</View>

						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileBirthDay /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Birthday" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={dayjs(item?.match_user?.user_infos?.qP2).format('D MMM, YYYY')} />
							</View>
						</View>

						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileHome /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Home" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={`${item?.match_user?.country}, ${item?.match_user?.city}, ${item?.match_user?.address}` || "Not specified"} />
							</View>
						</View>

						{/* <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
						<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileLang /></View>
						<View>
							<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Language" />
							<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value="English, French" />
						</View>
					</View> */}
					</View>

					<CustomSemiBoldPoppingText style={{ marginTop: 15, marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Faith" />

					<View>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileFaithIcon1 /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Gave my life to God" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={item?.match_user?.user_infos?.qS2 || "Not specified"} />
							</View>
						</View>

						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileFaithChurch /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Denomination" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={item?.match_user?.user_infos?.qS3} />
							</View>
						</View>


						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileFaithOccupation /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Occupation" />
								<View className={'mt-2'} style={{ flexDirection: "row", flexWrap: "wrap" }}>
									{churchOccupations.map((d) => (
										<View className={'py-2'} key={d} style={{ marginRight: 10, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: COLORS.light }}>
											<CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d} />
										</View>
									))}
								</View>
							</View>
						</View>
					</View>

					<CustomSemiBoldPoppingText style={{ marginTop: 15, marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Education & Work" />

					<View>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
							<View style={{ marginRight: 20, backgroundColor: COLORS.light, height: 30, width: 30, alignItems: "center", borderRadius: 20, justifyContent: "center" }}><MatchProfileEducation /></View>
							<View>
								<CustomRegularPoppingText style={{ lineHieght: 8 }} color={null} fontSize={TEXT_SIZE.small} value="Education" />
								<CustomRegularPoppingText style={{ lineHeight: 15 }} color={null} fontSize={TEXT_SIZE.primary} value={item?.match_user?.user_infos?.qP11 || "Not specified"} />
							</View>
						</View>
					</View>

					{/* <View style={{ marginTop: 15, marginBottom: 10 }}>
					<CustomSemiBoldPoppingText style={{ marginBottom: 10 }} color={null} fontSize={TEXT_SIZE.primary} value="Skills" />
					<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
						{["Dancing", "Acting", "Singing", "Writing"].map((d) => (
							<View key={d} style={{ marginRight: 10, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: COLORS.light }}>
								<CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d} />
							</View>
						))}
					</View>
				</View> */}

					<View style={{ height: 30 }}></View>
				</View>
			)}


			{activeSubCat == "Posts" && (
				<View>
					{/* <FlatList
					data={allMatchPost.length > 0 ? allMatchPost : posts}
					renderItem={renderPosts}
					keyExtractor={(item) => item?.key || item?.id}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					style={{ marginBottom: 50 }}
	
				/> */}
					<View>
						{/* <MaterialCommunityIcons name="timeline-text-outline" size={24} color="gray" /> */}
						<Text className='mt-20 text-center text-gray-400' style={{ fontSize: TEXT_SIZE.medium }}>No post to display</Text>
					</View>
				</View>
			)}

			{activeSubCat == "Photos" && (
				<View style={{ marginTop: 20, flexDirection: "row", flexWrap: "wrap" }}>
					<FlatList data={allMatchImages.length > 0 ? allMatchImages : [{ img: require("../../../assets/images/match_pro1.jpg") }, { img: require("../../../assets/images/match_pro2.jpg") }, { img: require("../../../assets/images/match_pro3.jpg") }]}
						keyExtractor={(item) => item?.content || item?.img}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						horizontal={true}
						renderItem={({ item }) => {

							return <View style={{ height: 100, width: 100, marginRight: 10, marginBottom: 5, borderRadius: 5, overflow: "hidden" }}>
								<Image source={{ uri: `${BasePostImageUrl}/${item?.content}` } || item?.img} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
							</View>
						}}
					/>
				</View>
			)}

			<View style={{ height: 20 }}></View>
		</ScrollView>
	)
}