 



import React, {
     createContext,
     useContext,
     useEffect,
     useState,
   } from "react";
import { getEmojiFlag } from "countries-list";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

 

  

  export const GlobalVariableContext = createContext({
    
    user : "",
    setUser:(user) => {},
    questioniareLevel:"",
    setQuestionaireLevel:(level) => {},
    questionnaireProgress:0,
    setQuestionnaireProgress: (progress)=> {},
    registrationData:{},
    setRegistrationData:(data) => {},
    questionnaireData: {},
    setQuestionnaireData: (value) => {},
    err:"",
    setErr:(value) => {},
    handleSubmitAddPost:() => {},
    postAddData:{text:"",media:[]},
    setPostAddData:(value) => {},
    postEditData:{text:"",media:[]},setPostEditData:(value) => {},
    activeScreen:"side",
    setActiveScreen:(value) => {} ,
    activeSubCat:"About" ,setActiveSubCat: (value) => {},
    isLoading:false,setIsLoading:(val) => {},
    updateSettingData:"",setUpdateSettingData:(val) => {},
    settingType:"",setSettingType:(val) => {},
    userData:{},setUserData:(val) => {},
    image:"",setImage:(val) => {},
    refreshUserData:null,setRefreshUserData:(val) => {},
    isProfileMenuAcitve:false, setIsProfileMenuActive:(val) => {},
    editingPostItem:"",setEditingPostItem:(val) => {}
   
   })

   
   export const useGlobalVariable = () => {
     const context = useContext(GlobalVariableContext);
     if (context === undefined) {
       throw new Error(
         "useGlobalVariable must be used within a GlobalVariableProvider"
       );
     }
     return context;
   };
 
   
   export const GlobalVariableProvider = ({
     children,
   }) => {



  const [editingPostItem,setEditingPostItem] = useState(null)
  const [user, setUser] = useState(null);
  const [questioniareLevel,setQuestionaireLevel] = useState("1/2 Questions générales")
  const [questionnaireProgress, setQuestionnaireProgress] = useState(0);
  const [registrationData,setRegistrationData] = useState({})
  const [err,setErr] = useState("")

  const [questionnaireData, setQuestionnaireData] = useState({
    answers:{
         // Personal Questions (qP)
         qP1: "", // Gender (Quel est ton sexe)
         qP2: new Date(), // Birth date (Quel est ta date de naissance)
         qP3: "", // Marital status (Quel est ton état civil)
         qP4: "", // Has children (As-tu un ou des enfants)
         qP5: "", // Comfortable with partner having children
         qP6: "", // Height (Quelle est ta taille)
         qP7: "", // Comfortable with shorter partner
         qP8: "", // Origin (Quelle est ton origine)
         qP9:  "Cameroon",
         qP10: "", // Open to different nationality
         qP11: "", // Education level (Quel est ton niveau d'études)
         qP12: "", // Comfortable with less educated partner
         qP13: [], // Love languages (max 2)
         qP14: "", // Dominant temperament
         qP15: [], // Important things in relationship (max 5)
         qP16: [], // Interests/hobbies (min 5)
         
         // Spiritual Questions (qS) - from Questionaire2
         qS1: "", // Relationship with God description
         qS2: "", // Time walking with God
         qS3: "", // Religious denomination
         qS4: "", // Open to different denomination
         qS5: "", // Water baptism
         qS6: "", // Holy Spirit baptism
         qS7: "", // Regular church member
         qS8: "", // If not church member, reason
         qS9: "", // Other reason for not being church member
         qS10: [], // Church service preferences (max 3)
         qS11: "", // Belief in sexual abstinence
         qS12: "", // Belief in tithing
         qS13: ""  // Importance of spiritual life in marriage
       },

       answered:{
         // Personal Questions (qP)
         qP1:false, // Gender (Quel est ton sexe)
         qP2:false, // Birth date (Quel est ta date de naissance)
         qP3:false, // Marital status (Quel est ton état civil)
         qP4:false, // Has children (As-tu un ou des enfants)
         qP5:false, // Comfortable with partner having children
         qP6:false, // Height (Quelle est ta taille)
         qP7:false, // Comfortable with shorter partner
         qP8:false, // Origin (Quelle est ton origine)
         qP9: false,
         qP10:false, // Open to different nationality
         qP11:false, // Education level (Quel est ton niveau d'études)
         qP12:false, // Comfortable with less educated partner
         qP13:false, // Love languages (max 2)
         qP14:false, // Dominant temperament
         qP15:false, // Important things in relationship (max 5)
         qP16:false, // Interests/hobbies (min 5)
         
         // Spiritual Questions (qS) - from Questionaire2
         qS1: false, // Relationship with God description
         qS2: false, // Time walking with God
         qS3: false, // Religious denomination
         qS4: false, // Open to different denomination
         qS5: false, // Water baptism
         qS6: false, // Holy Spirit baptism
         qS7: false, // Regular church member
         qS8: false, // If not church member, reason
         qS9: false, // Other reason for not being church member
         qS10: false, // Church service preferences (max 3)
         qS11: false, // Belief in sexual abstinence
         qS12: false, // Belief in tithing
         qS13: false  // Importance of spiritual life in marriage
       }
});

     
const [postAddData,setPostAddData] = useState({
  text:"",
  media:[]
})

const [postEditData,setPostEditData] = useState({
  text:"",
  media:[]
})

const [activeSubCat ,setActiveSubCat] = useState('About')
const [activeScreen,setActiveScreen] = useState("side")
const [isLoading,setIsLoading] = useState(false)
const [refreshUserData,setRefreshUserData] = useState(null)
const [settingType,setSettingType] = useState(null)
const [isProfileMenuAcitve, setIsProfileMenuActive] = useState(false)

const [image,setImage] = useState(null)
const [userData,setUserData] = useState({}) // load it here once 
const navigation = useNavigation()
const loadData = async() => {
    try {
         let result = await AsyncStorage.getItem("user_data")
         if(result) {
                   let data = await JSON.parse(result)
          
         setUserData({...data?.user,dob:data?.user_info[0]?.qP2})
       
      
         if(data?.user_image) setImage(data?.user_image)
         else setImage(null)

        return result

         }

       return null
 
    } catch(err) {
         console.log(err,"Eror")
         throw(err)
    }
         
    }
  
  useEffect(() => {
  let result = loadData()
  if(result && navigation){
    navigation.navigate("BottomTabsHome",{screen:"HomeFeed"})
  }
  },[])


//for updating
const [updateSettingData,setUpdateSettingData] = useState({
            settingType :"",
            firstname:"",
            lastname :"",
            dob :new Date(),
            country :"Cameroon",
            city:"",
            address:"",
            phone_code :"",
            phone :"",
            email :""
})
 
   
     return (
       <GlobalVariableContext.Provider
         value={{ 
        user,
        setUser,
        questionnaireProgress,
        setQuestionnaireProgress,
        questioniareLevel,
        setQuestionaireLevel,
        registrationData,
        setRegistrationData ,
        questionnaireData,
        setQuestionnaireData,
        err,
        setErr,
        postAddData,
        setPostAddData,
        activeScreen,
        setActiveScreen,
        isLoading,setIsLoading,
        activeSubCat ,setActiveSubCat,
        updateSettingData,setUpdateSettingData,
        settingType,setSettingType,
        image,setImage,userData,setUserData,
        refreshUserData,setRefreshUserData,loadData,
        isProfileMenuAcitve, setIsProfileMenuActive,
        setPostEditData,postEditData,
        editingPostItem,setEditingPostItem
          }}
       >
         {children}
       </GlobalVariableContext.Provider>
     );
   };
