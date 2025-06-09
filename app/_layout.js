import "../global.css";
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './welcome';
import * as Font from "expo-font";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import Login from './screens/login';
import Register from './screens/register';
import RegisterStep2 from './screens/registerStep2';
import SelectPlan from './screens/selectPlan';
import { TouchableOpacity, View, Text } from 'react-native';
import { HeaderBackArrowBlack, HeaderBackArrow, PostScreenXMark, PostScreenMediaVideo, ChatScreenCall, ChatScreenVideo, CustomEditScreenTick } from './components/vectors';
import { COLORS, FAMILLY, TEXT_SIZE } from '../utils/constants';
import HomeTabs from './_bottomTabs';
import { Questionaire, Questionaire2 } from './screens/questionareStep';
import { GlobalVariableProvider, useGlobalVariable } from './context/global';
import { LinearGradient } from "react-native-linear-gradient";
import MatchConnection from './screens/dating/matchConnection';
import MatchProfile from './screens/dating/matchProfile';
import { QuestionaireHeader } from './components/questionaireHeader';
import PostScreen from './screens/posts/posts'
import EditProfileScreen from "./screens/settings/editProfileScreen"
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PostAdd from './screens/posts/postAdd';
import { CustomSemiBoldPoppingText, CustomRegularPoppingText } from './components/text';
import { Image } from 'react-native';
import ChatDiscussion from './screens/chat/chatDiscussion';
import ChatDiscussionOptions from './screens/chat/chatDiscussionOptions';
import NotificationsScreen from './screens/notifications/notifications';
import PostAddHeader from './components/postAddHeader';
import { NavigationContainer } from '@react-navigation/native';
import axios from "axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomMatchHeader from './components/customMatchHeader';
import MatchScreenGrid from './screens/dating/matchScreenGrid';
import MatchScreenBox from './screens/dating/matchScreenBox';
import CustomEditSetting from './components/customEditSetting';
import CustomEditScreenHeader from "./components/customEditScreenHeader"
import CustomSucessScreen from './components/CustomSucessScreen';
import AccountSecurityScreen from './screens/settings/accountSecurity';

import HolderComponent from './components/holder';
import { StatusBar } from "expo-status-bar";

axios.defaults.baseURL = "https://sdlove-api.altechs.africa";
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const queryClient = new QueryClient();

const Stack = createStackNavigator();



