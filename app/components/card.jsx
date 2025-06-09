import {StyleSheet,View,TouchableOpacity,Text, Dimensions} from 'react-native';
import React, { useEffect,useState } from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
  runOnJS,
  useAnimatedReaction
} from 'react-native-reanimated';
import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import { LinearGradient } from "react-native-linear-gradient";
import { TEXT_SIZE,COLORS,FAMILLY, BaseImageUrl } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { calculateAge } from '../../utils/functions';
import { MatchScreenFace, MatchScreenHeartWhite, MatchScreenXmark } from './vectors';

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')



const Card = ({
  maxVisibleItems,
  item,
  index,
  dataLength,
  animatedValue,
  currentIndex,
  prevIndex,
}) => {
  const IMAGE_WIDTH = 300;
  const IMAGE_HEIGHT = 300;
const [isActive, setIsActive] = useState(index === currentIndex.value);

useAnimatedReaction(
  () => currentIndex.value,
  (current) => {
    runOnJS(setIsActive)(current === index);
  },
  [index]
);
 
  const navigation = useNavigation()
  let age =calculateAge(item?.match_user?.user_infos[0]?.qP2)
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [-30, 1, 30],
    );
    const translateY2 = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [-200, 1, 200],
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [0.9, 1, 1.1],
    );
    const opacity = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [1, 1, 0],
    );
    return {
      transform: [
        {
          translateY: index === prevIndex.value ? translateY2 : translateY,
        },
        {scale},
      ],
      opacity:
        index < currentIndex.value + maxVisibleItems - 1
          ? opacity
          : index === currentIndex.value + maxVisibleItems - 1
          ? withTiming(1)
          : withTiming(0),
    };
  });

  return (
    <FlingGestureHandler
      key="up"
       enabled={isActive} // Disable for inactive cards
      direction={Directions.UP}
      onHandlerStateChange={ev => {
        if (ev.nativeEvent.state === State.END) {
          if (currentIndex.value !== 0) {
            animatedValue.value = withTiming((currentIndex.value -= 1));
            prevIndex.value = currentIndex.value - 1;
          }
        }
      }}>
      <FlingGestureHandler
        key="down"
         enabled={isActive} // Disable for inactive cards
        direction={Directions.DOWN}
        onHandlerStateChange={ev => {
          if (ev.nativeEvent.state === State.END) {
            if (currentIndex.value !== dataLength - 1) {
              animatedValue.value = withTiming((currentIndex.value += 1));
              prevIndex.value = currentIndex.value;
            }
          }
        }}>
          <Animated.View   style={[
            styles.image,
            {
              zIndex: dataLength - index,
             height:SCREEN_HEIGHT*0.78,width:SCREEN_WIDTH*0.9, borderRadius:20
            },
            animatedStyle,
          ]}>

          <View style={{backgroundColor:"rgba(215, 168, 152, 0.5)",position:"absolute",top:13,left:10,zIndex:11,borderRadius:10,paddingVertical:5,paddingHorizontal:10}}> 
               <Text style={{fontFamily:FAMILLY.semibold,color:"white",textTransform:"capitalize",fontSize:TEXT_SIZE.small}}> Los angeles - 7km </Text>
          </View>
               <View style={{flexDirection:"column",alignItems:"center",justifyContent:"space-evenly",position:"absolute",bottom:28,right:20,zIndex:11}}>
                    <TouchableOpacity  disabled={!isActive} style={{backgroundColor:"#E55E6F",alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,marginTop:10}}><MatchScreenFace/></TouchableOpacity>
                    <TouchableOpacity  disabled={!isActive} style={{backgroundColor:"#D7A898",alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,marginTop:10}}><MatchScreenHeartWhite/></TouchableOpacity>
                    <TouchableOpacity  disabled={!isActive} style={{backgroundColor:"white",alignItems:"center",justifyContent:"center",height:50,width:50,borderRadius:50,marginTop:10}}><MatchScreenXmark/></TouchableOpacity>
               </View>

                    <LinearGradient colors={["rgba(215, 168, 152, 0)","rgba(215, 168, 152, 1)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={{height:55,alignSelf:"flex-start",position:"absolute",zIndex:10,bottom:-2,width:"100%",borderRadius:20}} >
                    <View style={{flexDirection:"column",marginLeft:10}}>
                    <View style={{ height:19, flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontSize:TEXT_SIZE.secondary,fontFamily:FAMILLY.semibold,color:"white"}}>{`${item?.match_user?.firstname} ${item?.match_user?.lastname}` || item?.name}, </Text>
                    <Text style={{fontSize:TEXT_SIZE.secondary ,margin:0,padding:0,fontFamily:FAMILLY.light,color:"white",lineHeight:19,marginLeft:10,textAlign:"center",textAlignVertical:"center"}}>{ age ||item?.age || 25} ans</Text>
                    </View>
                    <View style={{}}>
                    <Text style={{fontSize:TEXT_SIZE.small,fontFamily:FAMILLY.light,color:"white"}}>{ item?.match_user?.city ||item?.location}</Text>
                    </View>
                    </View>         
                    </LinearGradient>
                   <TouchableOpacity  onPress={isActive ? () => navigation.navigate("MatchConnection", {item}) : undefined}
          disabled={!isActive}
          activeOpacity={isActive ? 0.7 : 1}> 
                    
                      <Animated.Image
          source={{uri:`${BaseImageUrl}/${item?.match_user?.user_image}`}|| item?.image}
          style={{height:"100%",width:"100%",borderRadius:20}}
          resizeMode={"cover"}
        />
                    </TouchableOpacity>
                    </Animated.View>
      
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

export default Card;

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    borderRadius: 20,
  },
});