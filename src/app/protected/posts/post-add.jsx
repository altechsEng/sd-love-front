

import { PostAddDeleteIcon, PostScreenMediaCamera, PostScreenMediaGif, PostScreenMediaImage, PostScreenMediaVideo, PostScreenPlus } from '../../../components/vectors'
import { COLORS, MAX_FILE_SIZE, TEXT_SIZE } from '../../../utils/constants'
import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Dimensions, TouchableOpacity, Image, FlatList, Platform, ActivityIndicator, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { useGlobalVariable } from '../../../context/global';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CustomRegularPoppingText } from "../../../components/text"
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostAddHeader from '../../../components/postAddHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const MAX_VIDEO_DURATION = 30; // 30 seconds

const PostAdd = ({ navigation }) => {


	const [thoughts, setThoughts] = useState("")
	const [images, setImages] = useState([
		// { id: "imk1", img: require("../../../assets/images/match_pro1.jpg") },
		// { id: "imk2", img: require("../../../assets/images/match_pro2.jpg") },
		// { id: "imk3", img: require("../../../assets/images/match_pro3.jpg") },
	]);
	const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
	const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
	const [isProcessing, setIsProcessing] = useState(false);
	const { setPostAddData, isLoading } = useGlobalVariable()


	useEffect(() => {

		setPostAddData((prev) => ({
			...prev,
			text: thoughts,
			media: images
		}))
	}, [thoughts, images])

	const renderImages = ({ item }) => {
		return (
			<View style={{ overflow: "hidden", height: 70, width: 70, marginRight: 5, marginBottom: 5 }}>
				{item.isVideo ? (
					<Video
						source={{ uri: item.img.uri }}
						style={{ height: "100%", width: "100%" }}
						resizeMode="cover"
						shouldPlay={true}
						useNativeControls={false}
					/>
				) : (
					<Image source={item.img} style={{ height: "100%", width: "100%" }} />
				)}

				{/* Media type indicator */}
				{item.isVideo && (
					<View style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 2, borderRadius: 3 }}>
						<Text style={{ color: 'white', fontSize: 10 }}>VIDEO</Text>
					</View>
				)}
				{item.isGif && (
					<View style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 2, borderRadius: 3 }}>
						<Text style={{ color: 'white', fontSize: 10 }}>GIF</Text>
					</View>
				)}

				{/* Delete button */}
				<TouchableOpacity
					style={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'white', borderRadius: 10, padding: 2 }}
					onPress={() => handleDeleteMedia(item.id)}
				>
					<PostAddDeleteIcon />
				</TouchableOpacity>
			</View>
		);
	};

	// Verify and request permissions
	const verifyPermissions = async () => {
		try {
			if (!mediaPermission?.granted) {
				const mediaStatus = await requestMediaPermission();
				if (!mediaStatus.granted) return false;
			}
			if (!cameraPermission?.granted) {
				const cameraStatus = await requestCameraPermission();
				if (!cameraStatus.granted) return false;
			}
			return true;
		} catch (error) {
			console.error("Permission error:", error);
			Alert.alert("Error", "Failed to get required permissions");
			return false;
		}
	};


 const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Create app-specific directories for better file management
const setupDirectories = async () => {
  try {
    const appDir = new FileSystem.Directory(FileSystem.documentDirectory + 'app_media/');
    const videoDir = new FileSystem.Directory(FileSystem.documentDirectory + 'app_media/videos/');
    const tempDir = new FileSystem.Directory(FileSystem.cacheDirectory + 'temp/');
    
    // Ensure directories exist
    await appDir.makeDirectoryAsync({ intermediates: true });
    await videoDir.makeDirectoryAsync({ intermediates: true });
    await tempDir.makeDirectoryAsync({ intermediates: true });
    
    return { appDir, videoDir, tempDir };
  } catch (error) {
    console.error('Directory setup error:', error);
  }
};

