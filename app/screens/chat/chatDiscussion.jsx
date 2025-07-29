
import MessageSender from "../../../app/components/messageSender"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../app/components/text"
import { ChatScreenCall, ChatScreenDoubleTick, ChatScreenEyeCancel, ChatScreenVideo } from "../../components/vectors"
import { BaseChatImageUrl, BaseImageUrl, COLORS, MAX_FILE_SIZE, TEXT_SIZE } from "../../../utils/constants"
import React, { useRef, useState } from "react"
import { View, FlatList, Image, StyleSheet, TouchableOpacity,ActivityIndicator} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import Pusher from 'pusher-js'
import { useEffect } from 'react'
import axios from "axios"
import { useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useGlobalVariable } from "../../context/global";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
 
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
 
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

dayjs.extend(relativeTime)
 

const ChatDiscussion = ({ navigation }) => {
	const [data, setData] = useState("")
	const [allowChat, setAllowChat] = useState(true)
	const {userData} = useGlobalVariable()
	const [messages, setMessages] = useState([])
	const {item} = useRoute().params

 
 
 
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef();
  	const [images, setImages] = useState([
	]);
 	const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
	const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
	const [isProcessing, setIsProcessing] = useState(false);

 


	  useEffect(() => {
	    const pusher = new Pusher("eb6c70a861cda9345f53", { cluster: "eu" });
	    const channel = pusher.subscribe("chat");
	
	    channel.bind("message", (data) => {
		console.log(data,"new messge recved pusher")
		 setMessages((prevMessages) => [...prevMessages, data]);
	    });
	
	    return () => {
		 channel.unbind_all();
		 channel.unsubscribe();
	    };
	  }, []);



 

 const getMessages = async (userId, page = 1) => {
  try {
	let token = await AsyncStorage.getItem("user_token");
	 
	if(userId) {
    const response = await axios.get(`/api/get-messages/${userId}?age=${page}`,{ headers: { "Authorization": `Bearer ${token}` } });
      
 
	 
    return response.data;

	}

  } catch (error) {
    console.log('Error fetching messages:', error?.request,error);
    throw error;
  }
};

  const sendMessage = async (messageData) => {
  try {
	let token = await AsyncStorage.getItem("user_token");
    const formData = new FormData();
    
   
    formData.append('receiver_id', messageData.receiver_id);
    if(messageData.message.length < 1) return //no empty messages
    if (messageData.message) {
	let date = new Date().toISOString()
	 
      formData.append('message', messageData.message);
	formData.append('date', date); //we create the date here to avoid time difference

    }
    if (messageData.image) {
      formData.append('image', {
        uri: messageData.image.uri,
        type: messageData.image.type,
        name: messageData.image.fileName || 'image.jpg',
      });
    }
    
    const response = await axios.post('/api/store-message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
	    'Authorization': `Bearer ${token}` 
      },
    });
    
     setMessages(prev => [...prev,response.data.message] );
	setData("")
  } catch (error) {
    console.error('Error sending message:', error?.request);
    throw error;
  }
};

 
 useEffect(() => {
    const fetchMessages = async () => {
      try {
		if(item){
	   const response = await getMessages(item?.other_user.id);
        setMessages(response.messages.data);
        setHasMore(response.messages.current_page < response.messages.last_page);
		}
      } catch (error) {
        console.log(error?.request,"error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [item?.other_user?.id]);

  const loadMoreMessages = async () => {
	 
    if (!hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getMessages(userData.id, nextPage);
      
      setMessages(prev => [...prev,...response.messages.data]);
      setPage(nextPage);
      setHasMore(response.messages.current_page < response.messages.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

   

  	// Verify and request permissions
	const verifyPermissions = async () => {
		try {
			if (!mediaPermission?.granted) {
				const mediaStatus = await requestMediaPermission();
				if (!mediaStatus.granted) return false;
			}
			 
			return true;
		} catch (error) {
			console.error("Permission error:", error);
			Alert.alert("Error", "Failed to get required permissions");
			return false;
		}
	};
  
	// Check file size
	const checkFileSize = async (uri) => {
		try {
			const fileInfo = await FileSystem.getInfoAsync(uri);
			if (fileInfo.size > MAX_FILE_SIZE) {
				Alert.alert("File too large", `Please select a file smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
				return false;
			}
			return true;
		} catch (error) {
			console.error("File size check error:", error);
			return false;
		}
	};
  
	// Handle image upload from gallery
	const handleImageUpload = async () => {
		try {
			setIsProcessing(true);
			const hasPermission = await verifyPermissions();
			if (!hasPermission) return;
  
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.7,
			});
  
			if (!result.canceled && result.assets.length > 0) {
				const validAssets = await Promise.all(
					result.assets.map(async asset => {
						const isValidSize = await checkFileSize(asset.uri);
						return isValidSize ? asset : null;
					})
				);
  
				const newImages = validAssets
					.filter(asset => asset !== null)
					.map(asset => ({
						 uri: asset.uri, 
						 name: "uploadImg.jpg",
                                type: "image/jpeg"
					}));
  
				if (newImages.length > 0) {
					sendMessage({message:"image",receiver_id:item?.other_user?.id,image:newImages[0]})
					setImages(newImages[0]);
				}

			 
			}
		} catch (error) {
			console.error("Image upload error:", error);
			Alert.alert("Error", "Failed to upload image");
		} finally {
			setIsProcessing(false);
		}
	};

 


 

 


	const renderMessages = ({ item }) => {
    const isSender = item?.sender?.id === userData?.id 
    
    // For debugging:
//     console.log('Current User ID:', userData?.id);
//     console.log('Message Sender ID:', item?.sender?.id);
//     console.log('Is Sender?--', isSender,item);
 

		return (
			<View style={[
				styles.messageContainer,
				isSender ? styles.senderContainer : styles.receiverContainer
			]}>
				{item?.message == "image" ? (
					<View style={[
						styles.imageContainer,
						isSender ? styles.senderImage : styles.receiverImage
					]}>
						<Image
							source={{uri:`${BaseChatImageUrl}/${item?.image_path}`}}
							resizeMode="cover"
							style={styles.image}
						/>
						{item.prohibited == true ? <View style={styles.prohibitedContainer}>
							<ChatScreenEyeCancel />
							<CustomRegularPoppingText
								style={{ opacity: 1 }}
								fontSize={TEXT_SIZE.small}
								color={COLORS.red}
								value={"This image has been flaggeg inapropriate and has been sensored "}
							/>
						</View> :
							<View style={styles.timeContainer}>
								<CustomRegularPoppingText
									style={{}}
									fontSize={TEXT_SIZE.small}
									color={"white"}
									value={item?.time? item.time : dayjs(item?.created_at).format("HH:mm")}
								/>
							</View>
						}

					</View>
				) : (
					<View style={[
						styles.bubble,
						isSender ? styles.senderBubble : styles.receiverBubble
					]}>
						<CustomRegularPoppingText
							style={styles.messageText}
							fontSize={TEXT_SIZE.secondary}
							color={"black"}
							//     color={isSender ? "white" : "black"} 
							value={item.message}
						/>
						<View style={styles.messageFooter}>
							{/* <ChatScreenDoubleTick color={isSender ? "#92D6FF" : "#8C8C8C"} /> */}
							<ChatScreenDoubleTick />
							<CustomRegularPoppingText
								style={styles.timeText}
								fontSize={TEXT_SIZE.small}
								color={isSender ? "#E3F2FD" : "#8C8C8C"}
								value={item?.time? item.time : dayjs(item?.created_at).format("HH:mm")}
								
							/>
						</View>
					</View>
				)}
			</View>
		)
	}

	return (
		<SafeAreaView className={'flex-1 bg-white'}>
			<StatusBar style="dark" />
			<View className={'py-3'} style={{ paddingHorizontal: 20, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<TouchableOpacity onPress={() => navigation.navigate("ChatDiscussionOptions")} style={{ height: 40, width: 40, borderRadius: 50, overflow: "hidden" }}>
					<Image source={item?.other_user ? {uri:`${BaseImageUrl}/${item?.other_user?.user_image}`} : require("../../../assets/images/test_match1.jpg")} style={{ height: "100%", width: "100%" }} />
				</TouchableOpacity>

				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					<TouchableOpacity className={''} onPress={() => navigation.navigate("ChatDiscussionOptions")} style={{ flex: 2, marginLeft: 15 }}>
						<CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value={item?.other_user ? `${item?.other_user?.firstname} ${item?.other_user?.lastname }`: "Maggy MacLeen"} />
						<CustomRegularPoppingText style={{}} color={COLORS.primary} fontSize={TEXT_SIZE.small + 1} value={item?.other_user?.status || "Offline"} />
					</TouchableOpacity>

					<View style={{ flex: 0.6, flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity >
							<ChatScreenCall />
						</TouchableOpacity>
						<TouchableOpacity style={{ marginLeft: 25 }} >
							<ChatScreenVideo />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View style={styles.container}>
				<FlatList
					data={messages}
					 
					showsVerticalScrollIndicator={false}
					renderItem={renderMessages}
					contentContainerStyle={styles.listContent}
				     

					ref={flatListRef}
       
         
                         keyExtractor={(item, index) => item?.id+item?.message+dayjs(item?.created_at).format("HH:mm")}
                          
                         onEndReached={loadMoreMessages}
                         onEndReachedThreshold={0.5}
                         ListFooterComponent={
                    loadingMore ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
				/>
 

				{allowChat ? <View style={styles.inputContainer}>
				     {/* {images && (
						<View>
						<Image style={{height:50,width:50}} resizeMode="contain" source={{uri:images?.img?.uri}}/>
						<TouchableOpacity 
								    style={styles.cancelReplyButton}
								    onPress={() => setReplyingTo(null)}
								  >
								    <Text style={styles.cancelReplyText}>✕</Text>
						</TouchableOpacity>
						</View>
					)} */}
					<MessageSender action={()=>sendMessage({message:data,receiver_id:item?.other_user?.id})} placeHolder="" state={data} setState={setData} imageAction={handleImageUpload} />
				</View> : <View style={styles.prohibitedChat}>
					<CustomRegularPoppingText color={COLORS.gray} style={{}} value={`You cannot chat with Cassandra anymore`} fontSize={TEXT_SIZE.secondary} />
					<TouchableOpacity>
						<CustomRegularPoppingText color={COLORS.primary} style={{}} value={`Learn more`} fontSize={TEXT_SIZE.secondary} />
					</TouchableOpacity>
				</View>}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAF4F4",
	},
	listContent: {
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 20,
	},
	messageContainer: {
		marginBottom: 8,
		maxWidth: "80%",
	},
	senderContainer: {
		alignSelf: "flex-end",
		alignItems: "flex-end",
		
	},
	receiverContainer: {
		alignSelf: "flex-start",
		alignItems: "flex-start",
	},
	bubble: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 18,
		borderBottomRightRadius: 4,
	},
	
	senderBubble: {
		backgroundColor: COLORS.primary,
		borderBottomRightRadius: 4,
		borderBottomLeftRadius: 18,
	},
	receiverBubble: {
		backgroundColor: "white",
		borderBottomRightRadius: 18,
		borderBottomLeftRadius: 4,
	},
	messageText: {
		paddingRight: 60, // Space for time and ticks
	},
	messageFooter: {
		position: "absolute",
		right: 8,
		bottom: 8.5,
		flexDirection: "row",
		alignItems: "center",
	},
	timeText: {
		marginLeft: 4,
	},
	imageContainer: {
		borderRadius: 18,
		overflow: "hidden",
		position: "relative",
		padding: 5,
		backgroundColor: "white"
	},
	senderImage: {
		borderBottomRightRadius: 4,
	},
	receiverImage: {
		borderBottomLeftRadius: 4,
	},
	image: {
		height: 200,
		width: 250,
		borderRadius: 10
	},
	timeContainer: {
		position: "absolute",
		right: 8,
		bottom: 8,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 12,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	prohibitedContainer: {
		position: "absolute",
		right: 4,
		bottom: 4,
		top: 4,
		left: 4,
		backgroundColor: "#D9D9D9",
		opacity: 0.9,
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		borderRadius: 12

	},
	prohibitedChat: {
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white"
	},
	inputContainer: {
		backgroundColor: "white",
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
	},



	  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  dateHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 10,
  },
  dateHeaderText: {
    color: '#777',
    fontSize: 12,
    fontWeight: '500',
  },
})

export default ChatDiscussion