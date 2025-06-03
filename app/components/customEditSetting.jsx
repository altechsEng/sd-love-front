import { useRoute } from "@react-navigation/native"
import {TouchableOpacity, View,ActivityIndicator,Text, Platform} from "react-native"
import { CustomRegularPoppingText } from "./text"
import { COLORS, TEXT_SIZE,FAMILLY } from "../../utils/constants"
import CustomTextInput from "./textInput"
import { useEffect, useState } from "react"
import { useGlobalVariable } from "../context/global"
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from 'dayjs'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TextInputArrowDownCircle, TextInputDate } from "./vectors"
import { getEmojiFlag } from "countries-list";
import CountryPickerModal from "./modalPicker"



const CustomEditSetting = ({navigation}) => {
   let {type} = useRoute().params
   const [isLoading,setLoading] = useState(false)
   const [show, setShow] = useState(false);
   const [visible,setVisible] = useState(false)
   const [visibleCity,setVisibleCity] = useState(false)
   const [date, setDate] = useState(new Date());
  
   
   const {updateSettingData,setUpdateSettingData,setSettingType} = useGlobalVariable()
   const [country,setCountry] = useState({
       flag:getEmojiFlag('CM'),
         name:"Cameroon",
         dial_code:"+237"
        })

  useEffect(() => {
    setSettingType(type)
  },[])

       const handleChange = (_, selectedDate) => {
         setShow(false)
         setShow(Platform.OS === "ios");
         if (selectedDate) {
           setDate(selectedDate)
           setUpdateSettingData((prev) => ({
               ...prev,dob:selectedDate
           }))
         }
       };



     const onSelect = (country) => {
          setUpdateSettingData(prev =>({
               ...prev,country,
               city:null
          }))
          setCountry(country)
       }

       const onSelectCity = (city) => {
        setUpdateSettingData(prev =>({
               ...prev,
               city:city?.name
          }))
         
        
     }
   
     return <View style={{flex:1,backgroundColor:"white",padding:20}}>
          {type=="name" ? <View style={{flex:5}}>
          <CustomRegularPoppingText fontSize={TEXT_SIZE.secondary} color={COLORS.black} style={{marginTop:20}} value={"Before you proceed, you should note that people may note be able to easily find you after changing your name."}/>
     
     <View style={{marginTop:20,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:36,width:"100%",     backgroundColor:"#F5F6FC",}}>
  <CustomTextInput RightIconStyles={null} name="firstname" placeHolder="First Name" LeftIcon={"person"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null}   setState={(text) => setUpdateSettingData((prev) => ({...prev,firstname:text}))} state={updateSettingData.firstname}/>
     </View>

<View style={{marginTop:20,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:36,width:"100%",     backgroundColor:"#F5F6FC",}}>
   <CustomTextInput RightIconStyles={null} name="lastname" placeHolder="Last Name" LeftIcon={"person"} LeftIconStyles={{position:"absolute",top:15,left:18}} RightIcon={null} setState={(text) => setUpdateSettingData((prev) => ({...prev,lastname:text}))} state={updateSettingData.lastname}/>
     </View>
</View>:null}



{type=="dob"? <View style={{flex:5}}>
          <CustomRegularPoppingText fontSize={TEXT_SIZE.secondary} color={COLORS.black} style={{marginTop:20}} value={"Changing your date of birth may affect your match results."}/>
     
 

               <View style={{marginVertical:20,borderRadius:10,paddingVertical:0,paddingHorizontal:20,width:"100%",     backgroundColor:"#F5F6FC"}}>
             
               <View style={{paddingVertical:10,paddingHorizontal:0,width:"100%",borderRadius:10,flexDirection:"row",alignItems:"center"}}>
                    <TouchableOpacity onPress={() => setShow(true)} style={{alignSelf:"flex-start"}}><TextInputDate/></TouchableOpacity>
                   <View style={{marginTop:2,marginLeft:5}}> 
                    <CustomRegularPoppingText   value={dayjs(date).format('DD MMMM YYYY')} color={'black'} fontSize={TEXT_SIZE.primary}/>
                    </View>
               </View>
               {show && (
                  <DateTimePicker
                   value={updateSettingData.dob}
                    mode="date"
                    display="default"
                    onChange={handleChange}
             />
           )}
               </View>
     
</View>:null}
     

{type=="address"? <View style={{flex:5}}>
          <CustomRegularPoppingText fontSize={TEXT_SIZE.secondary} color={COLORS.black} style={{marginTop:20}} value={"Changing your address will affect your proximity on the map with your matches."}/>

               <View style={{alignItems:"center",flex:3}}>
            
             
              <View style={{marginTop:hp(5),position:"relative",borderRadius:10,paddingVertical:5,paddingHorizontal:21,width:"100%", backgroundColor:"#F5F6FC",flexDirection:"row",alignItems:"center"}}>
      {visible &&    <CountryPickerModal type={'country'} title="Select country" visible={visible} onSelect={onSelect} onClose={()=> setVisible(false)}/>
     }
   <Text style={{ color:COLORS.gray,fontSize:TEXT_SIZE.title,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{updateSettingData?.country?.flag || country?.flag}</Text>
       <Text style={{paddingLeft:12,fontSize:TEXT_SIZE.primary, color:COLORS.gray,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{updateSettingData?.country?.name || "Cameroon"}</Text>

       <TouchableOpacity onPress={() => setVisible(true)} style={{position:"absolute",right:18,top:15}}><TextInputArrowDownCircle/></TouchableOpacity>
      </View>
             
      <View style={{marginTop:10,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:36,width:"100%", backgroundColor:"#F5F6FC",}}>
      {visibleCity &&    <CountryPickerModal check={country.flag} type='city' title="Select country" visible={visibleCity} onSelect={onSelectCity} onClose={()=> setVisibleCity(false)}/>}
          <CustomTextInput rightIconAction={()=> setVisibleCity(true)} name="city" placeHolder="City" LeftIcon={"city"} LeftIconStyles={{position:"absolute",top:15,left:23}} RightIcon={"arrow"} RightIconStyles={{position:"absolute",top:15,right:18}} setState={(text) => setUpdateSettingData((prev) => ({...prev,city:text}))} state={updateSettingData?.city}/>
      </View>
             
          
             
             
             
             <View style={{marginTop:10,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:40,width:"100%", backgroundColor:"#F5F6FC"}}>
             <CustomTextInput name="address" placeHolder={"Address" }LeftIcon={"address"} LeftIconStyles={{position:"absolute",top:11,left:18}} RightIcon={null} RightIconStyles={null} setState={(text) => setUpdateSettingData(prev=>({...prev,address:text}))} state={updateSettingData?.address}/>
             </View>
             
           
             
             
             
             
             
               </View>
     
</View>:null}



{type=="tel" ? <View style={{flex:5}}>
          <CustomRegularPoppingText fontSize={TEXT_SIZE.secondary} color={COLORS.black} style={{marginTop:20}} value={"Enter your new phone number in the form below"}/>
          <View style={{marginTop:10,flexDirection:"row",alignItems:"Center"}}>
             {visible &&    <CountryPickerModal type={'country'} title="Select country code" visible={visible} onSelect={onSelect} onClose={()=> setVisible(false)}/>
  }
          
          
            
                <TouchableOpacity onPress={() => setVisible(true)} style={{flex:1,borderRadius:10, backgroundColor:"#F5F6FC",flexDirection:"row",alignItems:"center",justifyContent:"center",paddingHorizontal:15}}>
                <View>
                <Text style={{ color:COLORS.gray,fontSize:TEXT_SIZE.title,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{country.flag}</Text>
                </View>
                
                <Text style={{ color:COLORS.gray,fontSize:TEXT_SIZE.small,fontFamily: FAMILLY.regular,textAlign:"center",marginTop:5}}>{country?`${country?.dial_code}`:"+1"}</Text>
                </TouchableOpacity>
          
                <View style={{ marginLeft:10,flex:2,position:"relative",borderRadius:10,paddingVertical:0,paddingHorizontal:36, backgroundColor:"#F5F6FC"}}>
                <CustomTextInput name="phone" placeHolder={"Phone" }LeftIcon={"phone"} LeftIconStyles={{position:"absolute",top:14,left:18}} RightIcon={null} RightIconStyles={null} setState={(text) => setUpdateSettingData((prev) => ({...prev,phone:text}))} state={updateSettingData?.phone}/>
          
                </View>
          
          
          
          
          </View>
     
</View>:null}
     </View>
}


export default CustomEditSetting