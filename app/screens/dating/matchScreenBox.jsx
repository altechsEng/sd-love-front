import { LinearGradient } from "react-native-linear-gradient";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import {TouchableOpacity,View,Image,Text} from "react-native"
import { useEffect, useState } from "react";
import { TEXT_SIZE,FAMILLY, defaultProfiles } from "../../../utils/constants";

const MatchScreenBox = ({navigation}) => {

          const [userLocation, setUserLocation] = useState();
         
          const getDistance = (lat1, lon1, lat2, lon2) => {
               const R = 6371; // Earth radius in km
               const dLat = (lat2 - lat1) * Math.PI / 180;
               const dLon = (lon2 - lon1) * Math.PI / 180;
               const a = 
                   Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(lat1 * Math.PI / 180) * 
                   Math.cos(lat2 * Math.PI / 180) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
               const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
               return R * c * 1000; // Distance in meters
           };
           
           
           
            const getColorForDistance = (distance) => {
                if (distance <= 1000) return  "rgba(215, 168, 152, 1)"; // Green
                if (distance <= 1500) return 'rgba(215, 168, 152, 05)'; // Yellow
                return 'rgba(215, 168, 152, 0.2)'; // Red
            };
     
          const requestLocationPermission = async () => {
              
               let {status} = await Location.requestForegroundPermissionsAsync()
               if(status !== 'granted'){
                    console.log("permission denied")  
                    return
               }
     
               let location = await Location.getCurrentPositionAsync({})
               //important note uncomment the real user location when you will have real profiles wiht real data
               setUserLocation({
                    // latitude:location.coords.latitude,
                    // longitude:location.coords.longitude,
                    latitude:37.78825,
                    longitude:-122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
              
         };

              const [mapRegion, setMapRegion] = useState({
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
              });
         
             
useEffect(() => {
     requestLocationPermission();
 }, []);
           
              const renderProfile = ({item})=> (
                   <View key={item.key} style={{borderRadius:20,overflow:"hidden",marginBottom:10,height:200,marginRight:10}}>
                   <LinearGradient colors={["rgba(215, 168, 152, 0)","rgba(215, 168, 152, 1)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:55,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:0,width:"100%"}} >
                   <View style={{flexDirection:"column",marginLeft:10}}>
                   <View style={{ height:19, flexDirection:"row",alignItems:"center"}}>
                   <Text style={{fontSize:TEXT_SIZE.secondary,fontFamily:FAMILLY.semibold,color:"white"}}>{item.name}, </Text>
                   <Text style={{fontSize:TEXT_SIZE.secondary ,margin:0,padding:0,fontFamily:FAMILLY.light,color:"white",marginLeft:10,marginTop:3,textAlign:"center",textAlignVertical:"center"}}>{item.age} ans</Text>
                   </View>
                   <View style={{}}>
                   <Text style={{fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light,color:"white"}}>{item.location}</Text>
                   </View>
                   </View>         
                   </LinearGradient>
                  <TouchableOpacity> 
                   <Image source={item.image} resizeMode="cover" style={{height:"100%",width:"100%"}}/>
                   </TouchableOpacity>
                   </View>
              )



     return           <View style={{flex:1}}>
          
     <View style={{flex: 1}}>
                 {activeScreen == "box" && userLocation && (
                     <MapView
                         style={{flex: 1}}
                         initialRegion={userLocation}
                         showsUserLocation={false}
                     >
                          
         {userLocation && (
             <Marker
                 coordinate={userLocation}
                 anchor={{ x: 0.5, y: 0.5 }}
                  
             >
                 <View style={{
                     backgroundColor: 'white',
                     padding: 3,
                     borderRadius: 30,
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.2,
                     shadowRadius: 4,
                     elevation: 5
                 }}>
                     <View style={{
                         width: 35,
                         height: 35,
                         borderRadius: 25,
                         borderWidth: 3,
                         borderColor: COLORS.primary,  
                         overflow: 'hidden'
                     }}>
                         <Image 
                             source={require('../../../assets/images/match_con1.jpg.jpg')} 
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 resizeMode: 'cover'
                             }}
                         />
                     </View>
                 </View>
             </Marker>
         )}
     
                         {/* Concentric Circles */}
                         <Circle
                             center={userLocation}
                             radius={1000} // 1km
                             fillColor={"rgba(215, 168, 152, 1)"}
           
                             strokeWidth={0}
                         />
                         <Circle
                             center={userLocation}
                             radius={1500} // 3km
                             fillColor="rgba(215, 168, 152, 0.5)"
                              
                             strokeWidth={0}
                         />
                         <Circle
                             center={userLocation}
                             radius={2000} // 5km
                             fillColor="rgba(215, 168, 152, 0.19)"
                             
                             strokeWidth={0}
                         />
     
     
     
                         {/* Profile Markers */}
                         {defaultProfiles.map((profile) => {
         const distance = getDistance(
             userLocation.latitude,
             userLocation.longitude,
             profile.latitude,
             profile.longitude
         );
         
         return (
             <Marker
                 key={profile.key}
                 coordinate={{ 
                     latitude: profile.latitude, 
                     longitude: profile.longitude 
                 }}
                  
             >
                 <View style={{
                     backgroundColor: 'white',
                     padding: 3,
                     borderRadius: 25,
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.2,
                     shadowRadius: 4,
                     elevation: 3
                 }}>
                     <View style={{
                         width: 30,
                         height: 30,
                         borderRadius: 20,
                         borderWidth: 2,
                         borderColor: getColorForDistance(distance),
                         overflow: 'hidden'
                     }}>
                         <Image 
                             source={profile.image} 
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 resizeMode: 'cover'
                             }}
                         />
                     </View>
                 </View>
             </Marker>
         );
     })}
     
                     </MapView>
                 )}
                 
                 
             </View>
     
               </View>
               
}

export default MatchScreenBox