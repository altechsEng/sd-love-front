import { Text, View, TouchableOpacity, Image,SafeAreaView, StatusBar,TextInput } from "react-native";
import React,{useEffect, useState} from "react";
import {FAMILLY,COLORS,TEXT_SIZE} from "../../utils/constants.js"
import { ScrollView } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
 
import CustomTextInput from "../components/textInput";
import { HeaderBackArrow, TextInputArrowDownCircle } from "../components/vectors.js";
import CountryPickerModal from "../components/modalPicker";
import { getEmojiFlag } from "countries-list";
import { useGlobalVariable } from "../context/global";

export default function RegisterStep2({navigation}) {
    const {setRegistrationData,registrationData} = useGlobalVariable()

      useEffect(()=>{
        setAddress(registrationData?.address)
        setCity(registrationData?.city)
        if(registrationData?.country_dat) setCountry(registrationData?.country_dat)
      },[])

     const handleData = () => {
       setRegistrationData((prev)=> ({
        
        ...prev,
        address,
        city,
        country:country?.name,
        country_dat:country,
       
       }))

      navigation.navigate("Questionaire")
     }
    

    const [country,setCountry] = useState({
    flag:getEmojiFlag('CM'),
      name:"Cameroon",
      dial_code:"+237"
     })
     const [city,setCity] = useState(null)
     const [address,setAddress] = useState(null)
       const [visible,setVisible] = useState(false)
       const [visibleCity,setVisibleCity] = useState(false)
     
     
       const onSelect = (country) => {
          setCountry(country)
          setCity(null)
       }

       const onSelectCity = (city) => {
        console.log(city,"many cities",country)
        setCity(city?.name)
     }

       
     return <ScrollView showsVerticalScrollIndicator={false}  style={{flexDirection:"column",backgroundColor:"white"}}>





             <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",position:"relative"}}>
            
               <View style={{borderRadius:50,height:50,width:50,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}>
                    <Text style={{color:"white",fontFamily:FAMILLY.semibold,textAlign:"center",fontSize:TEXT_SIZE.title,marginTop:5}}>2</Text>
               </View>
          
               <View style={{position:"absolute",left:-10,height:5,width:"50%",backgroundColor:COLORS.primary}}>
          
               </View>
               
               <View style={{position:"absolute",left:-25,borderRadius:50,height:50,width:50,backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"center"}}>  
               </View>
             
             </View>


             
               <View style={{alignItems:"center",flex:3,height:500,marginTop:50}}>
               <Text style={{fontSize:TEXT_SIZE.title *1.2,color:COLORS.gray,fontWeight:"bold",fontFamily:FAMILLY.semibold,marginVertical:10}}>Address</Text>
               <Text style={{fontSize:TEXT_SIZE.small+1,color:COLORS.gray,fontFamily:FAMILLY.regular,width:wp(70),textAlign:"center"}}>
                        Fill in your address. All fields are mandetory
               </Text>
             
             
              <View style={{marginTop:hp(5),position:"relative",borderRadius:50,paddingVertical:5,paddingHorizontal:21,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)",flexDirection:"row",alignItems:"center"}}>
      {visible &&    <CountryPickerModal type={'country'} title="Select country" visible={visible} onSelect={onSelect} onClose={()=> setVisible(false)}/>
     }
   <Text style={{ color:COLORS.gray,fontSize:TEXT_SIZE.title,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{country.flag}</Text>
       <Text style={{paddingLeft:12,fontSize:TEXT_SIZE.primary, color:COLORS.gray,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{country?`${country?.name}`:"Cameroon"}</Text>

       <TouchableOpacity onPress={() => setVisible(true)} style={{position:"absolute",right:18,top:15}}><TextInputArrowDownCircle/></TouchableOpacity>
      </View>
             
      <View style={{marginTop:10,position:"relative",borderRadius:50,paddingVertical:0,paddingHorizontal:36,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)",}}>
      {visibleCity &&    <CountryPickerModal check={country.flag} type='city' title="Select country" visible={visibleCity} onSelect={onSelectCity} onClose={()=> setVisibleCity(false)}/>}
          <CustomTextInput rightIconAction={()=> setVisibleCity(true)} name="city" placeHolder="City" LeftIcon={"city"} LeftIconStyles={{position:"absolute",top:15,left:23}} RightIcon={"arrow"} RightIconStyles={{position:"absolute",top:15,right:18}} setState={setCity} state={city}/>
      </View>
             
          
             
             
             
             <View style={{marginTop:10,position:"relative",borderRadius:50,paddingVertical:0,paddingHorizontal:40,width:"80%", backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
             <CustomTextInput name="address" placeHolder={"Address" }LeftIcon={"address"} LeftIconStyles={{position:"absolute",top:11,left:18}} RightIcon={null} RightIconStyles={null} setState={setAddress} state={address}/>
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
}