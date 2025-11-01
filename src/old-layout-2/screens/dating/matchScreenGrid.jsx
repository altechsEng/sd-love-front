
import MasonryList from "@react-native-seoul/masonry-list"
import { defaultProfiles, FAMILLY, TEXT_SIZE } from "../../../utils/constants"
import { TouchableOpacity,Image,Text,View,Dimensions } from "react-native"
import { LinearGradient } from "react-native-linear-gradient";
const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')

 

const MatchScreenGrid = ({navigation}) => {

          const renderProfile = ({item})=> (
                    <View key={item.key} style={{borderRadius:20,overflow:"hidden",marginBottom:10,height:200,marginRight:10}}>
                    <LinearGradient colors={["rgba(215, 168, 152, 0)","rgba(215, 168, 152, 1)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:55,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:0,width:"100%"}} >
                    <View style={{flexDirection:"column",marginLeft:10}}>
                    <View style={{ height:19, flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontSize:TEXT_SIZE.secondary,fontFamily:FAMILLY.semibold,color:"white"}}>{item.name}, </Text>
                    <Text style={{fontSize:TEXT_SIZE.secondary ,margin:0,padding:0,fontFamily:FAMILLY.light,color:"white",marginLeft:10,marginTop:3,textAlign:"center",textAlignVertical:"center"}}>{item.age} ans</Text>
                    </View>
                    <View style={{}}>
                    <Text style={{fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light,color:"white"}}>{item.location}</Text>
                    </View>
                    </View>         
                    </LinearGradient>
                   <TouchableOpacity> 
                    <Image source={item.image} resizeMode="cover" style={{height:"100%",width:"100%"}}/>
                    </TouchableOpacity>
                    </View>
               )


     return                <MasonryList
                    keyExtractor={(item) => item.key}
                    data={defaultProfiles}
                    renderItem={renderProfile}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
      
                    />
}

export default MatchScreenGrid