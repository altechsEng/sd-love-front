import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../app/components/text'
import { ChatScreenDownArrow, ChatScreenUpArrow } from '../../components/vectors'
import { COLORS, TEXT_SIZE } from '../../../utils/constants'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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

	const renderDesingagedChat = ({ item }) => {
		return (
			<View style={{ flex: 1, marginBottom: 10, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{}}>
					<View style={{ height: 50, width: 50, borderRadius: 50, overflow: "hidden" }}>
						<Image source={item.img} style={{ height: "100%", width: "100%" }} />
					</View>

				</View>

				<View style={{ flex: 4, marginLeft: 10 }}>
					<CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value={item.name} />
					<CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.small} value={`You cannot send messages to ${item.name} anymore..`} />
				</View>
			</View>
		);
	}

	return (
		<View className={'py-6'} style={{ backgroundColor: "white", flex: 1 }}>
			<TouchableOpacity onPress={() => navigation.navigate("chatDiscussion")} style={{ paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ position: "relative" }}>
					<View style={{ height: 50, width: 50, borderRadius: 50, overflow: "hidden" }}>
						<Image source={require("../../../assets/images/test_match1.jpg")} style={{ height: "100%", width: "100%" }} />
					</View>
					<View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: "green", zIndex: 5, position: "absolute", top: 2, right: 2 }}></View>
				</View>

				<View style={{ flex: 5, marginLeft: 10 }}>
					<CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value="Maggy MacLeen" />
					<CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.small} value="Sorry for the late response i wasn't.." />
				</View>

				<View onPress={() => navigation.navigate("Notifications")} style={{ flex: 0.7, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
					<View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: COLORS.primary, alignItems: "center" }}>
						<CustomSemiBoldPoppingText style={{}} color={"white"} fontSize={TEXT_SIZE.secondary} value="3" />
					</View>
					<View>
						<CustomRegularPoppingText style={{}} color={COLORS.primary} fontSize={TEXT_SIZE.small} value="10:50" />
					</View>
				</View>
			</TouchableOpacity>

			<View style={{ flex: 5 }}>
				<TouchableOpacity onPress={() => setShowDesingaged(!showDesingaged)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
					<CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.primary} value={"Desingaged chats"} />
					<View style={{ height: 20, width: 20, alignItems: "center", justifyContent: "center" }}>
						{showDesingaged == false ? <ChatScreenUpArrow /> : <ChatScreenDownArrow />}
					</View>
				</TouchableOpacity>

				{showDesingaged ? <FlatList
					data={desingagedChats}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item?.id}
					renderItem={renderDesingagedChat}
					contentContainerStyle={{ opacity: 0.4 }}

				/> : null}
			</View>
		</View>
	);
}


export default Chat