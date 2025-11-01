import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { StyleSheet, Text, View } from 'react-native';
import Application from './src/new-layout/_layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import HelloWorld from './src/app/screens/hello-world';
import Login from './src/app/screens/login';
import Register from './src/app/screens/register';
import RegisterStep2 from './src/app/screens/registerStep2';


export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			{/* <SafeAreaView style={{ flex: 1 }}> */}
				{/* <Application /> */}
			{/* </SafeAreaView> */}
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
