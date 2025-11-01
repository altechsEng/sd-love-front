import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import CustomPostLoader from '../customPostLoader'
import { Image } from 'react-native-svg'
import { router } from 'expo-router'
import { HomeFeedComment, HomeFeedHeart, PostScreenBookMark, PostScreenDots } from '../vectors'
import { COLORS, FAMILLY, TEXT_SIZE, BaseImageUrl } from '../../utils/constants';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

dayjs.extend(relativeTime)

const PostList = ({ item, index, isFetching, handleBookMark }) => {

    if (isFetching) {
        return <CustomPostLoader />
    }

    if (!item) {
        return (
            <View style={{ height: hp("60%"), alignItems: "center", justifyContent: "center" }}>
                <View style={{ marginBottom: 15, borderRadius: "100%", alignItems: "center", justifyContent: "center" }}>
                    <FontAwesome name="newspaper-o" size={64} color="gray" />
                </View>
                <CustomSemiBoldPoppingText value={`No post found`} style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.primary + 2} color={"black"} />
            </View>
        )
    }

    return (
        <View key={item?.key} style={{ flex: 1, marginVertical: 20, marginRight: 20, flexDirection: "column" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                <View clasName='' style={{ flex: 2, flexDirection: "row" }}>
                    <TouchableOpacity style={{ borderRadius: 50, height: 40, width: 40, overflow: "hidden", alignItems: "center" }}><Image source={item?.user?.user_image ? { uri: `${BaseImageUrl}/${item?.user?.user_image}` } : require("../../../../assets/images/test_person1.png")} resizeMode="cover" style={{ height: "100%", width: "100%" }} /></TouchableOpacity>
                    <View className='justify-center' style={{ marginLeft: 10 }}>
                        <Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, lineHeight: 20 }}>{item?.user?.firstname} {item?.user?.lastname}</Text>
                        <Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(item?.created_at).fromNow() || "2h ago"}</Text>
                    </View>
                </View>
                <TouchableOpacity >
                    <PostScreenDots />
                </TouchableOpacity>
            </View>

            <Pressable onPress={() => router.navigate("/protected/posts/posts", { item })} style={{ margin: 0, padding: 0, overflow: "hidden" }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ lineHeight: 22, color: COLORS.black, fontSize: TEXT_SIZE.primary, fontWeight: FAMILLY.light }}>
                        {item?.text}
                    </Text>
                </View>
                {item?.media?.length > 0 &&
                    <View className='relative'>
                        <Image source={item?.media?.length > 0 ? { uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.media[0]?.url}` } : <></>} resizeMode="cover" style={{ width: "100%", height: 280, borderRadius: 20 }} />
                        {item?.media?.length > 1 &&
                            <View className='absolute flex flex-row items-center justify-center' style={{ bottom: 10, right: 10, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                                <Text style={{ color: "white", fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.semibold }}>+{item?.media?.length - 1}</Text>
                                <Ionicons className='ml-2' name="images-outline" size={16} color="white" />
                            </View>
                        }
                    </View>
                }
            </Pressable>
            <View style={{ height: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                    <View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity>
                            {item?.is_liked ? <HomeFeedHeart stroke={COLORS.primary} fill={COLORS.primary} /> : <HomeFeedHeart stroke={"#2E2E2E"} fill={"white"} />}
                        </TouchableOpacity>
                        <Text style={{ fontFamily: FAMILLY.light, marginLeft: 5 }}>{item?.likes_count || ''}</Text>
                    </View>

                    <View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => router.navigate("Post", { item })}><HomeFeedComment stroke={"#2E2E2E"} fill={"white"} /></TouchableOpacity>
                        <Text style={{ fontFamily: FAMILLY.light, marginLeft: 5 }}>{item?.comment_count || ''}</Text>
                    </View>

                    {/* <View style={{ marginRight: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity><HomeFeedShare fill={"gray"} /></TouchableOpacity>
                <Text style={{ fontFamily: FAMILLY.light, marginLeft: 8 }}>825</Text>
              </View> */}
                </View>

                <TouchableOpacity
                    onPress={() => handleBookMark(item?.id)}
                >
                    <PostScreenBookMark />
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default PostList