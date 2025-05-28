import { COLORS, FAMILLY, TEXT_SIZE } from "../../utils/constants";
import React, { useState } from "react"
import {Text,View,TouchableOpacity} from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { PinkTick } from "../components/vectors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function SelectPlan() {
     const [active,setActive]= useState(false)

     const options = [
          {
               key:"option-one",
               amount:0,
               plan:"Free",
               gains:["Creation of profile","5 likes per day, no super like","No getting back to previous profile","short video from SD Academy"]
          },
          {
               key:"option-two",
               amount:14.99,
               plan:"Standard",
               gains:["Creation of profile","Best profile referencing","Search by geolocation","SD social selection criteria","20 likes per day, 5 super likes per day","Unlimited swipe return","Short video from SD Academy"]
          } ,
          {
               key:"option-three",
               amount:24.99,
               plan:"Silver",
               gains:["Creation of profile","Best profile referencing","Search by geolocation","SD social selection criteria","20 likes per day, 5 super likes per day","Unlimited swipe return","Short video from SD Academy"]
          },
     ]

     return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:"center"}} style={{flex:1,backgroundColor:"white"}}>
          <View style={{flex:1,marginHorizontal:10,marginVertical:20}}><Text style={{color:COLORS.gray,fontFamily:FAMILLY.regular,fontSize:TEXT_SIZE.secondary-1,}}>Select a bundle that suits you best, then press on <Text style={{color:COLORS.black,fontFamily:FAMILLY.semibold}}>next</Text>.</Text></View>
          {options.map((op) => {
               
               return (
                    <TouchableOpacity key={op.key} onPress={() => setActive(op.key)} style={{padding:2,borderWidth:2,borderColor:active == op.key?COLORS.primary:"rgba(94, 94, 94, 0.17)",borderRadius:10,overflow:"hidden",marginBottom:10}}>
                    <View style={{width:wp(90),padding:20,borderRadius:10}}>
          
                         <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                         <Text style={{fontFamily:FAMILLY.semibold,fontSize:TEXT_SIZE.title}}>€{op.amount}</Text>
                         
                         <View style={{backgroundColor:COLORS.primary,paddingVertical:5,paddingHorizontal:10,borderRadius:20}}>
                         <Text style={{color:"white",fontFamily:FAMILLY.semibold,fontSize:TEXT_SIZE.secondary - 2}}>{op.plan}</Text>
                         </View>
          
            
          
                         </View>
          
                         <View style={{marginBottom:20}}>
                         <Text style={{color:COLORS.gray,fontSize:TEXT_SIZE.small}}>Per month</Text>
                         </View>

                         {op?.gains.map((gain) => (
                         <View key={gain}>
                              <View style={{flexDirection:"row"}}>
                                   <PinkTick/>
                                   <Text style={{marginLeft:10,fontSize:TEXT_SIZE.small}}>{gain}</Text>
                              </View>
          

          
                         </View>
                         ))}
          
                    </View>
                    </TouchableOpacity>
               )
          })}

          </ScrollView>
}