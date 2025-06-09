

import React, { useState } from 'react'
import {
	CustomRegularPoppingText,
	CustomSemiBoldPoppingText
} from "../../../app/components/text";
import {
	ChatDiscussionOptionPhone,
	ChatDiscussionOptionsArrowRight,
	ChatDiscussionOptionsBell,
	ChatDiscussionOptionsDelete,
	ChatDiscussionOptionsDesingaged,
	ChatDiscussionOptionsPeople,
	ChatDiscussionOptionsPersonCancel,
	ChatDiscussionOptionsVideo,
	MatchProfileArrowBack
} from "../../components/vectors";
import { COLORS, TEXT_SIZE } from "../../../utils/constants";
import {
	View,
	Image,
	TouchableOpacity,
	Dimensions,
	FlatList,
	StyleSheet,
	Switch
} from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChatDiscussionOptions = ({ navigation }) => {
	const [allImages] = useState([
		require("../../../assets/images/match_pro1.jpg"),
		require("../../../assets/images/match_pro2.jpg"),
		require("../../../assets/images/match_pro3.jpg"),
		require("../../../assets/images/match_pro3.jpg"),
		require("../../../assets/images/match_pro1.jpg"),
		require("../../../assets/images/match_pro2.jpg"),
		require("../../../assets/images/match_pro3.jpg"),
		require("../../../assets/images/match_pro3.jpg"),
	]);

	const [visibleCount, setVisibleCount] = useState(4);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	const loadMoreImages = () => {
		setVisibleCount(prev => Math.min(prev + 4, allImages.length));
	};

	const renderImages = ({ item, index }) => {
		const isLastVisible = index === visibleCount - 1;
		const remainingCount = allImages.length - visibleCount;

		return (
			<TouchableOpacity
				style={styles.imageContainer}
				onPress={() => {
					if (isLastVisible && remainingCount > 0) {
						loadMoreImages();
					}
				}}
			>
				<Image source={item} style={styles.image} />

				{isLastVisible && remainingCount > 0 && (
					<View style={styles.overlay}>
						<View style={styles.remainingCountContainer}>
							<CustomRegularPoppingText
								value={`+${remainingCount}`}
								style={styles.remainingCountText}
								color="white"
								fontSize={TEXT_SIZE.small}
							/>
						</View>
						<View style={styles.iconContainer}>
							<ChatDiscussionOptionsArrowRight />
						</View>
					</View>
				)}
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView className={'flex-1 bg-white'}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.container}
			>
				{/* Profile Image Section */}
				<View style={styles.profileImageContainer}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<MatchProfileArrowBack />
					</TouchableOpacity>
					<Image
						style={styles.profileImage}
						resizeMode="cover"
						source={require('../../../assets/images/test_match1.jpg')}
					/>
				</View>

				{/* Profile Info */}
				<CustomSemiBoldPoppingText
					value="Magy McLeen"
					color="black"
					fontSize={TEXT_SIZE.title + 3}
					style={styles.name}
				/>

				<View style={styles.profileInfo}>
					<View>
						<CustomSemiBoldPoppingText
							color={COLORS.black}
							fontSize={TEXT_SIZE.primary}
							value="Revelation Church, Los Angeles"
						/>
						<CustomRegularPoppingText
							color={COLORS.gray}
							fontSize={TEXT_SIZE.secondary}
							value="Choir Leader"
						/>
					</View>
				</View>


				{/* Action Buttons - Perfect Grid */}
				<View style={styles.actionButtonsContainer}>
					<View style={styles.actionButtonsRow}>
						<TouchableOpacity style={styles.actionButton}>
							<View style={styles.iconWrapper}>
								<ChatDiscussionOptionPhone width={24} height={24} />
							</View>
							<CustomRegularPoppingText
								value="Voice call"
								fontSize={TEXT_SIZE.small}
								color={COLORS.black}
								style={styles.actionButtonText}
							/>
						</TouchableOpacity>

						<TouchableOpacity className={'mx-4'} style={styles.actionButton}>
							<View style={styles.iconWrapper}>
								<ChatDiscussionOptionsVideo width={24} height={24} />
							</View>
							<CustomRegularPoppingText
								value="Video call"
								fontSize={TEXT_SIZE.small}
								color={COLORS.black}
								style={styles.actionButtonText}
							/>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton}>
							<View style={styles.iconWrapper}>
								<ChatDiscussionOptionsPeople width={24} height={24} />
							</View>
							<CustomRegularPoppingText
								value="View profile"
								fontSize={TEXT_SIZE.small}
								color={COLORS.black}
								style={styles.actionButtonText}
							/>
						</TouchableOpacity>

					</View>
				</View>

				{/* Media Gallery */}
				<View style={styles.mediaSection}>
					<CustomSemiBoldPoppingText
						value="Media"
						fontSize={TEXT_SIZE.primary}
						color={COLORS.darkGray}
						style={styles.sectionTitle}
					/>

					<FlatList
						data={allImages.slice(0, visibleCount)}
						horizontal
						showsHorizontalScrollIndicator={false}
						keyExtractor={(item, index) => index.toString()}
						renderItem={renderImages}
						contentContainerStyle={styles.galleryContainer}
					/>
				</View>

				{/* Options Section */}
				<View style={styles.optionsSection}>
					<CustomSemiBoldPoppingText
						value="Options"
						fontSize={TEXT_SIZE.primary}
						color={COLORS.darkGray}
						style={styles.sectionTitle}
					/>

					{/* Notification with Toggle */}
					<View style={styles.optionItem}>
						<View style={styles.optionContent}>
							<ChatDiscussionOptionsBell width={20} height={20} />
							<CustomRegularPoppingText
								color={COLORS.black}
								value="Notifications"
								style={styles.optionText}
								fontSize={TEXT_SIZE.medium}
							/>
						</View>
						<Switch
							value={notificationsEnabled}
							onValueChange={setNotificationsEnabled}
							trackColor={{ false: COLORS.light, true: COLORS.black }}
							thumbColor="white"
						/>
					</View>

					<TouchableOpacity style={styles.optionItem}>
						<View style={styles.optionContent}>
							<ChatDiscussionOptionsPersonCancel width={20} height={20} />
							<CustomRegularPoppingText
								color={COLORS.red}
								value="Report user"
								style={styles.optionText}
								fontSize={TEXT_SIZE.medium}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.optionItem}>
						<View style={styles.optionContent}>
							<ChatDiscussionOptionsDelete width={20} height={20} />
							<CustomRegularPoppingText
								color={COLORS.red}
								value="Delete messages"
								style={styles.optionText}
								fontSize={TEXT_SIZE.medium}
							/>
						</View>
					</TouchableOpacity>


					<TouchableOpacity style={styles.optionItem}>
						<View style={styles.optionContent}>
							<ChatDiscussionOptionsDesingaged width={20} height={20} />
							<CustomRegularPoppingText
								color={COLORS.red}
								value="Disengage with Rosie"
								style={styles.optionText}
								fontSize={TEXT_SIZE.medium}
							/>
						</View>
					</TouchableOpacity>
				</View>

				{/* Bottom Spacer */}
				<View style={{ height: 50 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 15,
	},
	profileImageContainer: {
		height: hp('50%'),
		borderRadius: 20,
		position: "relative",
		overflow: "hidden",
		marginBottom: 20,
	},
	backButton: {
		position: "absolute",
		top: 20,
		left: 15,
		zIndex: 10,
	},
	profileImage: {
		height: "100%",
		width: "100%",
	},
	name: {
		marginTop: 10,
		marginBottom: 5,
	},
	profileInfo: {
		marginBottom: 20,
	},
	actionButtonsContainer: {
		borderRadius: 15,
		marginBottom: 20,
	},
	actionButtonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	actionButton: {
		flex: 1,
		width: 100,
		height: 80,
		backgroundColor: "#EBEBEB",
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
	},
	iconWrapper: {
		marginBottom: 8,
		alignItems: 'center',
		justifyContent: 'center',
		height: 24,
	},
	actionButtonText: {
		textAlign: 'center',
	},
	mediaSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		marginBottom: 10,
	},
	galleryContainer: {
		paddingVertical: 5,
	},
	imageContainer: {
		height: wp('25%'),
		width: wp('25%'),
		borderRadius: 10,
		overflow: "hidden",
		marginRight: 10,
		position: 'relative',
	},
	image: {
		height: "100%",
		width: "100%",
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	remainingCountContainer: {
		position: 'absolute',
		top: '30%',
	},
	remainingCountText: {
		fontWeight: 'bold',
	},
	iconContainer: {
		position: 'absolute',
		bottom: '30%',
	},
	optionsSection: {
		marginBottom: 20,
	},
	optionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 15,

	},
	optionContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	optionText: {
		marginLeft: 15,
	},
});

export default ChatDiscussionOptions;
