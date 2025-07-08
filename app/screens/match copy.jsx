
import React, { useState, useEffect, useRef } from "react"

import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, PermissionsAndroid, ActivityIndicator } from "react-native"
import { MatchScreenAdress, MatchScreenAdressWithBox, MatchScreenDownArrow, MatchScreenFakeLayers, MatchScreenFilters, MatchScreenGridCards, MatchScreenSideCards, MatchScreenFace, MatchScreenXmark, MatchScreenHeartWhite } from "../components/vectors"
import { BaseImageUrl, COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from "../../utils/constants"
import { LinearGradient } from "react-native-linear-gradient";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";

import MasonryList from "@react-native-seoul/masonry-list"
import * as Location from "expo-location"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useInfiniteQuery } from "@tanstack/react-query"
import CustomMatchLoader from "../components/customMatchLoader";
import CardContainer from "../components/cardContainer";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { calculateAge } from "../../utils/functions";
import VerticalCardCarousel from "../components/verticalCardCarousel";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')




const MatchScreen = ({ navigation }) => {
	const [userLocation, setUserLocation] = useState();
	const [lastItemId, setLastItemId] = useState(null)

	const [sideMatchData, setSideMatchData] = useState([
		{ image: require("../../assets/images/grid1.png") },
		{ image: require("../../assets/images/grid1.png") },
		{ image: require("../../assets/images/grid3.png") },
		{ image: require("../../assets/images/grid3.png") },
		{ image: require("../../assets/images/grid1.png") },

	])




	const isSearching = useRef(false);
	const getAllMatches = async ({ pageParam = 0 }) => {
		try {
			isSearching.current = true;
			let url = '/api/show-matches';
			let token = await AsyncStorage.getItem("user_token");

			if (token) {
				const response = await axios.post(
					url,
					{ offset: pageParam, limit: POST_LIMIT },
					{ headers: { "Authorization": `Bearer ${token}` } }
				);


				isSearching.current = false;
				return {
					matches: response?.data?.matches,
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
		queryKey: ["matches"],
		queryFn: getAllMatches,
		getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,

	});

	// FLATTEN ALL PAGES INTO SINGLE ARRAY
	const allMatches = data?.pages.flatMap(page => {

		return page?.matches
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


	const getDistance = (lat1, lon1, lat2, lon2) => {
		const R = 6371; // Earth radius in km
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * Math.PI / 180) *
			Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c * 1000; // Distance in meters
	};



	const getColorForDistance = (distance) => {
		if (distance <= 1000) return "rgba(215, 168, 152, 1)"; // Green
		if (distance <= 1500) return 'rgba(215, 168, 152, 05)'; // Yellow
		return 'rgba(215, 168, 152, 0.2)'; // Red
	};

	const requestLocationPermission = async () => {

		let { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') {
			console.log("permission denied")
			return
		}

		let location = await Location.getCurrentPositionAsync({})
		//important note uncomment the real user location when you will have real profiles wiht real data
		setUserLocation({
			// latitude:location.coords.latitude,
			// longitude:location.coords.longitude,
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		});

	};

	useEffect(() => {
		if (activeScreen === "box") requestLocationPermission();
	}, [activeScreen]);

	const [activeScreen, setActiveScreen] = useState('side')

	const [mapRegion, setMapRegion] = useState({
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	const [profiles, setProfiles] = useState([{
		key: "pro1",
		image: require("../../assets/images/grid1.png"),
		name: "Henriette",
		age: 26,
		location: "Chicago - 7km",
		latitude: 37.79274,
		longitude: -122.4324

	},
	{
		key: "pro2",
		image: require("../../assets/images/grid2.png"),
		name: "Gleine",
		age: 27,
		location: "Chicago - 7km",
		latitude: 37.78825,
		longitude: -122.4187

	},
	{
		key: "pro3",
		image: require("../../assets/images/grid3.png"),
		name: "Stephanie",
		age: 23,
		location: "Chicago - 7km",
		latitude: 37.7658,
		longitude: -122.4324

	},
	{
		key: "pro4",
		image: require("../../assets/images/grid4.png"),
		name: "Lora",
		age: 24,
		location: "Chicago - 7km",
		latitude: 37.78825,
		longitude: -122.4722
	},
	{
		key: "pro5",
		image: require("../../assets/images/test_match1.jpg"),
		name: "Maggy",
		age: 24,
		location: "Chicago - 7km",
		latitude: 37.79274,
		longitude: -122.4324
	},
	{
		key: "pro6",
		image: require("../../assets/images/grid5.png"),
		name: "Annie",
		age: 24,
		location: "Chicago - 7km",
		latitude: 37.79274,
		longitude: -122.4324

	}])

	const renderProfile = ({ item }) => {

		let age = calculateAge(item?.match_user?.user_infos[0]?.qP2)
		if (isFetching) {
			return <View style={{ marginTop: 10, borderRadius: 20, overflow: "hidden", backgroundColor: COLORS.light, marginBottom: 10, height: 200, marginRight: 10, flex: 1 }}>
				<LinearGradient colors={["rgba(215, 168, 152, 0)", "white"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 50, alignSelf: "flex-start", position: "absolute", zIndex: 10, bottom: -5, width: "100%" }} >
					<View style={{ flexDirection: "column", marginLeft: 10 }}>
						<View style={{ height: 19, flexDirection: "row", alignItems: "center" }}>
							<Text style={{ fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, color: "white" }}> </Text>
							<Text style={{ fontSize: TEXT_SIZE.primary - 3, margin: 0, padding: 0, fontFamily: FAMILLY.light, color: "white", marginLeft: 10, marginTop: 3, textAlign: "center", textAlignVertical: "center", width: 25, backgroundColor: COLORS.light }}> </Text>
						</View>
						<View style={{}}>
							<Text style={{ fontSize: TEXT_SIZE.small - 2, fontFamily: FAMILLY.light, color: "white" }}> </Text>
						</View>
					</View>
				</LinearGradient>

			</View>
		}

		return <View style={{ marginTop: 10, borderRadius: 20, overflow: "hidden", marginBottom: 10, height: 200, marginRight: 10, flex: 1 }}>
			<LinearGradient colors={["rgba(215, 168, 152, 0)", "rgba(215, 168, 152, 1)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 55, alignSelf: "flex-start", position: "absolute", zIndex: 10, bottom: 0, width: "100%" }} >
				<View style={{ flexDirection: "column", marginLeft: 10 }}>
					<View style={{ height: 19, flexDirection: "row", alignItems: "center" }}>
						<Text style={{ fontSize: TEXT_SIZE.secondary, fontFamily: FAMILLY.semibold, color: "white" }}>{item?.match_user?.firstname ? `${item?.match_user?.firstname} ${item?.match_user?.lastname}` : item?.name}, </Text>
						<Text style={{ fontSize: TEXT_SIZE.secondary, margin: 0, padding: 0, fontFamily: FAMILLY.light, color: "white", lineHeight: 19, marginLeft: 10, textAlign: "center", textAlignVertical: "center" }}>{age || item?.age || 25} ans</Text>
					</View>
					<View style={{}}>
						<Text style={{ fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light, color: "white" }}>{item?.match_user?.city || item?.location}</Text>
					</View>
				</View>
			</LinearGradient>
			<TouchableOpacity onPress={() => navigation.navigate("MatchConnection", { item })}>
				<Image source={item?.match_user?.user_image ? { uri: `${BaseImageUrl}/${item?.match_user?.user_image}` } : item?.image} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
			</TouchableOpacity>
		</View>

	}

	return (
		<View className={''} style={{ backgroundColor: "white", paddingHorizontal: 20, position: "relative", flex: 1 }}>

			<View className={'relative z-10 py-4 bg-white'} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<TouchableOpacity className={'flex flex-row items-center bg-gray-100 py-2 px-2 rounded-lg gap-2'}>
					<MatchScreenAdress />
					<Text style={{ color: COLORS.black, fontFamily: FAMILLY.medium, textTransform: "capitalize" }}>Chicago</Text>
					<MatchScreenDownArrow />
				</TouchableOpacity>

				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity onPress={() => setActiveScreen('side')} style={{ marginRight: 20 }}><MatchScreenSideCards stroke={activeScreen == 'side' ? "#D7A898" : "#5E5E5E"} /></TouchableOpacity>
					<TouchableOpacity onPress={() => setActiveScreen('grid')} style={{ marginRight: 20 }}><MatchScreenGridCards stroke={activeScreen == 'grid' ? "#D7A898" : "#5E5E5E"} /></TouchableOpacity>
					<TouchableOpacity onPress={() => setActiveScreen('box')} style={{ marginRight: 20 }}><MatchScreenAdressWithBox stroke={activeScreen == 'box' ? "#D7A898" : "#5E5E5E"} /></TouchableOpacity>
					<TouchableOpacity style={{ marginRight: 0 }}><MatchScreenFilters /></TouchableOpacity>
				</View>
			</View>

			{activeScreen == 'side' &&
				<View style={{ marginVertical: 20, height: '100%', alignItems: "center", flexDirection: "column" }} >
					<CardContainer data={allMatches} isLoading={isFetching} maxVisibleItems={3} />
					<Text className='absolute text-gray-400 bottom-10' style={{ position: "absolute", bottom: 10 }}>Swip vertically</Text>
				</View>
			}

			{activeScreen == 'grid' &&

				<FlatList
					keyExtractor={(item, index) => item?.key + "" + index}
					data={allMatches.length > 0 ? allMatches : profiles}
					renderItem={renderProfile}
					numColumns={2}
					showsVerticalScrollIndicator={false}
				/>
			}

			{activeScreen == "box" &&
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						{activeScreen == "box" && userLocation && (
							<MapView
								style={{ flex: 1 }}
								initialRegion={userLocation}
								showsUserLocation={false}
							>
								{userLocation && (
									<Marker
										coordinate={userLocation}
										anchor={{ x: 0.5, y: 0.5 }}
									>
										<View style={{
											backgroundColor: 'white',
											padding: 3,
											borderRadius: 30,
											shadowColor: '#000',
											shadowOffset: { width: 0, height: 2 },
											shadowOpacity: 0.2,
											shadowRadius: 4,
											elevation: 5
										}}>
											<View style={{
												width: 35,
												height: 35,
												borderRadius: 25,
												borderWidth: 3,
												borderColor: COLORS.primary,
												overflow: 'hidden'
											}}>
												<Image
													source={require('../../assets/images/match_con1.jpg.jpg')}
													style={{
														width: '100%',
														height: '100%',
														resizeMode: 'cover'
													}}
												/>
											</View>
										</View>
									</Marker>
								)}

								{/* Concentric Circles */}
								<Circle
									center={userLocation}
									radius={1000} // 1km
									fillColor={"rgba(215, 168, 152, 1)"}

									strokeWidth={0}
								/>
								<Circle
									center={userLocation}
									radius={1500} // 3km
									fillColor="rgba(215, 168, 152, 0.5)"

									strokeWidth={0}
								/>
								<Circle
									center={userLocation}
									radius={2000} // 5km
									fillColor="rgba(215, 168, 152, 0.19)"

									strokeWidth={0}
								/>
								{/* Profile Markers */}
								{profiles.map((profile) => {
									const distance = getDistance(
										userLocation.latitude,
										userLocation.longitude,
										profile.latitude,
										profile.longitude
									);
									return (
										<Marker
											key={profile.key}
											coordinate={{
												latitude: profile.latitude,
												longitude: profile.longitude
											}}

										>
											<View style={{
												backgroundColor: 'white',
												padding: 3,
												borderRadius: 25,
												shadowColor: '#000',
												shadowOffset: { width: 0, height: 2 },
												shadowOpacity: 0.2,
												shadowRadius: 4,
												elevation: 3
											}}>
												<View style={{
													width: 30,
													height: 30,
													borderRadius: 20,
													borderWidth: 2,
													borderColor: getColorForDistance(distance),
													overflow: 'hidden'
												}}>
													<Image
														source={profile.image}
														style={{
															width: '100%',
															height: '100%',
															resizeMode: 'cover'
														}}
													/>
												</View>
											</View>
										</Marker>
									);
								})}

							</MapView>
						)}
					</View>
				</View>
			}
		</View>
	)

}

export default MatchScreen