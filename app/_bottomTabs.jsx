import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import HomeFeed from "./screens/homeFeed";
import { COLORS, FAMILLY, TEXT_SIZE } from "../utils/constants";
import { BottomTabsIconActive_Chats, BottomTabsIconActive_Heart, BottomTabsIconActive_Home, BottomTabsIconActive_Learn, BottomTabsIconActive_Profile, BottomTabsIconInactive_Chats, BottomTabsIconInactive_Heart, BottomTabsIconInactive_Home, BottomTabsIconInactive_Learn, BottomTabsIconInactive_Profile } from "./components/vectors";
import {View,Text,TouchableOpacity} from "react-native"
import { MatchScreenAdress, MatchScreenAdressWithBox, MatchScreenDownArrow, MatchScreenFilters, MatchScreenGridCards, MatchScreenSideCards } from "./components/vectors"
import TopTabs from "./_topTabs"
import MatchScreen from "./screens/match";
import Chat from "./screens/chat/chat";
import { CustomSemiBoldPoppingText } from "./components/text";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
     return (
          <Tab.Navigator
                    initialRouteName="Feeds"
                    sceneContainerStyle={{ backgroundColor: "white" }}
                    screenOptions={{
                      tabBarActiveTintColor: COLORS.primary,
                      tabBarHideOnKeyboard: true,
                      tabBarStyle: {
                        height: hp("7.5%"),
                        paddingBottom: hp("1%"),
                        paddingTop: hp("1%"),
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
                                  tabBarIcon:(({_,focused}) => (
                                    focused == false ? <BottomTabsIconInactive_Home/>:<BottomTabsIconActive_Home/>
                                  )),
                                  tabBarLabelStyle: {
                                    fontFamily: FAMILLY.regular,
                                  },
                                  header:({navigation}) => {
                                    return <View style={{height:70,backgroundColor:"white" }}></View>
                                  }
                                }}
                              />

                              <Tab.Screen
                                name="Match"
                                component={MatchScreen}
                                options={{
                                  // header:({navigation}) => {
                                  //   return <View style={{backgroundColor:"white",padding:20}}>
                                  //               <View style={{height:50 }}></View>
                                  //               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                  //               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
                                  //                    <TouchableOpacity style={{marginRight:10}}><MatchScreenAdress/></TouchableOpacity>
                                  //                    <Text style={{color:COLORS.black,fontFamily:FAMILLY.medium,textTransform:"capitalize"}}>Chicago</Text>
                                  //                    <TouchableOpacity style={{ marginLeft:5}}><MatchScreenDownArrow/></TouchableOpacity>
                                  //               </View>
                                      
                                  //               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
                                  //                    <TouchableOpacity style={{marginRight:10}}><MatchScreenSideCards stroke={"#D7A898"}/></TouchableOpacity>
                                  //                    <TouchableOpacity style={{marginRight:5}}><MatchScreenGridCards/></TouchableOpacity>
                                  //                    <TouchableOpacity style={{marginRight:10}}><MatchScreenAdressWithBox/></TouchableOpacity>
                                  //                    <TouchableOpacity style={{marginRight:0}}><MatchScreenFilters/></TouchableOpacity>
                                  //               </View>
                                  //               </View>
                                  //   </View>
                                  // },
                                  tabBarIcon:(({_,focused}) => (
                                    focused == false ? <BottomTabsIconInactive_Heart/>:<BottomTabsIconActive_Heart/>
                                  )),
                                  tabBarLabelStyle: {
                                    fontFamily: FAMILLY.regular,
                                  },
                                  headerShown:false
                              
                                }}
                              />


                            <Tab.Screen
                                name="Learn"
                                component={HomeFeed}
                                options={{
                                  tabBarIcon:(({_,focused}) => (
                                    focused == false ? <BottomTabsIconInactive_Learn/>:<BottomTabsIconActive_Learn/>
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
                                  tabBarIcon:(({_,focused}) => (
                                    focused == false ? <BottomTabsIconInactive_Chats/>:<BottomTabsIconActive_Chats/>
                                  )),
                                  tabBarLabelStyle: {
                                    fontFamily: FAMILLY.regular,
                                  },
                                  header:({navigation}) => {
                                    return <View style={{backgroundColor:"white",borderBottomWidth:2,borderColor:COLORS.light,justifyContent:"center",paddingHorizontal:20}}>
                                       
                                      <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.title+3} value="Chats" style={{textAlign:"left",marginTop:50}} color={'black'}/>
                                    
                                    
                                    </View>
                                  },
                                }}
                              />


                               <Tab.Screen
                                name="Profile"
                                component={HomeFeed}
                                options={{
                                  tabBarIcon:(({color,focused}) => (
                                    focused == false ? <BottomTabsIconInactive_Profile/>:<BottomTabsIconActive_Profile/>
                                  )),
                                  tabBarLabelStyle: {
                                    fontFamily: FAMILLY.regular,
                                  },
                                  headerShown: false,
                                }}
                              />
                  
                  </Tab.Navigator>
     )
}