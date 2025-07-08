import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../components/text';
import { MatchConnectionBackArrow, MatchConnectionHeart } from '../../components/vectors';
import { BaseImageUrl, COLORS, TEXT_SIZE } from '../../../utils/constants';
import React, { useEffect } from 'react'
import { View, Dimensions, Image, TouchableOpacity } from "react-native"
import { LinearGradient } from "react-native-linear-gradient";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from '@react-navigation/native';
import { useGlobalVariable } from '../../context/global';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function engagementRequestSent({ navigation }) {

     const { item } = useRoute().params
     const { userData, image } = useGlobalVariable()
     const maleImage = item?.match_user?.user_infos?.qP1 === "Homme" ? `${BaseImageUrl}/${item?.match_user?.user_image}` : image
     const femaleImage = item?.match_user?.user_infos?.qP1 === "Femme" ? `${BaseImageUrl}/${item?.match_user?.user_image}` : image

     useEffect(() => {
          console.log(image, "user data....", item?.score, item)
     }, [])

     return (
          <View style={{ backgroundColor: "white", alignItems: "center", flex: 1 }}>
               <LinearGradient colors={["rgba(215, 168, 152, 1)", "rgba(255, 255, 255, 0.03)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: SCREEN_HEIGHT * 0.6, width: "100%", position: "relative" }} >
                    <View style={{ paddingHorizontal: 20, backgroundColor: "" }}>
                         <View style={{ height: 60 }}></View>
                         {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
                              <MatchConnectionBackArrow />
                         </TouchableOpacity> */}
                    </View>

                    <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(25), height: 275, width: 275, borderRadius: "100%", overflow: 'hidden', backgroundColor: 'rgba(215, 168, 152, 0.35)' }}></View>
                    </View>
                    <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(27.7), height: 230, width: 230, borderRadius: "100%", overflow: 'hidden', backgroundColor: 'rgba(215, 168, 152, 0.35)' }}>
                              <Image source={{ uri: `${femaleImage}` } || require('../../../assets/images/test_match1.jpg')} style={{ borderRadius: 20, width: "100%", height: "100%" }} resizeMode='cover' />
                         </View>
                    </View>
                    <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(22), height: 330, width: 330, borderRadius: "100%", borderColor: '#D7A898', borderWidth: 1 }}></View>
                    </View>
                    {/* <View style={{ position: "absolute", alignSelf: "center" }}>
                         <View style={{ top: hp(10), height: 580, width: 580, borderRadius: "100%", borderColor: '#D7A898', borderWidth: 1, borderStyle: "dashed" }}></View>
                    </View> */}

               </LinearGradient>

               <View style={{ alignItems: "center", width: "85%", justifyContent: "center", marginTop: 50 }}>
                    <CustomSemiBoldPoppingText style={''} value={`Engament request sent`} color={COLORS.primary} fontSize={TEXT_SIZE.title} />
                    <CustomRegularPoppingText style={{ textAlign: "center", width: "80%", margin: "auto" }}
                         value={`${item?.match_user?.firstname} has received your engagement request.`} color="#5E5E5E" fontSize={TEXT_SIZE.medium} />
               </View>

               {/* <TouchableOpacity style={{ marginTop: 50, width: "80%", paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.primary }}>
                    <CustomRegularPoppingText fontSize={TEXT_SIZE.small + 2} value={`Engage with ${item?.match_user?.firstname}`} style={{ textAlign: "center" }} color={"white"} />
               </TouchableOpacity> */}

               <TouchableOpacity onPress={() => navigation.navigate("Match")} style={{ marginTop: 20, width: "80%", paddingVertical: 10, borderRadius: 20, backgroundColor: "rgba(215, 168, 152, 0.13)" }}>
                    <CustomRegularPoppingText fontSize={TEXT_SIZE.small + 2} value="View profile" style={{ textAlign: "center" }} color={COLORS.primary} />
               </TouchableOpacity>
          </View>
     )
}