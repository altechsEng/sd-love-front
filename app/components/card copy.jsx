import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
	useAnimatedStyle,
	interpolate,
	withTiming,
} from 'react-native-reanimated';
import {
	State,
	Gesture,
	Directions,
	GestureDetector,
	FlingGestureHandler
} from 'react-native-gesture-handler';
import { LinearGradient } from "react-native-linear-gradient";
import { TEXT_SIZE, COLORS, FAMILLY, BaseImageUrl } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { calculateAge } from '../../utils/functions';
import { MatchScreenFace, MatchScreenHeartWhite, MatchScreenXmark } from './vectors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')



const Card = ({
	maxVisibleItems,
	item,
	index,
	dataLength,
	animatedValue,
	currentIndex,
	prevIndex,
}) => {
	const IMAGE_WIDTH = 300;
	const IMAGE_HEIGHT = 300;

	// const swipeUp = Gesture.Fling()
	//  .direction(Directions.UP)
	//  .onStart((e) => {
	//    position.value = withTiming(position.value + 10, { duration: 100 });
	//  });

	const navigation = useNavigation()
	let age = calculateAge(item?.match_user?.user_infos?.qP2)
	const animatedStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			animatedValue.value,
			[index - 1, index, index + 1],
			[40, 1, -800],
		);
		const translateY2 = interpolate(
			animatedValue.value,
			[index - 1, index, index + 1],
			[-800, 1, 800],
		);
		const scale = interpolate(
			animatedValue.value,
			[index - 1, index, index + 1],
			[0.9, 1, 1],
		);
		const opacity = interpolate(
			animatedValue.value,
			[index - 1, index, index + 1],
			[1, 1, 0],
		);
		return {
			transform: [
				{
					translateY: index === prevIndex.value ? translateY2 : translateY,
				},
				{ scale },
			],
			opacity:
				index < currentIndex.value + maxVisibleItems - 1
					? opacity
					: index === currentIndex.value + maxVisibleItems - 1
						? withTiming(1)
						: withTiming(0),
		};
	});

	return (
		<FlingGestureHandler
			key="up"
			direction={Directions.UP}
			onHandlerStateChange={ev => {
				if (ev.nativeEvent.state === State.END) {
					if (currentIndex.value !== dataLength - 1) {
						animatedValue.value = withTiming((currentIndex.value += 1));
						prevIndex.value = currentIndex.value - 1;
						console.log(currentIndex.value);
						console.log(currentIndex.value);
					}
				}
			}}>
			<FlingGestureHandler
				key="down"
				direction={Directions.DOWN}
				onHandlerStateChange={ev => {
					if (ev.nativeEvent.state === State.END) {
						if (currentIndex.value !== 0) {
							animatedValue.value = withTiming((currentIndex.value -= 1));
							prevIndex.value = currentIndex.value + 2;
							console.log(currentIndex.value);
							console.log(currentIndex.value);
						}
					}
				}}>
				<Animated.View className='overflow-hidden' style={[
					styles.image,
					{
						zIndex: dataLength - index,
						height: SCREEN_HEIGHT * 0.75, width: SCREEN_WIDTH * 0.9, borderRadius: 20
					},
					animatedStyle,
				]}>

					<View style={{ backgroundColor: "rgba(215, 168, 152, 0.5)", position: "absolute", top: 13, left: 10, zIndex: 11, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10 }}>
						<Text style={{ fontFamily: FAMILLY.semibold, color: "white", textTransform: "capitalize", fontSize: TEXT_SIZE.small }}> Los angeles - 7km </Text>
					</View>
					<View style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", position: "absolute", bottom: 28, right: 20, zIndex: 11 }}>
						<TouchableOpacity style={{ backgroundColor: "#E55E6F", alignItems: "center", justifyContent: "center", height: 50, width: 50, borderRadius: 50, marginTop: 10 }}><MatchScreenFace /></TouchableOpacity>
						<TouchableOpacity style={{ backgroundColor: "#D7A898", alignItems: "center", justifyContent: "center", height: 50, width: 50, borderRadius: 50, marginTop: 10 }}><MatchScreenHeartWhite /></TouchableOpacity>
						<TouchableOpacity style={{ backgroundColor: "white", alignItems: "center", justifyContent: "center", height: 50, width: 50, borderRadius: 50, marginTop: 10 }}><MatchScreenXmark /></TouchableOpacity>
					</View>

					<LinearGradient colors={["rgba(215, 168, 152, 0)", "rgba(215, 168, 152, 1)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 85, alignSelf: "flex-start", position: "absolute", zIndex: 10, bottom: -2, width: "100%" }} >
						<View className={'px-6'} style={{ flexDirection: "column" }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text className='font-bold' style={{ fontSize: TEXT_SIZE.primary + 4, fontFamily: FAMILLY.semibold, color: "white" }}>{`${item?.match_user?.firstname}, ${age || item?.age || 25} ans` || item?.name}</Text>
							</View>
							<View style={{}}>
								<Text style={{ fontSize: TEXT_SIZE.medium, fontFamily: FAMILLY.light, color: "white" }}>{item?.match_user?.city || item?.location}</Text>
							</View>
						</View>
					</LinearGradient>
					<Pressable style={{backgroundColor: "rgba(215, 168, 152, 0.5)"}} onPress={() => navigation.navigate("MatchConnection", { item })}>
						<Animated.Image
							source={{ uri: `${BaseImageUrl}/${item?.match_user?.user_image}` } || item?.image}
							style={{ height: "100%", width: "100%", borderRadius: 20 }}
							resizeMode={"cover"}
						/>
					</Pressable>
				</Animated.View>

			</FlingGestureHandler>
		</FlingGestureHandler>
	);
};

export default Card;

const styles = StyleSheet.create({
	image: {
		position: 'absolute',
		borderRadius: 20,
	},
});