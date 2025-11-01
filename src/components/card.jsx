import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Pressable } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient'; // ✅ correct import for Expo
import { TEXT_SIZE, FAMILLY, BaseImageUrl } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { calculateAge } from '../utils/functions';
import { MatchScreenHeartWhite, MatchScreenXmark } from './vectors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Card = ({
  maxVisibleItems,
  item,
  index,
  dataLength,
  animatedValue,
  currentIndex,
  prevIndex,
}) => {
  const navigation = useNavigation();
  const age = calculateAge(item?.match_user?.user_infos?.qP2);

  // 👇 Animated style
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [40, 1, -800]
    );
    const translateY2 = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [-800, 1, 800]
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [0.9, 1, 1]
    );
    const opacity = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [1, 1, 0]
    );

    return {
      transform: [
        { translateY: index === prevIndex.value ? translateY2 : translateY },
        { scale },
      ],
      opacity:
        index < currentIndex.value + maxVisibleItems - 1
          ? opacity
          : index === currentIndex.value + maxVisibleItems - 1
          ? withTiming(1)
          : withTiming(0),
    };
  });

  // 👇 New Fling Gestures using modern API
  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      if (currentIndex.value !== dataLength - 1) {
        animatedValue.value = withTiming((currentIndex.value += 1));
        prevIndex.value = currentIndex.value - 1;
      }
    });

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      if (currentIndex.value !== 0) {
        animatedValue.value = withTiming((currentIndex.value -= 1));
        prevIndex.value = currentIndex.value + 2;
      }
    });

  // 👇 Combine both fling gestures
  const combinedGesture = Gesture.Simultaneous(flingUp, flingDown);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        className="overflow-hidden"
        style={[
          styles.image,
          {
            zIndex: dataLength - index,
            height: SCREEN_HEIGHT * 0.75,
            width: SCREEN_WIDTH * 0.9,
            borderRadius: 20,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'absolute',
            bottom: 28,
            right: 20,
            zIndex: 11,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#D7A898',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: 50,
              borderRadius: 50,
              marginTop: 10,
            }}
          >
            <MatchScreenHeartWhite />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: 50,
              borderRadius: 50,
              marginTop: 10,
            }}
          >
            <MatchScreenXmark />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['rgba(215, 168, 152, 0)', 'rgba(215, 168, 152, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            height: 85,
            alignSelf: 'flex-start',
            position: 'absolute',
            zIndex: 10,
            bottom: -2,
            width: '100%',
          }}
        >
          <View className="px-6" style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                className="font-bold"
                style={{
                  fontSize: TEXT_SIZE.primary + 4,
                  fontFamily: FAMILLY.semibold,
                  color: 'white',
                }}
              >
                {`${item?.match_user?.firstname}, ${
                  age || item?.age || 25
                } ans` || item?.name}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: TEXT_SIZE.medium,
                  fontFamily: FAMILLY.light,
                  color: 'white',
                }}
              >
                {item?.match_user?.city || item?.location}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <Pressable
          style={{ backgroundColor: 'rgba(215, 168, 152, 0.5)' }}
          onPress={() => navigation.navigate('MatchConnection', { item })}
        >
          <Animated.Image
            source={{
              uri: `${BaseImageUrl}/${item?.match_user?.user_image}`,
            }}
            style={{ height: '100%', width: '100%', borderRadius: 20 }}
            resizeMode="cover"
          />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    borderRadius: 20,
  },
});
