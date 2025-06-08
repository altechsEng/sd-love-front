import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import HomeFeed from "./screens/homeFeed";
import { COLORS, FAMILLY, TEXT_SIZE } from "../utils/constants";
import { BottomTabsIconActive_Chats, BottomTabsIconActive_Heart, BottomTabsIconActive_Home, BottomTabsIconActive_Learn, BottomTabsIconActive_Profile, BottomTabsIconInactive_Chats, BottomTabsIconInactive_Heart, BottomTabsIconInactive_Home, BottomTabsIconInactive_Learn, BottomTabsIconInactive_Profile, ProfileScreenBars } from "./components/vectors";
import { View, Text, TouchableOpacity, Image } from "react-native"
import { MatchScreenAdress, MatchScreenAdressWithBox, MatchScreenDownArrow, MatchScreenFilters, MatchScreenGridCards, MatchScreenSideCards } from "./components/vectors"
import TopTabs from "./_topTabs"
import MatchScreen from "./screens/match";
import Chat from "./screens/chat/chat";
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "./components/text";
import MatchScreenSide from "./screens/dating/matchScreenSide";
import CustomMatchHeader from "./components/customMatchHeader";
import ProfileScreen from "./screens/profileScreen";
import CustomProfileScreenHeader from "./components/customProfileScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
	return (
		<SafeAreaView className={'flex-1'} style={{ backgroundColor: "white" }}>
			<StatusBar style="dark" />
			<Tab.Navigator
				initialRouteName="Feeds"
				sceneContainerStyle={{ backgroundColor: "white" }}
				screenOptions={{
					tabBarActiveTintColor: COLORS.primary,
					tabBarHideOnKeyboard: true,
					tabBarStyle: {
						height: hp("8%"),
						paddingBottom: hp("1%"),
						paddingTop: hp("1%"),
						shadowOpacity: 0,
						boxShadow: "none",
						borderTopWidth: 0,
						elevation: 0,

					},
					tabBarLabelStyle: {
						fontFamily: FAMILLY.regular,
					},
				}}

			>
				<Tab.Screen
					name="Feeds"
					component={HomeFeed}
					options={{
						tabBarIcon: (({ _, focused }) => (
							focused == false ? <BottomTabsIconInactive_Home /> : <BottomTabsIconActive_Home />
						)),
						tabBarLabelStyle: {
							fontFamily: FAMILLY.regular,
						},
						// header: ({ navigation }) => {
						// 	return <View style={{ height: hp("6%"), backgroundColor: "white" }}></View>
						// }
						headerShown: false
					}}
				/>

				<Tab.Screen
					name="Match"
					component={MatchScreen}
					options={{
						tabBarIcon: (({ _, focused }) => (
							focused == false ? <BottomTabsIconInactive_Heart /> : <BottomTabsIconActive_Heart />
						)),
						tabBarLabelStyle: {
							fontFamily: FAMILLY.regular,
						},
						// header:({navigation}) => <CustomMatchHeader navigation={navigation}/>
						headerShown: false
					}}
				/>

				<Tab.Screen
					name="Learn"
					component={HomeFeed}
					options={{
						tabBarIcon: (({ _, focused }) => (
							focused == false ? <BottomTabsIconInactive_Learn /> : <BottomTabsIconActive_Learn />
						)),
						tabBarLabelStyle: {
							fontFamily: FAMILLY.regular,
						},
						headerShown: false,
					}}
				/>

				<Tab.Screen
					name="Chats"
					component={Chat}
					options={{
						tabBarIcon: (({ _, focused }) => (
							focused == false ? <BottomTabsIconInactive_Chats /> : <BottomTabsIconActive_Chats />
						)),
						tabBarLabelStyle: {
							fontFamily: FAMILLY.regular,
						},
						header: ({ navigation }) => {
							return (
								<View className={'py-2'} style={{ backgroundColor: "white", borderBottomWidth: 2, borderColor: COLORS.light, justifyContent: "center", paddingHorizontal: 20 }}>
									<CustomSemiBoldPoppingText fontSize={TEXT_SIZE.title + 8} value="Chats" style={{ textAlign: "left" }} color={'black'} />
								</View>
							)
						},
					}}
				/>

				<Tab.Screen
					name="Profile"
					component={ProfileScreen}
					options={{
						tabBarIcon: (({ color, focused }) => (
							focused == false ? <BottomTabsIconInactive_Profile /> : <BottomTabsIconActive_Profile />
						)),
						tabBarLabelStyle: {
							fontFamily: FAMILLY.regular,
						},
						header: ({ navigation }) => {
							return <CustomProfileScreenHeader navigation={navigation} />
						}
					}}
				/>

			</Tab.Navigator>
		</SafeAreaView>
	)
}