const checkFileSize = async (uri) => {
  try {
    // Use File class
    const file = new FileSystem.File(uri);
    const fileInfo = await file.getInfoAsync();
    
    if (!fileInfo.exists) {
      Alert.alert("Error", "Selected file no longer exists");
      return false;
    }

    console.log('File size:', fileInfo.size, 'bytes');
    
    if (fileInfo.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      const currentSizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
      Alert.alert(
        "File too large", 
        `Maximum size: ${maxSizeMB}MB\nYour file: ${currentSizeMB}MB`
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("File size check error:", error);
    // Allow upload to proceed if check fails
    return true;
  }
};

const copyFileToAppDirectory = async (sourceUri, fileName) => {
  try {
    await setupDirectories();
    
    const sourceFile = new FileSystem.File(sourceUri);
    const destPath = FileSystem.documentDirectory + 'app_media/videos/' + fileName;
    const destFile = new FileSystem.File(destPath);
    
    // Copy file to app directory for reliable access
    await sourceFile.copyAsync(destFile);
    
    return destPath;
  } catch (error) {
    console.error('File copy error:', error);
    return sourceUri; // Return original if copy fails
  }
};

const generateVideoThumbnail = async (videoUri) => {
  try {
    const videoFile = new FileSystem.File(videoUri);
    const fileInfo = await videoFile.getInfoAsync();
    
    if (!fileInfo.exists) {
      return videoUri;
    }

    // Generate thumbnail
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1000,
      quality: 0.7,
    });
    
    return uri;
  } catch (e) {
    console.warn("Thumbnail generation failed:", e);
    return videoUri;
  }
};

