import "../global.css";
import { Text, View, TouchableOpacity, Image, StatusBar, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo, WelcomeImg } from "./components/vectors.js";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FAMILLY, COLORS, TEXT_SIZE } from "../utils/constants.js"
import Home_overlay from "../assets/images/home_overlay.svg"
import { useNavigation } from "@react-navigation/native";
 

const Welcome = () => {
     const navigation = useNavigation()
 
	

	return (
		<View className={'flex-1 bg-white'}>

			<StatusBar backgroundColor="transparent" translucent={true} />

			{/* <View
				className={'relative flex-2 px-0 items-center justify-center bg-white'}
				style={{ paddingBottom: 100 }}
			>
				<View style={{ position: "absolute", zIndex: 9, top: hp("-22%") }}>
					<Home_overlay />
				</View>
				<Image className={'scale-1'}
					source={require('../assets/images/hands.png')}
					resizeMode="cover"
					style={{}}
				/>
			</View> */}
			{/* <Image className={'flex-1'}
				source={require('../assets/images/hands.png')}
				resizeMode="cover"
				style={{}}
			/> */}
			<ImageBackground className={'relative flex-1 items-center justify-start bg-green-100'} source={require('../assets/images/hands.png')} resizeMode="cover">
				<View className={'absolute top-[200px] z-10'}>
					<Logo className={'scale-0.5'} />
				</View>
				<View className={'absolute top-20 z-10 px-10'}>
					<Text className={'text-4xl text-center text-gray-600 font-black uppercase'}>
						Meet Christian singles across the world
					</Text>
				</View>
			</ImageBackground>

			<View className={'relative -top-[60px] flex-2 items-center'}>
				<View className={'mt-4 items-center'}>
					{/* <Text style={{ fontSize: TEXT_SIZE.title * 1.2, color: COLORS.primary, fontWeight: "bold", fontFamily: FAMILLY.semibold, marginVertical: 10 }}>SDLOVE</Text> */}
					{/* <Text style={{ color: COLORS.gray, fontFamily: FAMILLY.regular }}>
						Meet Christian singles across the world
					</Text> */}
				</View>
				<TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ backgroundColor: COLORS.primary, paddingVertical: 15, marginVertical: 20, paddingHorizontal: 20, width: "80%", borderRadius: 100 }}>
					<Text style={{ color: "white", textAlign: "center", fontFamily: FAMILLY.regular }} >Sign In</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ backgroundColor: "transparent", paddingVertical: 10, paddingHorizontal: 20, width: "80%", borderRadius: 100 }}>
					<Text style={{ color: "#D7A898", textAlign: "center", fontFamily: FAMILLY.regular }}>Sign Up</Text>
					{/* <Text className='text-center text-green-600'>Sign Up</Text> */}
				</TouchableOpacity>
			</View>

		</View>

	);
}


export default Welcome