export default function Application() {
	const { questionnaireProgress, questioniareLevel, setQuestionaireLevel } = useGlobalVariable()


	const loadFonts = async () => {
		await Font.loadAsync({
			"Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
			"Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
			"Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
			"Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
		});
	};

	const [fontsLoaded, setFontsLoaded] = useState(false);


	useEffect(() => {
		loadFonts().then(() => {
			console.log("font loaded")
			setFontsLoaded(true)

		});
	}, []);

	const theme = {
		...DefaultTheme,
		fonts: {
			regular: {
				fontFamily: "Poppins-Regular",
			},
			medium: {
				fontFamily: "Poppins-Medium",
			},
			light: {
				fontFamily: "Poppins-Light",
			},
			thin: {
				fontFamily: "Poppins-Thin",
			},
		},
	};

	return (
		<NavigationContainer>
			<PaperProvider theme={theme}>
				<GlobalVariableProvider >
					<QueryClientProvider client={queryClient}>

						<Stack.Navigator initialRouteName='Home' screenOptions={{
							headerStyle: {
								elevation: 0,
								shadowOpacity: 0,
								borderBottomWidth: 0
							}

						}}>
							<Stack.Screen options={{
								header: ({ navigation }) => <View style={{ height: 70, backgroundColor: "white" }}></View>
							}} name="Login" component={Login} />

							<Stack.Screen options={{
								headerShown: false
							}} name="Home" component={Welcome} />

							<Stack.Screen options={{
								header: ({ navigation }) => <View style={{ height: 70, backgroundColor: "white" }}></View>
							}} name="Register" component={Register} />

							<Stack.Screen options={{
								header: ({ navigation }) => <View style={{ height: 140, backgroundColor: "white" }}>
									<View style={{ flex: 2, alignItems: "flex-start", justifyContent: "center", flexDirection: "column" }}>
										<TouchableOpacity style={{ marginLeft: 20, flexDirection: "row", padding: 5, alignItems: "center", justifyContent: "center", borderRadius: 20, height: hp(4), width: wp(20), backgroundColor: COLORS.primary }} onPress={() => navigation.goBack()}>
											<HeaderBackArrow />
											<Text style={{ fontSize: TEXT_SIZE.small, marginLeft: 10, color: "white", textAlign: "center" }}>Back</Text>
										</TouchableOpacity>

									</View>
								</View>
							}} name="RegisterStep2" component={RegisterStep2} />

							<Stack.Screen options={{
								header: ({ navigation }) => (
									<View style={{ height: 80, paddingTop: 60, backgroundColor: "white", alignItems: "center", justifyContent: "space-between", flexDirection: "row", padding: 10 }}>

										<View style={{ flexDirection: "row" }}>
											<TouchableOpacity style={{ marginTop: 2, marginRight: 20 }} onPress={() => navigation.goBack()}>
												<HeaderBackArrowBlack />
											</TouchableOpacity>
											<Text style={{ color: COLORS.black, fontFamily: FAMILLY.semibold, fontSize: TEXT_SIZE.title }}>Select a plan</Text>

										</View>

										<TouchableOpacity style={{ borderRadius: 20, height: 25, width: 70, backgroundColor: COLORS.primary, padding: 5, alignItems: "center", justifyContent: "center" }}>
											<Text style={{ color: "white", fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.regular }}>next</Text>
										</TouchableOpacity>
									</View>
								)
							}} name="SelectPlan" component={SelectPlan} />

							<Stack.Screen options={{
								headerShown: false
							}} name="BottomTabsHome" component={HomeTabs} />

							<Stack.Screen options={{
								header: ({ navigation }) => (
									<QuestionaireHeader text={"1/2 Questions générales"} navigation={navigation} />
								)
							}} name="Questionaire" component={Questionaire} />

							<Stack.Screen options={{
								header: ({ navigation }) => (
									<QuestionaireHeader text={"2/2 Questions spirituelles"} navigation={navigation} />
								)
							}} name="Questionaire2" component={Questionaire2} />


							<Stack.Screen options={{
								headerShown: false
							}} name="MatchConnection" component={MatchConnection} />

							<Stack.Screen options={{
								header: ({ navigation }) => <View style={{ height: 50, backgroundColor: "white" }}></View>
							}} name="MatchProfile" component={MatchProfile} />

							<Stack.Screen
								options={{
									header: ({ navigation }) => <CustomMatchHeader navigation={navigation} />
								}}
								name="MatchGrid"
								component={MatchScreenGrid}
							/>

							<Stack.Screen
								options={{
									header: ({ navigation }) => <CustomMatchHeader navigation={navigation} />
								}}
								name="MatchBox"
								component={MatchScreenBox}
							/>

							<Stack.Screen options={{
								header: ({ navigation }) => {
									return <View style={{ height: 70, justifyContent: "center", backgroundColor: "white", paddingLeft: 20, paddingTop: 20 }}>
										<TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
											<HeaderBackArrowBlack />
										</TouchableOpacity>
									</View>
								}
							}} name="Post" component={PostScreen} />

							<Stack.Screen options={{
								header: ({ navigation }) => <PostAddHeader navigation={navigation} />
							}} name="PostAdd" component={PostAdd} />

							<Stack.Screen name="chatDiscussion" component={ChatDiscussion} options={{
								headerShown: false,
							}} />

							<Stack.Screen component={ChatDiscussionOptions} name="ChatDiscussionOptions" options={{
								header: ({ navigation }) => {
									return <View style={{ height: 25, backgroundColor: "white" }}></View>
								}
							}} />

							<Stack.Screen component={EditProfileScreen} name="EditProfileScreen" options={{
								header: ({ navigation }) => <View style={{ backgroundColor: "white", justifyContent: "flex-end", padding: 10, borderBottomColor: COLORS.light, borderBottomWidth: 2, height: 100 }}>

									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<TouchableOpacity onPress={() => navigation.navigate("BottomTabsHome", { screen: "Profile" })} style={{ marginBottom: 5 }}><HeaderBackArrowBlack /></TouchableOpacity>
										<CustomSemiBoldPoppingText style={{ marginLeft: 20 }} color={"black"} fontSize={TEXT_SIZE.title} value="Manage Profile info" />
									</View>

								</View>
							}} />

							<Stack.Screen component={AccountSecurityScreen} name="AccountSecurityScreen" options={{
								header: ({ navigation }) => <View style={{ backgroundColor: "white", justifyContent: "flex-end", padding: 10, borderBottomColor: COLORS.light, borderBottomWidth: 2, height: 100 }}>

									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 5 }}><HeaderBackArrowBlack /></TouchableOpacity>
										<CustomSemiBoldPoppingText style={{ marginLeft: 20 }} color={"black"} fontSize={TEXT_SIZE.title} value="Account & Security" />
									</View>

								</View>
							}} />

							<Stack.Screen component={HolderComponent} name="Holder" options={{
								header: ({ navigation }) => {
									return <View style={{ backgroundColor: "white", justifyContent: "flex-end", padding: 10, borderBottomColor: COLORS.light, borderBottomWidth: 2, height: 100 }}>

										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 5 }}><HeaderBackArrowBlack /></TouchableOpacity>

										</View>

									</View>
								}
							}} />

							<Stack.Screen component={CustomEditSetting} name="CustomEditSetting" options={{
								header: ({ navigation }) => <CustomEditScreenHeader navigation={navigation} />
							}} />

							<Stack.Screen component={CustomSucessScreen} name="CustomSucessScreen" options={{
								headerShown: false
							}} />

							<Stack.Screen component={NotificationsScreen} name="Notifications" options={{
								header: ({ navigation }) => {
									return <View style={{ backgroundColor: "white", justifyContent: "flex-end", padding: 10, borderBottomColor: COLORS.light, borderBottomWidth: 2, height: 100 }}>

										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 5 }}><HeaderBackArrowBlack /></TouchableOpacity>
											<CustomSemiBoldPoppingText style={{ marginLeft: 20 }} color={"black"} fontSize={TEXT_SIZE.title} value="Notifications" />
										</View>

									</View>
								}
							}} />

						</Stack.Navigator>
					</QueryClientProvider>
				</GlobalVariableProvider>
			</PaperProvider>
		</NavigationContainer>
	);
}