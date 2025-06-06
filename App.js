import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { StyleSheet, Text, View } from 'react-native';
import Application from './app/_layout';
 
export default function App() {
  return (
      <Application/>
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
