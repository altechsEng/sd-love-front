import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../app/components/text';
import { MatchConnectionBackArrow, MatchConnectionHeart } from '../../components/vectors';
import { BaseImageUrl, COLORS, TEXT_SIZE } from '../../../utils/constants';
import React, { useEffect, useState } from 'react'
import { View, Dimensions, Image, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from "react-native-linear-gradient";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from '@react-navigation/native';
import { useGlobalVariable } from '../../context/global';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function MatchConnection({ navigation }) {

     const { item } = useRoute().params
     const { userData, image } = useGlobalVariable()
     const maleImage = item?.match_user?.user_infos?.qP1 === "Homme" ? `${BaseImageUrl}/${item?.match_user?.user_image}` : image;
     const femaleImage = item?.match_user?.user_infos?.qP1 === "Femme" ? `${BaseImageUrl}/${item?.match_user?.user_image}` : image;
     const [buttonLoading, setButtonLoading] = useState(false);
     const [hasEngagementRequest, setHasEngagementRequest] = useState(false);
     const [engagementRequest, setEngagementRequest] = useState();
     const [err, setErr] = useState("");

     useEffect(() => {
          console.log(image, "user data....", item?.score, item)
          checkEngagement();
     }, [])

     const requestEgagement = async () => {
          let token = await AsyncStorage.getItem("user_token");
          let data = { matchId: item.match_id }

          setButtonLoading(true);

          if (token) {
               axios
                    .post(`/api/request-engagement`, data, { headers: { "Authorization": `Bearer ${token}` } })
                    .then(async (res) => {
                         if (res.data.error || res.data.status == 500 || res.data.status === 401) {
                              setErr(res.data.message)
                              setButtonLoading(false)

                         } else if (res.data.status === 200) {
                              setButtonLoading(false)
                              setHasEngagementRequest(true)
                              setEngagementRequest(res.data?.engagement_request)
                              navigation.navigate("EngagementRequestSent", { item })
                         }
                    })
                    .catch(function (error) {
                         console.log(error.message, error, " in request engagement", error.response, Object.keys(error))
                         setButtonLoading(false)
                    });
          } else {
               console.log('Not logged it');
          }
     }

     const cancelEgagementReauest = async () => {
          let token = await AsyncStorage.getItem("user_token");
          let data = { requestId: engagementRequest.id }

          setButtonLoading(true);

          if (token) {
               axios
                    .post(`/api/cancel-engagement-request`, data, { headers: { "Authorization": `Bearer ${token}` } })
                    .then(async (res) => {
                         if (res.data.error || res.data.status == 500 || res.data.status === 401) {
                              setErr(res.data.message)
                              setButtonLoading(false)

                         } else if (res.data.status === 200) {
                              setButtonLoading(false)
                              setEngagementRequest([])
                              setHasEngagementRequest(false)
                         } else if (res.data.status === 404) {
                              setButtonLoading(false)
                              setErr(res.data.message)
                         }
                    })
                    .catch(function (error) {
                         console.log(error.message, error, " in request engagement", error.response, Object.keys(error))
                         setButtonLoading(false)
                    });
          } else {
               console.log('Not logged it');
          }
     }

     const checkEngagement = async () => {
          let token = await AsyncStorage.getItem("user_token");
          let data = { matchId: item.match_id }

          setButtonLoading(true);

          if (token) {
               axios
                    .post(`/api/check-engagement-request`, data, { headers: { "Authorization": `Bearer ${token}` } })
                    .then(async (res) => {
                         if (res.data.status == 200) {
                              setHasEngagementRequest(true)
                              setEngagementRequest(res.data?.engagement_request)
                              setButtonLoading(false)
                         } else if (res.data.status == 404) {
                              setHasEngagementRequest(false)
                              setButtonLoading(false)
                         }
                    })
                    .catch(function (error) {
                         console.log(error.message, error, " in request engagement", error.response, Object.keys(error))
                         setButtonLoading(false)
                    });
          } else {
               console.log('Not logged it');
          }
     }

     return (
          <View style={{ backgroundColor: "white", alignItems: "center", flex: 1 }}>

               <LinearGradient colors={["rgba(215, 168, 152, 1)", "rgba(255, 255, 255, 0.03)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: SCREEN_HEIGHT * 0.6, width: "100%", position: "relative" }} >
                    <View style={{ paddingHorizontal: 20, backgroundColor: "" }}>
                         <View style={{ height: 60 }}></View>
                         <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
                              <MatchConnectionBackArrow />
                         </TouchableOpacity>
                    </View>

                    <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(25), height: 275, width: 275, borderRadius: "100%", backgroundColor: 'rgba(215, 168, 152, 0.35)' }}></View>
                    </View>

                    <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(22), height: 330, width: 330, borderRadius: "100%", borderColor: '#D7A898', borderWidth: 1 }}></View>
                    </View>


                    <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(10), height: 580, width: 580, borderRadius: "100%", borderColor: '#D7A898', borderWidth: 1, borderStyle: "dashed" }}></View>
                    </View>

                    <CustomSemiBoldPoppingText style={{ textAlign: "center", marginVertical: 20 }} color="#D0917B" fontSize={TEXT_SIZE.title + 8} value={`${item?.score}%` || "89%"} />

                    <View style={{ position: "relative", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                         <View style={{ transform: [{ rotate: "-4.58deg" }], position: "absolute", top: hp(2), left: 40, zIndex: 8, overflow: "hidden", height: 240, width: 170, borderRadius: 20, padding: 3, backgroundColor: "white" }}>
                              <Image source={{ uri: `${maleImage}` } || require('../../../assets/images/match_con1.jpg.jpg')} style={{ borderRadius: 20, width: "100%", height: "100%" }} resizeMode='cover' />
                         </View>

                         <View className='border-2 border-white' style={{ position: "absolute", top: hp(18), zIndex: 11, alignItems: "center", justifyContent: "center", height: 50, width: 50, borderRadius: 50, backgroundColor: COLORS.red }}>
                              <MatchConnectionHeart />
                         </View>

                         <View style={{ position: "absolute", top: hp(8), right: 40, transform: [{ rotate: "11deg" }], zIndex: 10, overflow: "hidden", height: 240, width: 170, borderRadius: 20, padding: 3, backgroundColor: "white" }}>
                              <Image source={{ uri: `${femaleImage}` } || require('../../../assets/images/test_match1.jpg')} style={{ borderRadius: 20, width: "100%", height: "100%" }} resizeMode='cover' />
                         </View>
                    </View>

               </LinearGradient>

               <View style={{ alignItems: "center", width: "85%", justifyContent: "center", marginTop: 50 }}>
                    <CustomSemiBoldPoppingText style={''} value={`it is a match, ${userData?.firstname}`} color="black" fontSize={TEXT_SIZE.title} />
                    <CustomRegularPoppingText style={{ textAlign: "center", width: "80%", margin: "auto" }}
                         value={`You and ${item?.match_user?.firstname} ${item?.match_user?.lastname} have matched, start a conversation with each other now.`} color="#5E5E5E" fontSize={TEXT_SIZE.medium} />
               </View>

               {hasEngagementRequest
                    ?
                    <TouchableOpacity className='flex items-center ' onPress={() => cancelEgagementReauest()} style={{ marginTop: 50, width: "80%", paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.primary }}>
                         {buttonLoading ?
                              <AntDesign className='animate-spin' name="loading2" size={24} color="white" />
                              :
                              <View className='flex flex-row justify-center gap-1'>
                                   <Feather name="x" size={18} color="white" />
                                   <CustomRegularPoppingText fontSize={TEXT_SIZE.small + 2} value={`Cancel request`} style={{ textAlign: "center" }} color={"white"} />
                              </View>
                         }
                    </TouchableOpacity>
                    :
                    <TouchableOpacity className='flex items-center ' onPress={() => requestEgagement()} style={{ marginTop: 50, width: "80%", paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.primary }}>
                         {buttonLoading ?
                              <AntDesign className='animate-spin' name="loading2" size={24} color="white" />
                              :
                              <CustomRegularPoppingText fontSize={TEXT_SIZE.small + 2} value={`Engage with ${item?.match_user?.firstname}`} style={{ textAlign: "center" }} color={"white"} />
                         }
                    </TouchableOpacity>
               }

               <TouchableOpacity onPress={() => navigation.navigate("MatchProfile", { item })} style={{ marginTop: 10, width: "80%", paddingVertical: 10, borderRadius: 20, backgroundColor: "rgba(215, 168, 152, 0.13)" }}>
                    <CustomRegularPoppingText fontSize={TEXT_SIZE.small + 2} value="View profile" style={{ textAlign: "center" }} color={COLORS.primary} />
               </TouchableOpacity>
          </View >
     )
}