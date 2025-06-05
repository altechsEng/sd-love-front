import {ScrollView, View,Image, TouchableOpacity, ActivityIndicator, ToastAndroid} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { EditProfileScreenButton, EditProfileScreenButtonRed, EditProfileScreenPen } from "../../components/vectors";
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../components/text";
import { COLORS, TEXT_SIZE } from "../../../utils/constants";
import { useEffect,useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useGlobalVariable } from "../../context/global";
import dayjs from "dayjs";

const EditProfileScreen = ({navigation}) => {
 
const [loading, setLoading] = useState(false);
const [uploading, setUploading] = useState(false);
const {userData,image,loadData,setImage} = useGlobalVariable()
 
useEffect(() => {
  loadData()
  
},[])

 


  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      let user_id = await AsyncStorage.getItem("user_id")
      
      // Create FormData
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        name: `profile_${user_id}.jpg`,
        type: 'image/jpeg'
      });

      const response = await axios.post('/api/upload-avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local storage with new avatar
      if (response.data.success) {
        const dat = await JSON.parse(await AsyncStorage.getItem("user_data"));
        
        let img = `https://sdlove-api.altechs.africa/storage/app/private/public/user_images/${response.data?.avatarUrl}`;
        dat.user_image = img
        await AsyncStorage.setItem("user_data", JSON.stringify(dat));
        
        setImage(img)
         console.log(img)
         ToastAndroid.show("Profile image updated",1000)
      }
       
    } catch (error) {
      console.error("Upload error:", error.response,Object.keys(error),error.request);
      throw error;
    }
  }

  const pickImage = async () => {
    setUploading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setUploading(false);
    }
  };

     

     return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:"white",position:"relative",padding:20,flex:1}}>
          <TouchableOpacity onPress={() => pickImage()} style={{height:hp("10%"),width:hp("10%"),borderRadius:100,position:"relative"}}>
               {uploading? <ActivityIndicator color={COLORS.primary}/> : <>
               <Image source={image ? {uri:`${image}`} : require("../../../assets/images/match_con1.jpg.jpg")} resizeMode="cover" style={{height:"100%",width:"100%",borderRadius:100}}/>
               <View style={{position:"absolute",borderColor:"white",borderWidth:1,backgroundColor:"#2E2E2E",bottom:-5,right:-5,zIndex:999,height:hp("5%"),width:hp("5%"),borderRadius:"100%",alignItems:"center",justifyContent:"center"}}>
                    <EditProfileScreenButton/>
               </View>
               </>}
 
           

          </TouchableOpacity>

          <View style={{marginTop:20}}>
               <CustomSemiBoldPoppingText color={"black"} value={"Basic info"} style={{}} fontSize={TEXT_SIZE.primary}/>

               <View>
                    <View style={{ marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View style={{}}>
                         <CustomRegularPoppingText value={"Name"} fontSize={TEXT_SIZE.small} style={{}} color={"#A0A7AE"}/>
                         <CustomRegularPoppingText value={`${userData?.firstname} ${userData?.lastname}`|| "Joseph Orlan"} fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.black}/>
                         </View>

                         <TouchableOpacity onPress={() => navigation.navigate("CustomEditSetting",{type:"name"})} style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
                         <EditProfileScreenPen/>
                         <CustomRegularPoppingText value={"Edit"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
                         </TouchableOpacity>
                         
                    </View>


                    <View style={{ marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View style={{}}>
                         <CustomRegularPoppingText value={"Date of birth"} fontSize={TEXT_SIZE.small} style={{}} color={"#A0A7AE"}/>
                         <CustomRegularPoppingText value={dayjs(userData?.dob).format('DD MMMM YYYY') || "10 June 1999"} fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.black}/>
                         </View>

                         <TouchableOpacity onPress={() => navigation.navigate("CustomEditSetting",{type:"dob"})} style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
                         <EditProfileScreenPen/>
                         <CustomRegularPoppingText value={"Edit"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
                         </TouchableOpacity>
                         
                    </View>

                    <View style={{ marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View style={{}}>
                         <CustomRegularPoppingText value={"Address"} fontSize={TEXT_SIZE.small} style={{}} color={"#A0A7AE"}/>
                         <CustomRegularPoppingText value={`${userData?.country}-${userData?.city}-${userData?.address}`.length>30 ? `${userData?.country}-${userData?.city}-${userData?.address}`.slice(0,20)+"...":`${userData?.country}-${userData?.city}-${userData?.address}` || "409 Konopelski Row, Otisworth, Belg..."} fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.black}/>
                         </View>

                         <TouchableOpacity onPress={() => navigation.navigate("CustomEditSetting",{type:"address"})} style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
                         <EditProfileScreenPen/>
                         <CustomRegularPoppingText value={"Edit"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
                         </TouchableOpacity>
                         
               </View>


                  <View style={{ marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View style={{}}>
                         <CustomRegularPoppingText value={"Phone"} fontSize={TEXT_SIZE.small} style={{}} color={"#A0A7AE"}/>
                         <CustomRegularPoppingText value={`${userData?.phone_code} ${userData?.phone}` || "957-552-1432 x3638"} fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.black}/>
                         </View>

                         <TouchableOpacity onPress={() => navigation.navigate("CustomEditSetting",{type:"tel"})} style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
                         <EditProfileScreenPen/>
                         <CustomRegularPoppingText value={"Edit"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
                         </TouchableOpacity>
                         
               </View>



                    <View style={{ marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View style={{}}>
                         <CustomRegularPoppingText value={"Education"} fontSize={TEXT_SIZE.small} style={{}} color={"#A0A7AE"}/>
                         <CustomRegularPoppingText value={"Not specified"} fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.black}/>
                         </View>

                         <TouchableOpacity  style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
                         <EditProfileScreenPen/>
                         <CustomRegularPoppingText value={"Edit"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
                         </TouchableOpacity>
                         
               </View>




          <View style={{ marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View style={{}}>
                         <CustomRegularPoppingText value={"Profession"} fontSize={TEXT_SIZE.small} style={{}} color={"#A0A7AE"}/>
                         <CustomRegularPoppingText value={"Not specified"} fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.black}/>
                         </View>

                         <TouchableOpacity style={{paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderRadius:10,backgroundColor:COLORS.light}}>
                         <EditProfileScreenPen/>
                         <CustomRegularPoppingText value={"Edit"} fontSize={TEXT_SIZE.small} style={{marginLeft:10}} color={COLORS.black}/>
                         </TouchableOpacity>
                         
               </View>






               </View>
               
               

      <View style={{marginTop:20}}>
               <CustomSemiBoldPoppingText color={"black"} value={"Advanced profile info"} style={{}} fontSize={TEXT_SIZE.primary}/>
               <CustomRegularPoppingText value={"Updating the information on this section directly affect your match list. You can only update this information after every 30 days."} fontSize={TEXT_SIZE.small} style={{}} color={"#808A94"}/>


      </View>


              <TouchableOpacity style={{flexDirection:"row",marginTop:20}} onPress={() => {}}>
                    <EditProfileScreenButtonRed/>
                    <CustomRegularPoppingText value={"Edit advanced profile info"} style={{marginLeft:10}} color={"#E55E6F"} />
               </TouchableOpacity>
               

              

          </View>
     </ScrollView>
}

export default EditProfileScreen;