import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import LinearGradient from 'react-native-linear-gradient'
import { Image } from 'react-native-svg'
import { FAMILLY, TEXT_SIZE } from 'src/utils/constants'
import { calculateAge } from 'src/utils/functions'
import { BaseImageUrl } from '../../utils/constants'
import CustomMatchLoader from '../customMatchLoader'

const MatchListHome = ({ item, index }) => {

    let age = calculateAge(item?.match_user?.user_infos?.qP2)
    if (isFetchingMatch) {
        return <CustomMatchLoader />
    }

    return (
        <Pressable onPress={() => router.navigate("/protected/dating/match-connection", { item })} style={{ flex: 1, position: "relative", alignItems: "center", justifyContent: "center", marginRight: 10, borderRadius: 20, width: 130, overflow: "hidden", marginVertical: 10 }}>
            <LinearGradient colors={["rgba(215, 168, 152, 0)", "rgba(215, 168, 152, 1)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 50, alignSelf: "flex-start", position: "absolute", zIndex: 10, bottom: -5, width: "100%" }} >
                <View style={{ flexDirection: "column", marginLeft: 10 }}>
                    <View style={{ height: 19, flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, color: "white" }}>{item?.match_user?.firstname ? `${item?.match_user?.firstname}...` : item?.name}</Text>
                        <Text style={{ fontSize: TEXT_SIZE.primary - 3, margin: 0, padding: 0, fontFamily: FAMILLY.light, color: "white", marginLeft: 10, marginTop: 3, textAlign: "center", textAlignVertical: "center" }}>{age || item?.age || 25}ans</Text>
                    </View>
                    <View style={{}}>
                        <Text style={{ fontSize: TEXT_SIZE.small - 2, fontFamily: FAMILLY.light, color: "white" }}>{item?.match_user?.city || item?.location}</Text>
                    </View>
                </View>
            </LinearGradient>
            <Image source={item?.match_user?.user_image !== undefined ? { uri: `${BaseImageUrl}/${item?.match_user?.user_image}` } : item?.img} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
        </Pressable>
    )
}

export default MatchListHome