import { Text, View, TouchableOpacity, Image,SafeAreaView, StatusBar } from "react-native";
 
import { Logo,WelcomeImg } from "./components/vectors.js";
 
import {FAMILLY,COLORS,TEXT_SIZE} from "../utils/constants.js"
import Home_overlay from "../assets/images/home_overlay.svg"

const  Welcome = () => ({navigation}) => {


 

  return (
 
        <SafeAreaView style={{flex:1,flexDirection:"column"}}>
    <StatusBar backgroundColor="transparent" translucent={true}/>
 
   <View style={{flex:2,alignItems:"center",position:"relative",justifyContent:"center",backgroundColor:"white",paddingBottom:100}}>
  <View style={{position:"absolute",zIndex:9,top:-150}}>
    <Home_overlay/>
  </View>
   <Image
             source={require('../assets/images/hands.png')}
             resizeMode="contain"
            style={{}}
    />
 
 <View style={{position:"absolute",bottom:0,zIndex:10}}>
  <Logo/>  
 
  </View>
   </View>


 
   <View style={{alignItems:"center",flex:1,backgroundColor:"white"}}>
          
   <View style={{alignItems:"center"}}>
     <Text style={{fontSize:TEXT_SIZE.title * 1.2,color:COLORS.primary,fontWeight:"bold",fontFamily:FAMILLY.semibold,marginVertical:10}}>SDLOVE</Text>
     <Text style={{color:COLORS.gray,fontFamily:FAMILLY.regular}}>
       Meet Christian singles across the world
     </Text>
     </View>

     <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{backgroundColor:COLORS.primary, paddingVertical:10,marginVertical:20,paddingHorizontal:20,width:"80%", borderRadius:100}}>
       <Text style={{color:"white",textAlign:"center",fontFamily:FAMILLY.regular}} >Sign In</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{backgroundColor:"transparent", paddingVertical:10,paddingHorizontal:20,width:"80%", borderRadius:100}}>
       <Text style={{color:"#D7A898",textAlign:"center",fontFamily:FAMILLY.regular}}>Sign Up</Text>
     </TouchableOpacity>
   </View>
 
    </SafeAreaView>
  
  );
}


export default Welcome