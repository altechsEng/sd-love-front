
import MessageSender from "../../../app/components/messageSender"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../app/components/text"
import { ChatScreenCall, ChatScreenDoubleTick, ChatScreenEyeCancel, ChatScreenVideo } from "../../components/vectors"
import { COLORS, TEXT_SIZE } from "../../../utils/constants"
import React, { useState } from "react"
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"

const ChatDiscussion = ({ navigation }) => {
	const [data, setData] = useState("")
	const [allowChat, setAllowChat] = useState(true)
	const [messages, setMessages] = useState([
		{
			message: "Hi Fred.",
			time: "15:45",
			type: "receiver",
			prohibited: false
		},
		{
			message: "I finally understood the meaning of that last verse.",
			time: "15:45",
			type: "receiver",
			prohibited: false
		},
		{
			message: "Hi Cassandra.",
			time: "15:45",
			type: "sender",
			prohibited: false
		},
		{
			message: "ok. Tell me more.",
			time: "15:45",
			type: "sender",
			prohibited: false
		},
		{
			message: "",
			asset: require("../../../assets/images/dis.jpg"),
			time: "15:45",
			type: "receiver",
			prohibited: false
		},
		{
			message: "Well it's clear.",
			time: "15:45",
			type: "sender",
			prohibited: false
		},
		{
			message: "",
			asset: require("../../../assets/images/dis.jpg"),
			time: "15:45",
			type: "sender",
			prohibited: true
		}
	])

	const renderMessages = ({ item }) => {
		const isSender = item.type === "sender"

		return (
			<View style={[
				styles.messageContainer,
				isSender ? styles.senderContainer : styles.receiverContainer
			]}>
				{item?.asset ? (
					<View style={[
						styles.imageContainer,
						isSender ? styles.senderImage : styles.receiverImage
					]}>
						<Image
							source={item.asset}
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
									value={item.time}
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
								value={item.time}
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
					<Image source={require("../../../assets/images/test_match1.jpg")} style={{ height: "100%", width: "100%" }} />
				</TouchableOpacity>

				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					<TouchableOpacity className={''} onPress={() => navigation.navigate("ChatDiscussionOptions")} style={{ flex: 2, marginLeft: 15 }}>
						<CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value="Maggy MacLeen" />
						<CustomRegularPoppingText style={{}} color={COLORS.primary} fontSize={TEXT_SIZE.small + 1} value="Online" />
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
					keyExtractor={(item, index) => item.message + index}
					showsVerticalScrollIndicator={false}
					renderItem={renderMessages}
					contentContainerStyle={styles.listContent}
					inverted={false}
				/>

				{allowChat ? <View style={styles.inputContainer}>
					<MessageSender action={() => setAllowChat(!allowChat)} placeHolder="" state={data} setState={setData} />
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
})

export default ChatDiscussion