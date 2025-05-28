import { Text, View, TouchableOpacity, Image,SafeAreaView, StatusBar,TextInput } from "react-native";
import React,{useEffect, useState} from "react";
import {FAMILLY,COLORS,TEXT_SIZE} from "../../utils/constants.js"
import { ScrollView } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
 
import CustomTextInput from "../components/textInput.jsx";
import CountryPickerModal from "../components/modalPicker.jsx";
import {countries} from "countries-list"
import { getEmojiFlag } from "countries-list";
import { useGlobalVariable } from "../context/global.jsx";


export default function Register({navigation}) {
  const {setRegistrationData,registrationData} = useGlobalVariable()
 const [country_phone,setcountry_phone] = useState()
  const handleData = () => {
    setRegistrationData((prev)=> ({
      ...prev,
        firstname:firstName,
        lastname:lastName,
        email,
        phone,
        phone_code:country.dial_code,
        country_phone
      
    }))

    navigation.navigate("RegisterStep2")
  }

  useEffect(()=>{
    setEmail(registrationData?.email)
    setFirstName(registrationData?.firstName)
    setLastName(registrationData?.lastName)
    setPhone(registrationData?.phone)
    if(registrationData?.country_phone) setCountry(registrationData?.country_phone)

  },[])

  const [filter, setFilter] = useState('');
  const [email,setEmail] = useState(null)

  const [firstName,setFirstName] = useState(null)
  const [lastName,setLastName] = useState(null)
  const [phone,setPhone] = useState(null)
  const [country,setCountry] = useState({
    dial_code:"+237",
    flag:getEmojiFlag('CM')
  })
  const [visible,setVisible] = useState(false)

  const onSelect = (country) => {
    console.log(country,"Dataioooooo")
     setCountry(country)
     setcountry_phone(country)
  }

  return (
 
    <ScrollView showsVerticalScrollIndicator={false}  style={{flexDirection:"column",backgroundColor:"white"}}>
 
   

 
   <View style={{flex:2,height:70}}></View>
   {visible &&    <CountryPickerModal type={'country'} title="Select country code" visible={visible} onSelect={onSelect} onClose={()=> setVisible(false)}/>
  }

   <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",position:"relative"}}>
  
     <View style={{borderRadius:50,height:50,width:50,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}>
          <Text style={{color:"white",fontFamily:FAMILLY.semibold,textAlign:"center",fontSize:TEXT_SIZE.title,marginTop:5}}>1</Text>
     </View>

     <View style={{position:"absolute",right:-10,height:5,width:"50%",backgroundColor:COLORS.primary}}>

     </View>
     
     <View style={{position:"absolute",right:-25,borderRadius:50,height:50,width:50,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}>  
     </View>
   
   </View>

  <View style={{alignItems:"center",flex:3,height:500,marginTop:50}}>
  <Text style={{fontSize:TEXT_SIZE.title *1.2,color:COLORS.gray,fontWeight:"bold",fontFamily:FAMILLY.semibold,marginVertical:10}}>Sign Up</Text>
  <Text style={{fontSize:TEXT_SIZE.small+1,color:COLORS.gray,fontFamily:FAMILLY.regular,width:wp(70),textAlign:"center"}}>
           All fields are required.
  </Text>


 <View style={{marginTop:hp(5),position:"relative",borderRadius:50,paddingVertical:10,paddingHorizontal:36,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)",}}>
     <CustomTextInput name="firstName" placeHolder="First Name" LeftIcon={"person"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null} RightIconStyles={null} setState={setFirstName} state={firstName}/>
 
  
 
</View>

<View style={{marginTop:10,position:"relative",borderRadius:50,paddingVertical:10,paddingHorizontal:36,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)",}}>
<CustomTextInput name="lastName" placeHolder="Last Name" LeftIcon={"person"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null} RightIconStyles={null} setState={setLastName} state={lastName}/>
     
 
</View>



<View style={{marginTop:10,paddingHorizontal:wp(10),flexDirection:"row",alignItems:"Center"}}>



  
      <TouchableOpacity onPress={() => setVisible(true)} style={{flex:1,borderRadius:20, backgroundColor:"rgba(181, 181, 181, 0.12)",flexDirection:"row",alignItems:"center",justifyContent:"center",paddingHorizontal:15}}>
      <View>
      <Text style={{ color:COLORS.gray,fontSize:TEXT_SIZE.title,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{country.flag}</Text>
      </View>
      
      <Text style={{ color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{country?`${country?.dial_code}`:"+1"}</Text>
      </TouchableOpacity>

      <View style={{ marginLeft:10,flex:2,position:"relative",borderRadius:50,paddingVertical:10,paddingHorizontal:36, backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
      <CustomTextInput name="phone" placeHolder={"Phone" }LeftIcon={"phone"} LeftIconStyles={{position:"absolute",top:14,left:18}} RightIcon={null} RightIconStyles={null} setState={setPhone} state={phone}/>

      </View>




</View>


<View style={{marginTop:10,position:"relative",borderRadius:50,paddingVertical:10,paddingHorizontal:40,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
<CustomTextInput name="email" placeHolder={"Email" }LeftIcon={"email"} LeftIconStyles={{position:"absolute",top:14,left:18}} RightIcon={null} RightIconStyles={null} setState={setEmail} state={email}/>
    
</View>

<TouchableOpacity onPress={() => handleData()}  style={{backgroundColor:COLORS.primary,marginTop:hp(6), paddingVertical:10,marginVertical:20,paddingHorizontal:20,width:"80%", borderRadius:100}}>
       <Text style={{color:"white",textAlign:"center",fontFamily:FAMILLY.regular}} > next </Text>
</TouchableOpacity>


<View style={{flex:3,height:hp(5),justifyContent:"flex-end"}}>
  <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
       <Text style={{fontSize:TEXT_SIZE.secondary,color:COLORS.gray,fontFamily:FAMILLY.regular}}>Have an account ? </Text>
       <TouchableOpacity style={{marginTop:1}} onPress={()=> navigation.navigate("Login")}>
       <Text style={{fontSize:TEXT_SIZE.secondary,color:COLORS.primary,fontFamily:FAMILLY.regular}}>Sign in</Text>
       </TouchableOpacity>
       </View>
  </View>


  </View>




 
 
    </ScrollView>
   
  );
}