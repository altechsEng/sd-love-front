
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../components/text"
import { COLORS, TEXT_SIZE } from "../../../utils/constants"
import { useGlobalVariable } from "../../../context/global"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AccountSecurityScreenDelete, AccountSecurityScreenGuardIcon, EditProfileScreenPen, ProfileScreenPostDelete } from "../../../components/vectors"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const AccountSecurityScreen = ({ navigation }) => {
     const { userData } = useGlobalVariable()

     const [isLoading, setIsLoading] = useState(false)

     // Modals
     const [deleteAccountModal, setDeleteAccountModal] = useState(false);
     const [PasswordResetModal, setPasswordResetModal] = useState(false);

     const deleteAccount = async () => {
          setIsLoading(true)
          // Logic to delete account
          // This is just a placeholder, implement your actual delete logic here
          let data = { userId: await AsyncStorage.getItem("user_id") }

          try {
               let token = await AsyncStorage.getItem("user_token");

               if (token) {
                    const response = await axios.post(`/api/delete-account`, data, { headers: { "Authorization": `Bearer ${token}` } });
                    // const response = await axios.get(`/api/get-messages/${userId}?age=${page}`,{ headers: { "Authorization": `Bearer ${token}` } });

                    if (response.data.status === 200) {
                         console.log("Account deleted successfully");
                         console.log(response.data.status, response.data.message);

                         AsyncStorage.removeItem("user_data").then(() => {
                              AsyncStorage.removeItem("user_token").then(() => {
                                   navigation.navigate("Login")
                              })
                         });

                         setDeleteAccountModal(false)
                         setIsLoading(false)
                         // Optionally, you can navigate to a different screen or show a success message
                    }
               }

          } catch (error) {
               console.log('Error while deleting account:', error?.request, error);
               throw error;
          }
     }


     return (
          <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>

               <CustomSemiBoldPoppingText style={{}} value={"Email address"} fontSize={TEXT_SIZE.primary} color={"black"} />
               <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                    <CustomRegularPoppingText style={{}} value={userData?.email || "testemail@gmail.com"} fontSize={TEXT_SIZE.secondary} color={"#808A94"} />
                    <TouchableOpacity onPress={() => navigation.navigate("CustomEditSetting", { type: "email" })} style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 10, backgroundColor: COLORS.light }}>
                         <EditProfileScreenPen />
                         <CustomRegularPoppingText value={"Change"} fontSize={TEXT_SIZE.small} style={{ marginLeft: 10 }} color={COLORS.black} />
                    </TouchableOpacity>
               </View>

               <CustomSemiBoldPoppingText style={{ marginTop: 20 }} value={"Password reset"} fontSize={TEXT_SIZE.primary} color={"black"} />
               <CustomRegularPoppingText color={"#808A94"} style={{}} value={"You can update your password anytime you want, make sure not to share your password with other people to ensure the integrity of your account."} fontSize={TEXT_SIZE.secondary} />
               <TouchableOpacity onPress={() => setPasswordResetModal(true)} style={{ flexDirection: "row", marginTop: 20 }}>
                    <AccountSecurityScreenGuardIcon />
                    <CustomRegularPoppingText value={"Change password"} style={{ marginLeft: 10 }} color={"#E55E6F"} />
               </TouchableOpacity>


               <CustomSemiBoldPoppingText style={{ marginTop: 20 }} value={"Account Deletion"} fontSize={TEXT_SIZE.primary} color={"black"} />
               <CustomRegularPoppingText color={"#808A94"} style={{}} value={"By deleting your account, all data will be erased from our server, this action is irreversible."} fontSize={TEXT_SIZE.secondary} />


               <TouchableOpacity onPress={() => setDeleteAccountModal(true)} style={{ flexDirection: "row", marginTop: 20 }} >
                    <AccountSecurityScreenDelete />
                    <CustomRegularPoppingText value={"Delete my account"} style={{ marginLeft: 10 }} color={"#E55E6F"} />
               </TouchableOpacity>

               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={deleteAccountModal}
                    onRequestClose={() => setDeleteAccountModal(false)}
               >
                    {/* Semi-transparent overlay (simulates blur effect) */}
                    <Pressable
                         style={styles.overlay}
                         onPress={() => setDeleteAccountModal(false)}
                    >
                         {/* Actual modal content */}
                         <View style={styles.modalContainer}>
                              <View className={'gap-6 py-8'} style={styles.modalContent}>
                                   <View className={'flex items-center'}>
                                        <MaterialCommunityIcons name="delete-forever-outline" size={64} color={COLORS.red} />
                                        <View className='flex items-center' style={{ marginTop: 20, alignItems: "center" }}>
                                             <CustomSemiBoldPoppingText value={"Sur you want to delete your account?"} fontSize={TEXT_SIZE.primary} color={"black"} />
                                             <CustomRegularPoppingText color={"#808A94"} style={{}} value={"All your data will be erased, this action is irreversible."} fontSize={TEXT_SIZE.secondary} />
                                        </View>

                                        {isLoading ?
                                             <ActivityIndicator className='mt-4' color={COLORS.red} />
                                             :
                                             <TouchableOpacity onPress={() => deleteAccount()} style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: COLORS.red, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 20 }}>
                                                  <CustomRegularPoppingText color={'white'} value={"Yes, delete my account"} fontSize={TEXT_SIZE.primary} />
                                             </TouchableOpacity>
                                        }
                                   </View>
                              </View>
                         </View>
                    </Pressable>
               </Modal>

               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={PasswordResetModal}
                    onRequestClose={() => setPasswordResetModal(false)}
               >
                    {/* Semi-transparent overlay (simulates blur effect) */}
                    <Pressable
                         style={styles.overlay}
                         onPress={() => setPasswordResetModal(false)}
                    >
                         {/* Actual modal content */}
                         <View style={styles.modalContainer}>
                              <View className={'gap-6 py-8'} style={styles.modalContent}>
                                   <View className={'flex items-center w-full'}>
                                        <FontAwesome name="send-o" size={54} color={COLORS.red} />
                                        <View className='flex items-center' style={{ marginTop: 20, alignItems: "center" }}>
                                             <CustomSemiBoldPoppingText value={"Password reset token"} fontSize={TEXT_SIZE.primary} color={"black"} />
                                             <CustomRegularPoppingText color={"#808A94"} style={{}} value={"We will send you a password reset token via email"} fontSize={TEXT_SIZE.secondary} />
                                        </View>

                                        {isLoading ?
                                             <ActivityIndicator className='mt-4' color={COLORS.red} />
                                             :
                                             <TouchableOpacity onPress={() => {
                                                  setPasswordResetModal(false);
                                                  navigation.navigate("CustomEditSetting", { type: "password" })
                                             }}
                                                  style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: COLORS.red, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 20 }}>
                                                  <CustomRegularPoppingText color={'white'} value={"Reset my password"} fontSize={TEXT_SIZE.primary} />
                                             </TouchableOpacity>
                                        }
                                   </View>
                              </View>
                         </View>
                    </Pressable>
               </Modal>
          </View>
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

export default AccountSecurityScreen