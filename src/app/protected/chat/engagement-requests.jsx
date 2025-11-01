import { View, Text, TouchableOpacity, FlatList, Image, Pressable, Modal, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../components/text'
import { BaseImageUrl, COLORS, FAMILLY, TEXT_SIZE } from '../../../utils/constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MatchConnectionBackArrow, PostScreenDots, ProfileScreenPostDelete } from '../../../components/vectors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons'

const EngagementRequests = ({ navigation }) => {

    const [requests, setRequests] = useState([]) // Assuming you will fetch engagement requests from an API
    const [isLoading, setisLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [error, setError] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        getRequests();
    }, []);

    const openModal = (item) => {
        setSelectedRequest(item);
        console.log(item);

        setModalVisible(true);
    }

    const getRequests = async () => {

        let token = await AsyncStorage.getItem("user_token");
        let data = { userId: await AsyncStorage.getItem("user_id") }

        if (token) {
            axios.post('/api/show-engagement-requests', data, { headers: { "Authorization": `Bearer ${token}` } })
                .then(async (res) => {
                    if (res.data.status == 200) {
                        setRequests(res.data.engagement_requests.data);
                        console.log(res.data.engagement_requests.data);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        } else {
            console.log('Not logged it');
        }
    }

    const acceptEngagementRequest = async () => {
        setisLoading(true);
        let token = await AsyncStorage.getItem("user_token");
        let data = { userId: await AsyncStorage.getItem("user_id"), requestId: selectedRequest.id }

        if (token) {
            axios.post('/api/accept-engagement-request', data, { headers: { "Authorization": `Bearer ${token}` } })
                .then(async (res) => {
                    if (res.data.status == 200) {
                        setModalVisible(false);
                        getRequests();
                    }
                    setisLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setisLoading(false);
                });
        } else {
            console.log('Not logged it');
        }
    }

    const rejectEngagementRequest = async () => {
        setisLoading(true);
        let token = await AsyncStorage.getItem("user_token");
        let data = { userId: await AsyncStorage.getItem("user_id"), requestId: selectedRequest.id }

        if (token) {
            axios.post('/api/reject-engagement-request', data, { headers: { "Authorization": `Bearer ${token}` } })
                .then(async (res) => {
                    if (res.data.status == 200) {
                        setModalVisible(false);
                        getRequests();
                    }
                    setisLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setisLoading(false);
                });
        } else {
            console.log('Not logged it');
        }
    }

    const renderRequest = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => openModal(item)} className='flex flex-row' style={{ padding: 20, borderBottomWidth: 1, borderColor: COLORS.light }}>
                <View className='border border-slate-100' style={{ borderRadius: 50, height: 40, width: 40, overflow: "hidden", alignItems: "center" }}><Image source={{ uri: `${BaseImageUrl}/${item?.user.user_image}` }} resizeMode="cover" style={{ height: "100%", width: "100%" }} /></View>
                <View className='justify-center' style={{ marginLeft: 10 }}>
                    <Text style={{ color: COLORS.black, fontSize: TEXT_SIZE.primary, fontFamily: FAMILLY.semibold, lineHeight: 20 }}>{item?.user.firstname} {item?.user.lastname}</Text>
                    <Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>{dayjs(item?.date).fromNow() || "2h ago"}</Text>
                </View>
                {/* <View className='px-2 py-1 mt-2 bg-white border rounded-full border-slate-100 h-7'>
                    <Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.small, fontFamily: FAMILLY.light }}>You have rejected</Text>
                </View> */}
                <TouchableOpacity className='my-auto ml-auto' >
                    <PostScreenDots />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            {/* Screen Header */}
            {/* Content */}
            {requests.length > 0 ? <FlatList
                data={requests}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item?.id}
                renderItem={renderRequest}
            // contentContainerStyle={{ opacity: 0.4 }}

            /> :
                <View className='px-10' style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ marginBottom: 15, borderRadius: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="person-add-outline" size={64} color="gray" />
                    </View>
                    <CustomSemiBoldPoppingText value={`No Engagement requests`} style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.primary + 2} color={"black"} />
                    <CustomRegularPoppingText style={{ marginTop: 5, textAlign: "center" }} value={"Engagement requests sent by others will appear here"} fontSize={TEXT_SIZE.medium} color={"gray"} />
                </View>
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {/* Semi-transparent overlay (simulates blur effect) */}
                <Pressable
                    style={styles.overlay}
                    onPress={() => setModalVisible(false)}
                >
                    {/* Actual modal content */}
                    <View style={styles.modalContainer}>
                        <View className={'gap-6 py-8'} style={styles.modalContent}>
                            <>
                                {selectedRequest?.status != 'accepted' &&
                                    <TouchableOpacity onPress={() => acceptEngagementRequest()} style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }}>
                                        <FontAwesome6 name="grin-hearts" size={24} color={COLORS.black} />
                                        <CustomRegularPoppingText color={null} style={{ marginLeft: 20 }} value={"Accept request"} fontSize={TEXT_SIZE.primary + 1} />
                                        {isLoading ? <ActivityIndicator className='ml-auto' color={COLORS.primary} /> : <></>}
                                    </TouchableOpacity>
                                }
                                {selectedRequest?.status != 'rejected' &&
                                    <TouchableOpacity onPress={() => rejectEngagementRequest()} style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }}>
                                        <FontAwesome6 name="heart-circle-xmark" size={24} color={COLORS.red} />
                                        <CustomRegularPoppingText color={null} style={{ marginLeft: 20 }} value={"Reject request"} fontSize={TEXT_SIZE.primary + 1} />
                                        {isLoading ? <ActivityIndicator className='ml-auto' color={COLORS.primary} /> : <></>}
                                    </TouchableOpacity>
                                }
                            </>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    },
    modalContainer: {
        width: '100%',
        // height: SCREEN_HEIGHT * 0.89,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        // height: '100%',
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EngagementRequests