import { SafeAreaView } from "react-native-safe-area-context"
import { View,TouchableOpacity,Image,Dimensions,FlatList,Text,Modal, StyleSheet,Pressable } from "react-native"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../components/text"
 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { PostAddIcon,MatchProfileArrowBack, MatchProfileBirthDay, MatchProfileEducation, MatchProfileFaithChurch, MatchProfileFaithIcon1, MatchProfileFaithOccupation, MatchProfileHome, MatchProfileLang, MatchProfilePlus, MatchProfileSexIcon, MatchProfileSmallHeart, MatchProfleSmallFace, PostScreenBookMark, ProfileScreenBookMark, ProfileScreenAddPost, PostScreenDots, ProfileScreenPostEdit, ProfileScreenPostDelete, ProfileScreenManageProfile, ProfileScreenAccountSecurity, ProfileScreenTheme, ProfileScreenGlobe, ProfileScreenPermissions, ProfileScreenQuestionMark, ProfileSCreenExclamation, ProfileScreenPrivacyPolicy, ProfileScreenLogOut  } from "../components/vectors";
import { COLORS, FAMILLY, TEXT_SIZE } from "../../utils/constants";
import { useGlobalVariable } from "../context/global";
 

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')


const ProfileScreen = ({navigation}) => {
     const [modalVisible,setModalVisible] = useState(false)
  
  const {isProfileMenuAcitve,activeSubCat,setActiveSubCat} = useGlobalVariable()

            const [posts,setPosts] = useState([
                 {
                      key:"post1",
                      img:require("../../assets/images/test_match1.jpg"),
                      postImg:require("../../assets/images/match_pro1.jpg"),
                      name:"Emanuel Sama",
                      time:"2h ago",
                      pupil:"SD Academy"
                 }])



          const [savePosts,setSavePosts] = useState([
                 {
                      key:"postsave1",
                      img:require("../../assets/images/test_match1.jpg"),
                      postImg:require("../../assets/images/match_pro1.jpg"),
                      name:"Emanuel Sama",
                      time:"2h ago",
                      pupil:"SD Academy"
                 }, {
                      key:"postsave2",
                      img:require("../../assets/images/test_match1.jpg"),
                      postImg:require("../../assets/images/match_pro1.jpg"),
                      name:"Emanuel Sama",
                      time:"2h ago",
                      pupil:"SD Academy"
                 }])
  
 

               

                           const renderPosts = ({item}) => {
                             
                                return (
    <View key={item?.key} style={{flex:1,marginVertical:10,marginRight:20,width:wp(90),flexDirection:"column"}}>
                                          <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>
                                          <View style={{flex:2,flexDirection:"row"}}>
                                          <TouchableOpacity style={{borderRadius:50,height:50,width:50,overflow:"hidden",alignItems:"center"}}><Image source={item.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/></TouchableOpacity>
                                          <View style={{flexDirection:"column",justifyContent:"center",marginLeft:10}}>
                                          <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.secondary-2,fontFamily:FAMILLY.semibold}}>{item.name}</Text>
                                          <Text style={{lineHeight:12,color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>{item.time}</Text>
                                          </View>
                                          </View>
                      
                                          <TouchableOpacity onPress={() => setModalVisible(true)} style={{backgroundColor:"white",height:25,width:80,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
                                             <PostScreenDots/>
                                             </TouchableOpacity>
                                          </View> 
                                          <View style={{marginVertical:10}}>
                                               <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>
                                               Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae.
                                               </Text>
                                          </View> 
                                          <TouchableOpacity style={{height:200,margin:0,padding:0,overflow:"hidden",borderRadius:20}}>
                                               <Image source={item.postImg} resizeMode="cover" style={{width:"100%",height:"100%"}}/>
                                          </TouchableOpacity> 
                                        
                                     </View>
                                )
                           }



                         const renderSavePosts = ({item}) => {
                               
                                return (
                          <View key={item?.key} style={{flex:1,marginVertical:10,marginRight:20,width:wp(90),flexDirection:"column"}}>
                                     
                                          <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>
                                          <View style={{flex:2,flexDirection:"row"}}>
                                          <TouchableOpacity style={{borderRadius:50,height:50,width:50,overflow:"hidden",alignItems:"center"}}><Image source={item.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/></TouchableOpacity>
                                          <View style={{flexDirection:"column",justifyContent:"center",marginLeft:10}}>
                                          <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.secondary-2,fontFamily:FAMILLY.semibold}}>{item.name}</Text>
                                          <Text style={{lineHeight:12,color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>{item.time}</Text>
                                          </View>
                                          </View>
                      
                                          <TouchableOpacity onPress={() => setModalVisible(true)} style={{backgroundColor:"white",height:25,width:80,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
                                             <PostScreenDots/>
                                             </TouchableOpacity>
                                          </View> 
                                          <View style={{marginVertical:10}}>
                                               <Text style={{color:COLORS.black,fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light}}>
                                               Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae.
                                               </Text>
                                          </View> 
                                          <TouchableOpacity style={{height:200,margin:0,padding:0,overflow:"hidden",borderRadius:20}}>
                                               <Image source={item.postImg} resizeMode="cover" style={{width:"100%",height:"100%"}}/>
                                          </TouchableOpacity> 
                                        
                                     </View>
                                )
                           }


     return <ScrollView showsVerticalScrollIndicator={false} style={{flex:1,backgroundColor:"white",paddingHorizontal:20,paddingTop:10}}>

          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}}>

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
               {['About',"Posts","Photos"].map((cat) => (
               <TouchableOpacity key={cat} onPress={() => setActiveSubCat(cat)} style={{marginRight:10,backgroundColor:activeSubCat ==cat ?COLORS.primary:"#F5F6FC",height:30,width:70,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
                    <CustomRegularPoppingText style={{textTransform:"capitalize"}} fontSize={TEXT_SIZE.small} value={cat} color={activeSubCat ==cat? "white":"#808A94"}/>
               </TouchableOpacity>


               ))}


               <TouchableOpacity onPress={()=> setActiveSubCat("savePost")} style={{height:30,width:30,borderRadius:100,backgroundColor:activeSubCat == "savePost" ?COLORS.primary:"#F5F6FC",alignItems:"center",justifyContent:"center"}}>
                <ProfileScreenBookMark fill={activeSubCat === "savePost" ? "white":"#808A94"}/>
               </TouchableOpacity>

               <TouchableOpacity onPress={()=>navigation.navigate("PostAdd")} style={{marginLeft:10,height:30,width:30,borderRadius:100,backgroundColor:"#2E2E2E",alignItems:"center",justifyContent:"center"}}>
               <ProfileScreenAddPost/>
               </TouchableOpacity>
 
          </View>

  

          </View>

          {activeSubCat == "About" && (
     <View style={{marginTop:20}}>
     <CustomRegularPoppingText fontSize={TEXT_SIZE.small} value="Bio" style={{}} color={null}/>
     <CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt dolore aperiam maiores quisquam quod. Quod accusantium architecto non molestias odit."/>
     
     <View style={{marginTop:30}}>
          <CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.primary} value="Interests"/>
          <View style={{flexDirection:"row",flexWrap:"wrap"}}>
          {["Travel","Music","Fishing","Gym","Bible","Dance"].map((d) => (
               <View key={d} style={{marginRight:10,marginBottom:5,paddingHorizontal:6,borderRadius:10,backgroundColor:COLORS.light}}>
                 <CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d}/>
               </View>
          ))}
          </View>

         
     </View>

     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Basic info"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileSexIcon/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Gender"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Female"/>
           </View>
     </View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileBirthDay/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Birthday"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="8 June 1998"/>
           </View>
     </View>


     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileHome/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Home"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Los Angeles, USA"/>
           </View>
     </View>


     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileLang/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Language"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="English, French"/>
           </View>
     </View>


     </View>


     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Faith"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileFaithIcon1/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Gave my life to God"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Since April 2017"/>
           </View>
     </View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileFaithChurch/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Church"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Revelation Church, Los Angeles"/>
           </View>
     </View>


     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileFaithOccupation/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Occupation"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Choir Leader"/>
           </View>
     </View>


     </View>


     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Education"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileEducation/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Masters Degree"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Lorem Ipsum university"/>
           </View>
     </View>


     

 


 


     </View>


     <CustomRegularPoppingText style={{marginTop:20}} color={null} fontSize={TEXT_SIZE.primary} value="Profession"/>
     <View>

     <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
          <View style={{marginRight:20,backgroundColor:COLORS.light,height:30,width:30,alignItems:"center",borderRadius:20,justifyContent:"center"}}><MatchProfileEducation/></View>
           <View>
               <CustomRegularPoppingText style={{lineHieght:8}} color={null} fontSize={TEXT_SIZE.small} value="Resource Manager at"/>
               <CustomRegularPoppingText style={{lineHeight:15}} color={null} fontSize={TEXT_SIZE.secondary+1} value="Lorem Ipsum company"/>
           </View>
     </View>
     </View>





     <View style={{marginTop:30}}>
          <CustomRegularPoppingText style={{}} color={null} fontSize={TEXT_SIZE.primary} value="Skills"/>
          <View style={{flexDirection:"row",flexWrap:"wrap"}}>
          {["Dancing","Acting","Singing","Writing"].map((d) => (
               <View key={d} style={{marginRight:10,marginBottom:5,paddingHorizontal:6,borderRadius:10,backgroundColor:COLORS.light}}>
                 <CustomRegularPoppingText fontSize={TEXT_SIZE.small} color={null} style={{}} value={d}/>
               </View>
          ))}
          </View>

         
     </View>


     <View style={{height:30}}></View>
     </View>
     )}


     {activeSubCat == "Posts" && (
      <FlatList
      data={posts}
      renderItem={renderPosts}
      keyExtractor={(item)=> item?.key || item?.id}
       
      showsHorizontalScrollIndicator={false}
      
      />
     )}

     {activeSubCat == "Photos" && (
          <View style={{marginTop:20,flexDirection:"row",flexWrap:"wrap"}}>
               <FlatList data={[{img:require("../../assets/images/match_pro1.jpg")},{img:require("../../assets/images/match_pro2.jpg")},{img:require("../../assets/images/match_pro3.jpg")}]}
                keyExtractor={(item) => item.img}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal={true}
                renderItem={({item}) => (
                    <View style={{height:100,width:100,marginRight:5,marginBottom:5,borderRadius:5,overflow:"hidden"}}>
                         <Image source={item.img} resizeMode="cover" style={{height:"100%",width:"100%"}}/>
                    </View>
                )}
               />
          </View>
     )}



     {activeSubCat == "savePost" && (
          <View>
     <CustomSemiBoldPoppingText style={{marginVertical:20}} color={"black"} fontSize={TEXT_SIZE.primary+2} value={"Save post"} />
      <FlatList
      data={savePosts}
      renderItem={renderSavePosts}
      keyExtractor={(item)=> item?.key || item?.id}
  
      showsHorizontalScrollIndicator={false}
      
      />
          </View>
     )}


     {activeSubCat === "account" && (
          <View style={{marginVertical:20}}>
               <TouchableOpacity style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
                    <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
                         <ProfileScreenManageProfile/>
                    </View>
                    <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Manage profile info"}/>
               </TouchableOpacity>

               <TouchableOpacity style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenAccountSecurity/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Account & Secirity"}/>
               </TouchableOpacity>



               <View style={{height:3,backgroundColor:COLORS.light,width:"100%",marginVertical:10}}>

               </View>


               <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenTheme/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Theme"}/>
               </View>

               <CustomRegularPoppingText style={{ }} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"}/>
               </TouchableOpacity>

              




               <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenGlobe/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Language"}/>
               </View>

               <CustomRegularPoppingText style={{ }} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"}/>
               </TouchableOpacity>

               <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenPermissions/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Manage app permissions"}/>
               </View>

               <CustomRegularPoppingText style={{ }} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"}/>
               </TouchableOpacity>

               
        <View style={{height:3,backgroundColor:COLORS.light,width:"100%",marginVertical:10}}>

        </View>


          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenQuestionMark/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Help"}/>
               </View>

               <CustomRegularPoppingText style={{ }} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"}/>
          </TouchableOpacity>


     
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileSCreenExclamation/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"About SDlove"}/>
               </View>

               <CustomRegularPoppingText style={{ }} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"}/>
          </TouchableOpacity>

     



          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenPrivacyPolicy/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={"black"} value={"Privacy policy"}/>
               </View>

               <CustomRegularPoppingText style={{ }} value="Comming soon" fontSize={TEXT_SIZE.small} color={"#A0A7AE"}/>
          </TouchableOpacity>




        <View style={{height:3,backgroundColor:COLORS.light,width:"100%",marginVertical:10}}>

        </View>

          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
               <View style={{flexDirection:"row",alignItems:"center"}}>
               <View style={{alignItems:"center",marginRight:20,justifyContent:"center",height:35,width:35,borderRadius:30,backgroundColor:COLORS.light}}>
               <ProfileScreenLogOut/>
               </View>
               <CustomSemiBoldPoppingText fontSize={TEXT_SIZE.secondary} style={{}} color={COLORS.red} value={"Logout"}/>
               </View>

             
          </TouchableOpacity>

              
          </View>
     )}

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
            <View style={styles.modalContent}>
               <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",marginTop:10}} onPress={() => {}}>
                    <ProfileScreenPostEdit/>
                    <CustomRegularPoppingText color={null} style={{marginLeft:20}} value={"edit post"} fontSize={TEXT_SIZE.secondary}/>
               </TouchableOpacity>


               <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",marginTop:10}} onPress={() => {}}>
                    <ProfileScreenPostDelete/>
                    <CustomRegularPoppingText color={null} style={{marginLeft:20}} value={"delete post"} fontSize={TEXT_SIZE.secondary}/>
               </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

          </ScrollView>
     
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
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

export default ProfileScreen



                                      
 