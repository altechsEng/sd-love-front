import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../app/components/text'
import { ChatScreenDownArrow, ChatScreenUpArrow } from '../../components/vectors'
import { BaseImageUrl, COLORS, TEXT_SIZE } from '../../../utils/constants'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useGlobalVariable } from '../../context/global'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useChat } from '../../context/ChatContext'


dayjs.extend(relativeTime)
const Chat = ({ navigation }) => {
    const [showDesingaged, setShowDesingaged] = useState(false)
    const [desingagedChats, setDesigngagedChats] = useState([{
        id: "grid1id",
        img: require("../../../assets/images/grid3.png"),
        name: "Cassandra Hub"
    },
    {
        id: "grid2id",
        img: require("../../../assets/images/grid2.png"),
        name: "Rosie"
    }])

    // const { conversations } = useChat();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userData } = useGlobalVariable()


    const getConversations = async () => {
        try {
            let token = await AsyncStorage.getItem("user_token");
            const response = await axios.get('/api/conversations', { headers: { "Authorization": `Bearer ${token}` } });
            //     console.log(response.data,"response data converstaion")
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations-:', error?.request);
            throw error;
        }
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations();
                setConversations(data.data);
                console.log(data.data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

        // Refresh conversations every 30 seconds
        // const interval = setInterval(fetchConversations, 3000);
        // return () => clearInterval(interval);
    }, [userData?.id]);

    const renderDesingagedChat = ({ item }) => {
        return (
            <View style={{ flex: 1, marginBottom: 10, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{}}>
                    <View style={{ height: 50, width: 50, borderRadius: 50, overflow: "hidden" }}>
                        <Image source={item?.avatar ? { uri: `${BaseImageUrl}/${item?.avatar}` } : require("../../../assets/images/test_match1.jpg")} style={{ height: "100%", width: "100%" }} />
                    </View>

                </View>

                <View style={{ flex: 4, marginLeft: 10 }}>
                    <CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value={item.name} />
                    <CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.small} value={`You cannot send messages to ${item.name} anymore..`} />
                </View>
            </View>
        );
    }

    const renderConversations = ({ item }) => {

        return (
            <TouchableOpacity onPress={() => navigation.navigate("chatDiscussion", { item })} style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ position: "relative" }}>
                    <View style={{ height: 50, width: 50, borderRadius: 50, overflow: "hidden" }}>
                        <Image source={item?.avatar ? { uri: `${BaseImageUrl}/${item?.avatar}` } : require("../../../assets/images/test_match1.jpg")} style={{ height: "100%", width: "100%" }} />
                    </View>
                    <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: "green", zIndex: 5, position: "absolute", top: 2, right: 2 }}></View>
                </View>

                <View style={{ flex: 5, marginLeft: 10 }}>
                    <CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value={item?.name ? `${item?.name}` : "Maggy MacLeen"} />
                    <CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.small} value={item?.last_message ? item?.last_message?.content : "....."} />
                </View>

                <View onPress={() => navigation.navigate("Notifications")} style={{ flex: 0.7, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {item?.unread_count > 0 &&
                        <View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: COLORS.primary, alignItems: "center" }}>
                            <CustomSemiBoldPoppingText style={{}} color={"white"} fontSize={TEXT_SIZE.secondary} value={`${item?.unread_count}`} />
                        </View>
                    }
                    <View>
                        {/* <CustomRegularPoppingText style={{}} color={COLORS.primary} fontSize={TEXT_SIZE.small} value={item?.last_message ? item?.last_message?.sent_at : "10:50"} /> */}
                        <CustomRegularPoppingText style={{}} color={item?.unread_count == 0 ? COLORS.black : COLORS.primary} fontSize={TEXT_SIZE.small} value={item?.last_message ? dayjs(item?.last_message?.sent_at).format("HH:mm") : "10:50"} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View className={'bg-white'} style={{ flex: 1 }}>
            {/* Screen Header */}
            <View clasName={'flex flex-row items-center justify-between py-4'} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, backgroundColor: "white", position: "relative", borderBottomWidth: 0, borderColor: COLORS.light }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingLeft: 20 }}>
                    <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.title + 8} value="Chats" style={{ textAlign: "left" }} color={'black'} />
                </View>

                <View clasName={'gap-8'} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingRight: 20 }}>
                    <TouchableOpacity className='p-2 rounded-full bg-black/10' onPress={() => navigation.navigate("EngagementRequests")} style={{ marginLeft: 20, }}>
                        <Ionicons name="person-add-outline" size={24} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Connversations list */}
            {conversations.length > 0 &&
                <View>
                    <FlatList

                        data={conversations.filter((item) => item?.engagement?.status === "ongoing")}
                        renderItem={renderConversations}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item?.id}
                    />

                    <View>
                        {conversations.filter((item) => item?.engagement?.status === "canceled") > 0 &&
                            <TouchableOpacity onPress={() => setShowDesingaged(!showDesingaged)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
                                <CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.primary} value={"Canceled engagements"} />
                                <View style={{ height: 20, width: 20, alignItems: "center", justifyContent: "center" }}>
                                    {showDesingaged == false ? <ChatScreenUpArrow /> : <ChatScreenDownArrow />}
                                </View>
                            </TouchableOpacity>
                        }

                        {showDesingaged ? <FlatList
                            data={conversations.filter((item) => item?.engagement?.status === "canceled")}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item?.id}
                            renderItem={renderDesingagedChat}
                            contentContainerStyle={{ opacity: 0.4 }}

                        /> : null}
                    </View>
                </View>
            }
            {conversations.length === 0 &&
                <View style={{ flex: 1, backgroundColor: "white", padding: 20, alignItems: "center", justifyContent: "center" }}>

                    <View style={{ flex: 5, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ marginBottom: 15, borderRadius: "100%", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="chatbubbles-outline" size={64} color="gray" />
                        </View>
                        <CustomSemiBoldPoppingText value={`In development`} style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.primary + 2} color={"black"} />
                        <CustomRegularPoppingText style={{ marginTop: 5, textAlign: "center" }} value={"This module is corrently under contruction"} fontSize={TEXT_SIZE.primary} color={"gray"} />

                    </View>

                </View>
            }
        </View>
    );
}


export default Chat