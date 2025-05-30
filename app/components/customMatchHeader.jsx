import { TouchableOpacity,View,Text } from "react-native"
import { COLORS,TEXT_SIZE,FAMILLY } from "../../utils/constants"
import { MatchScreenAdress, MatchScreenAdressWithBox, MatchScreenDownArrow, MatchScreenFilters, MatchScreenGridCards, MatchScreenSideCards } from "./vectors"
import { useState } from "react"
import { useGlobalVariable } from "../context/global"


const CustomMatchHeader = ({navigation}) => {

     const {setActiveScreen,activeScreen} = useGlobalVariable()

     const handleMatch = (type,route) => {
          if(type=="side") {
          setActiveScreen(type)
          navigation.navigate("BottomTabsHome",{screen:"Match"})
          } else if(type="grid") {
          setActiveScreen(type)
          navigation.navigate("MatchGrid")
          } else {
               setActiveScreen(type)
               navigation.navigate("MatchBox")
          }

     }

     return           <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",height:100,backgroundColor:"white",padding:20}}>
               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
                    <TouchableOpacity style={{marginRight:10}}><MatchScreenAdress/></TouchableOpacity>
                    <Text style={{color:COLORS.black,fontFamily:FAMILLY.medium,textTransform:"capitalize"}}>Chicago</Text>
                    <TouchableOpacity style={{ marginLeft:5}}><MatchScreenDownArrow/></TouchableOpacity>
               </View>
     
               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
                    <TouchableOpacity onPress={() => handleMatch("side")} style={{marginRight:10}}><MatchScreenSideCards stroke={activeScreen=='side'? "#D7A898":"#5E5E5E"}/></TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMatch('grid')} style={{marginRight:5}}><MatchScreenGridCards stroke={activeScreen=='grid'? "#D7A898":"#5E5E5E"}/></TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMatch('box')} style={{marginRight:10}}><MatchScreenAdressWithBox stroke={activeScreen=='box'? "#D7A898":"#5E5E5E"}/></TouchableOpacity>
                    <TouchableOpacity  style={{marginRight:0}}><MatchScreenFilters/></TouchableOpacity>
               </View>
               </View> 
}

export default CustomMatchHeader