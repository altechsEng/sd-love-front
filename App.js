import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { StyleSheet, Text, View } from 'react-native';
import Application from './app/_layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
	return (
		<GestureHandlerRootView>
			<Application />
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