// Clean up temporary files
const cleanupTempFiles = async () => {
  try {
    const tempDir = new FileSystem.Directory(FileSystem.cacheDirectory + 'temp/');
    const dirInfo = await tempDir.getInfoAsync();
    
    if (dirInfo.exists) {
      await tempDir.deleteAsync();
      console.log('Temporary files cleaned up');
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

	// Handle image upload from gallery
	const handleImageUpload = async () => {
		try {
			setIsProcessing(true);
			const hasPermission = await verifyPermissions();
			if (!hasPermission) return;

			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: false,
				videoMaxDuration:MAX_VIDEO_DURATION,
				aspect: [4, 4],
				quality: 1,
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
						id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
						img: { uri: asset.uri, type: asset.type , name: asset.fileName },
						isVideo:asset.type=="video",
						videoUri:asset.type=="video"? asset.uri:null
					}));

				if (newImages.length > 0) {
					setImages(prev => [...prev, ...newImages]);
				}
			}
		} catch (error) {
			console.error("Image upload error:", error);
			Alert.alert("Error", "Failed to upload image");
		} finally {
			setIsProcessing(false);
		}
	};

	// Handle GIF upload
	const handleGifUpload = async () => {
		try {
			setIsProcessing(true);
			const hasPermission = await verifyPermissions();
			if (!hasPermission) return;

			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: false,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled && result.assets.length > 0) {
				const asset = result.assets[0];
				 

				// Check if the selected file is a GIF (simple check by extension)
				if (asset.uri.toLowerCase().endsWith('.gif')) {
					setImages(prev => [...prev, {
						id: `${Date.now()}_gif`,
						img: { uri: asset.uri, type: asset.type, name: asset.fileName },
						isGif: true
					}]);
				} else {
					Alert.alert("Invalid File", "Please select a GIF file");
				}
			}
		} catch (error) {
			console.error("GIF upload error:", error);
			Alert.alert("Error", "Failed to upload GIF");
		} finally {
			setIsProcessing(false);
		}
	};

	// Handle taking a picture with camera
	const handleTakePicture = async () => {
		try {
			setIsProcessing(true);
			const hasPermission = await verifyPermissions();
			if (!hasPermission) return;

			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.7,
			});

			if (!result.canceled && result.assets.length > 0) {
				const asset = result.assets[0];
				// const isValidSize = await checkFileSize(asset.uri);

				// if (isValidSize) {

				// }

				setImages(prev => [...prev, {
						id: ` ${Date.now()}_photo`,
						img: { uri: asset.uri, type: asset.type, name: asset.fileName }
					}]);
			}
		} catch (error) {
			console.error("Camera error:", error);
			Alert.alert("Error", "Failed to take picture");
		} finally {
			setIsProcessing(false);
		}
	};

	// Handle taking a video with camera (limited to 30 seconds)
	const handleTakeVideo = async () => {
		try {
			setIsProcessing(true);
			const hasPermission = await verifyPermissions();
			if (!hasPermission) return;

			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Videos,
				allowsEditing: false,
				aspect: [4, 4],
				quality: 1,
				videoMaxDuration: MAX_VIDEO_DURATION,
			});

			if (!result.canceled && result.assets.length > 0) {
				const asset = result.assets[0];
				console.log(asset,"in video")
				const isValidSize = await checkFileSize(asset.uri);


				if (isValidSize) {
				 
					// Generate thumbnail
					const thumbnail = await generateVideoThumbnail(asset.uri);

 					setImages(prev => [...prev, {
						id: `${Date.now()}_video`,
						img: { uri: thumbnail,type:asset.type,name:asset.fileName },
						videoUri: asset.uri,
						isVideo: true
					}]);
				}

					 
					 

				
			}
		} catch (error) {
			console.error("Video recording error:", error);
			Alert.alert("Error", "Failed to record video");
		} finally {
			setIsProcessing(false);
		}
	};


	// Delete media item
	const handleDeleteMedia = (id) => {
		setImages(prev => prev.filter(item => item.id !== id));
	};

	return (
		<>
			<PostAddHeader />
		
							{isLoading ?
				<View style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
					<ActivityIndicator size={34} color={COLORS.primary} />
					<CustomRegularPoppingText style={{}} color={COLORS.black} fontSize={TEXT_SIZE.primary} value="Loading please wait..." />
				</View>
				:
				<SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
					<TextInput
						placeholder='Express your thoughts....'
						multiline={true}
						value={thoughts}
						onChangeText={(text) => setThoughts(text)}
						style={{ flex: 1, backgroundColor: "white", textAlignVertical: "top", paddingLeft: 20, paddingTop: 0 }}
					/>

					<View style={{ backgroundColor: "white", marginVertical: 20, paddingHorizontal: 20 }}>
						{isProcessing && (
							<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)' }}>
								<ActivityIndicator size="large" color={COLORS.primary} />
								<Text style={{ marginTop: 10 }}>Processing media...</Text>
							</View>
						)}

						<FlatList
							keyExtractor={(item) => item.id}
							data={images}
							renderItem={renderImages}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}
							ListFooterComponent={() => (
								<TouchableOpacity
									style={{ height: 70, width: 70, borderStyle: "dashed", borderWidth: 2, alignItems: "center", justifyContent: "center", borderColor: COLORS.light }}
									onPress={() => handleImageUpload()}
									disabled={isProcessing}
								>
									{isProcessing ? (
										<ActivityIndicator size="small" color={COLORS.primary} />
									) : (
										<PostScreenPlus />
									)}
								</TouchableOpacity>
							)}
						/>
					</View>

					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30, backgroundColor: "white", borderTopWidth: 2, borderColor: COLORS.light }}>
						<TouchableOpacity onPress={() => handleImageUpload()} disabled={isProcessing}>
							<PostScreenMediaImage fill={isProcessing ? COLORS.light : COLORS.dark} />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => handleGifUpload()} disabled={isProcessing}>
							<PostScreenMediaGif fill={isProcessing ? COLORS.light : COLORS.dark} />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => handleTakePicture()} disabled={isProcessing}>
							<PostScreenMediaCamera fill={isProcessing ? COLORS.light : COLORS.dark} />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => handleTakeVideo()} disabled={isProcessing}>
							<PostScreenMediaVideo fill={isProcessing ? COLORS.light : COLORS.dark} />
						</TouchableOpacity>
					</View>
				</SafeAreaView>}
		 
		</>
	)
}

export default PostAdd