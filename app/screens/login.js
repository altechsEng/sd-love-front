import { Text, View, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, StatusBar, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Logo, WelcomeImg, TextInputPerson, TextInputLock, TextInputEye } from "../components/vectors.js";
import { FAMILLY, COLORS, TEXT_SIZE } from "../../utils/constants.js"
import { ScrollView } from "react-native-gesture-handler";
import CustomTextInput from "../components/textInput.jsx";

import { useGlobalVariable } from "../context/global.jsx";
import { CustomRegularPoppingText } from "../components/text.jsx";
import axios from "axios";
import { deviceName } from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
	const { err, setErr } = useGlobalVariable()
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [password, setPassword] = useState("")

	useEffect(() => {
		setTimeout(() => setErr(""), 5000)
	}, [err])

	//  useEffect(()=>{
	//     navigation.navigate("BottomTabsHome")
	//     console.log("called")
	//   },[])

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
		return regex.test(email);
	};




	const handleSubmission = async () => {

		setIsLoading(true)
		if (password == "" || email == "") {
			setErr("Fill all the information.")
			setIsLoading(false)
			return
		} else if (password.length < 8) {
			setErr("Password must be at least 8 characters")
			setIsLoading(false)
			return
		} else if (!validateEmail(email)) {
			setErr("Please enter a valid email address!");
			setIsLoading(false)
			return
		}

		let data = { email: email.trim(), password: password.trim(), device_name: deviceName }
		console.log(data, "datapppop")


		await axios.get("/sanctum/csrf-cookie").then((response) => {
			axios
				.post(`/api/login/en`, data)
				.then(async (res) => {


					if (res.data.error || res.data.status == 500 || res.data.status === 401) {
						setErr(res.data.message)
						setIsLoading(false)

					} else if (res.data.status === 200) {

						await AsyncStorage.setItem("user_id", JSON.stringify(res.data?.user_id));
						let id = JSON.stringify(res.data?.device_id)
						await AsyncStorage.setItem(
							"device_id",
							id || ""
						);
						await AsyncStorage.setItem("user_token", res.data?.user_token);
						let info = JSON.stringify({
							user: res.data?.user_data?.user,
							user_info: res.data?.user_data?.user_info,
							user_image: `https://sdlove-api.altechs.africa/storage/app/private/public/user_images/${res.data?.user_image}` || null
						})
						await AsyncStorage.setItem("user_data", info)



						navigation.navigate("BottomTabsHome")
						setIsLoading(false)
					}
				})
				.catch(function (error) {
					console.log(error.message, error, " in login", error.response, Object.keys(error))
					setErr(error.message)
					setIsLoading(false)

				});
		});

	}

	return (
		<SafeAreaView className={'flex-1 bg-white'}>
			<StatusBar style="light" />
			<View style={{ flex: 2, height: 70 }}></View>

			<View className={'relative'} style={{ alignItems: "center" }}>
				<Logo />
				<Text style={{ fontSize: TEXT_SIZE.title * 1.6, color: COLORS.primary, fontWeight: "bold", fontFamily: FAMILLY.semibold, marginVertical: 10 }}>SDLOVE</Text>
				<Text style={{ fontSize: TEXT_SIZE.title * 1.2, color: COLORS.gray, fontWeight: "bold", fontFamily: FAMILLY.semibold, marginVertical: 10, marginBottom: 30 }}>Sign in</Text>


				<View style={{ position: "relative", borderRadius: 50, paddingVertical: 0, paddingHorizontal: 36, width: "80%", backgroundColor: "rgba(181, 181, 181, 0.12)", }}>
					<CustomTextInput RightIconStyles={null} secure={false} name="email" placeHolder="Email" LeftIcon={"person"} LeftIconStyles={{ position: "absolute", top: 15, left: 18 }} RightIcon={null} setState={setEmail} state={email} />
					{/* <View style={{position:"absolute",top:15,left:18}}>
            	<TextInputPerson/>
					</View> */}
					{/* <TextInput
						style={{ 
						marginTop:3,
						height:25,
						fontSize: TEXT_SIZE.primary,
						fontFamily: FAMILLY.regular,
						color:"#818181"
					}}
						
						placeholderTextColor="#818181"
						placeholder="Email"
						onChangeText={(text) => setEmail(text)}
						name="email">
					</TextInput> */}
				</View>

				<View style={{ position: "relative", marginVertical: 15, borderRadius: 50, paddingVertical: 0, paddingHorizontal: 36, width: "80%", backgroundColor: "rgba(181, 181, 181, 0.12)", }}>
					<CustomTextInput secure={true} name="password" placeHolder="Password" LeftIcon={"lock"} LeftIconStyles={{ position: "absolute", top: 15, left: 18 }} RightIcon={"eye"} RightIconStyles={{ position: "absolute", top: 12, right: 18 }} setState={setPassword} state={password} />
					{/* <View style={{position:"absolute",top:15,left:18}}>
          <TextInputLock/>
          </View> */}
					{/* <TouchableOpacity style={{position:"absolute",top:12,right:18}}>
          <TextInputEye/>
          </TouchableOpacity> */}

					{/* <TextInput
            style={{
            marginTop:3,
            height:25, 
            fontSize: TEXT_SIZE.primary,
            fontFamily: FAMILLY.regular,
            color:"#818181",
            }}
            placeholderTextColor="#818181"
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            name="password"
                      ></TextInput> */}
				</View>



				<View style={{ marginTop: 10, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
					<Text style={{ fontSize: TEXT_SIZE.secondary, color: COLORS.gray, fontFamily: FAMILLY.regular }}>Forgot password ? </Text>
					<TouchableOpacity style={{ marginTop: 1 }}>
						<Text style={{ fontSize: TEXT_SIZE.secondary, color: COLORS.primary, fontFamily: FAMILLY.regular }}>Reset</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity className={'mb-5'} onPress={() => handleSubmission()} style={{ backgroundColor: COLORS.primary, paddingVertical: 15, marginTop: 20, paddingHorizontal: 20, width: "75%", borderRadius: 100 }}>
					{isLoading === true ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", textAlign: "center", fontFamily: FAMILLY.regular }} >Login</Text>}
				</TouchableOpacity>

				{err !== "" ? <CustomRegularPoppingText className={'relative'} fontSize={TEXT_SIZE.mediun} color={COLORS.red} value={err} /> : null}
			</View>


			<View className={''} style={{ flex: 3, height: 118, justifyContent: "flex-end" }}>


				<View className={'pb-8'} style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
					<Text style={{ fontSize: TEXT_SIZE.secondary, color: COLORS.gray, fontFamily: FAMILLY.regular }}>Don't have an account ? </Text>
					<TouchableOpacity style={{ marginTop: 1 }} onPress={() => navigation.navigate("Register")}>
						<Text style={{ fontSize: TEXT_SIZE.secondary, color: COLORS.primary, fontFamily: FAMILLY.regular }}>Sign up here</Text>
					</TouchableOpacity>
				</View>
			</View>

		</SafeAreaView>

	);
}


export default Login