import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { StyleSheet, Text, View } from 'react-native';
import Application from './app/_layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {

 
    
  
	return (
		// <SafeAreaView>
			<GestureHandlerRootView style={{flex:1}}>
				<Application />
			</GestureHandlerRootView>
		// </SafeAreaView>
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


 