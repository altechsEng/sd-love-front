import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../../app/components/text"
import { NotificationScreenDots } from "../../components/vectors"
import { COLORS, TEXT_SIZE } from "../../../utils/constants"
import React,{useState} from "react"
import {Text,View,TouchableOpacity,FlatList, ScrollView,Image} from "react-native"

const NotificationsScreen = ({navigation}) =>  {
     const [newNotifications,setNewNotifications] = useState([
{
     img:require("../../../assets/images/test_match1.jpg"),
     id:"img1-test",
     name:"Maggy MacLeen",
     message:"has added a new post check it out",
     time:"Today, 15:52"
},
{
     img:require("../../../assets/images/grid2.png"),
     id:"img2-test",
     name:"Maggy MacLeen",
     message:"liked your post",
     time:"Today, 15:52"
},
{
     img:require("../../../assets/images/grid1.png"),
     id:"img3-test",
     name:"Maggy MacLeen",
     message:"commented your post.",
     time:"Today, 15:52"
}
     ])

     const [readNotifications,setreadNotifications] = useState([
          {
               img:require("../../../assets/images/test_match1.jpg"),
               id:"img1-test",
               name:"Maggy MacLeen",
               message:"has added a new post check it out",
               time:"Today, 15:52"
          },
          {
               img:require("../../../assets/images/grid2.png"),
               id:"img2-test",
               name:"Maggy MacLeen",
               message:"liked your post",
               time:"Today, 15:52"
          },
          {
               img:require("../../../assets/images/grid4.png"),
               id:"img3-test",
               name:"Maggy MacLeen",
               message:"commented your post.",
               time:"Today, 15:52"
          },
          {
               img:require("../../../assets/images/grid1.png"),
               id:"img3-test",
               name:"Maggy MacLeen",
               message:"commented your post.",
               time:"Today, 15:52"
          },
          {
               img:require("../../../assets/images/grid2.png"),
               id:"img3-test",
               name:"Maggy MacLeen",
               message:"commented your post.",
               time:"Today, 15:52"
          },
          {
               img:require("../../../assets/images/grid4.png"),
               id:"img3-test",
               name:"Maggy MacLeen",
               message:"commented your post.",
               time:"Today, 15:52"
          },
          {
               img:require("../../../assets/images/grid3.png"),
               id:"img3-test",
               name:"Maggy MacLeen",
               message:"commented your post.",
               time:"Today, 15:52"
          }
               ])

     const renderNotofications = ({item}) => {

          return   <View  style={{flex:1,marginBottom:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
          
                  <View  >
                  <View style={{height:50,width:50,borderRadius:50,overflow:"hidden"}}>
                      <Image source={item.img} style={{height:"100%",width:"100%"}}/>
                  </View>
        
                  </View>
          
          
                  <View style={{flex:5,marginLeft:10}}>
                    <Text>
                  <CustomSemiBoldPoppingText style={{}} color={"black"} fontSize={TEXT_SIZE.primary} value={`${item.name} `}/>
                   {item.message}
                  </Text>
                  <CustomRegularPoppingText style={{}} color={"rgba(0, 0, 0, 0.48)"} fontSize={TEXT_SIZE.small} value={item.time}/>
                  </View>
          
                  <TouchableOpacity style={{flex:0.7,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <NotificationScreenDots/>
                  </TouchableOpacity>
          
                  </View>
     }

return <View style={{backgroundColor:"white",padding:20,flex:1}}>
     
     <CustomSemiBoldPoppingText value="New" style={{marginBottom:20}} color={"#808A94"} fontSize={TEXT_SIZE.secondary}/>

     <FlatList
     data={newNotifications}
     renderItem={renderNotofications}
     keyExtractor={(item) => item?.id}
     initialNumToRender={10}
     showsVerticalScrollIndicator={false}
     />

<CustomSemiBoldPoppingText value="Read Notifications" style={{marginVertical:20}} color={"#808A94"} fontSize={TEXT_SIZE.secondary}/>

<FlatList
     data={readNotifications}
     renderItem={renderNotofications}
     keyExtractor={(item) => item?.id}
     initialNumToRender={10}
     showsVerticalScrollIndicator={false}
     />
</View>
}

export default NotificationsScreen