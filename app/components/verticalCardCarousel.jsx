 
import React, { useRef } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useAnimatedRef
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useInfiniteQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { POST_LIMIT } from '../../utils/constants';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.2;
const VISIBLE_CARDS = 3;

         const getAllMatches = async({pageParam = 0}) => {
             try {
                 
                 let url = '/api/show-matches';
                 let token = await AsyncStorage.getItem("user_token");
                 
                 if(token) {
                     const response = await axios.post(
                         url,
                         {offset: pageParam, limit: POST_LIMIT},
                         {headers: {"Authorization": `Bearer ${token}`}}
                     );
     
                      
                   
                     return {
                         matches: response?.data?.matches,
                         nextOffset: response?.data?.next_offset,
                     };
                 }
             } catch(err) {
                 console.log(err.message, "in getAllMatches",Object.keys(err),err?.request);
                 isSearching.current = false;
                 throw err; // Important for React Query error handling
             }
         };

const Card = ({ item, index, position, onSwipe }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = position.value - index * CARD_HEIGHT;
    const scale = 1 - 0.05 * (index - position.value / CARD_HEIGHT);
    
    return {
      transform: [
        { translateY },
        { scale: Math.max(scale, 0.8) }
      ],
      zIndex: VISIBLE_CARDS - index,
      opacity: index <= position.value / CARD_HEIGHT + VISIBLE_CARDS ? 1 : 0
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {/* Your card content here */}
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.name}>{item.name}, {item.age}</Text>
      </View>
      
      {index === Math.floor(position.value / CARD_HEIGHT) && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => onSwipe('down')}>
            {/* Down button icon */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSwipe('up')}>
            {/* Up button icon */}
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const VerticalCardCarousel = () => {
  const position = useSharedValue(0);
  const currentIndex = useRef(0);
  const maxIndex = useRef(0);
  const scrollRef = useAnimatedRef();

          const { 
              data, 
              fetchNextPage, 
              hasNextPage,
              isFetchingNextPage,
              isFetching 
          } = useInfiniteQuery({
              queryKey: ["matches"],
              queryFn: getAllMatches,
              getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
               
          });

  const allCards = data?.pages.flatMap(page => {
            console.log(page,"in card")
            return page?.matches
         }) ?? [];

  const handleSwipe = (direction) => {
    if (direction === 'up' && currentIndex.current < allCards.length - 1) {
      position.value = withSpring((currentIndex.current + 1) * CARD_HEIGHT);
      currentIndex.current += 1;
    } else if (direction === 'down' && currentIndex.current > 0) {
      position.value = withSpring((currentIndex.current - 1) * CARD_HEIGHT);
      currentIndex.current -= 1;
    }

    // Fetch next page when nearing end
    if (currentIndex.current >= allCards.length - 2 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event, ctx) => {
      position.value = ctx.startPosition + event.translationY;
    },
    onEnd: (event) => {
      const targetIndex = Math.round(position.value / CARD_HEIGHT);
      const clampedIndex = Math.min(
        Math.max(targetIndex, 0),
        allCards.length - 1
      );
      
      position.value = withSpring(clampedIndex * CARD_HEIGHT);
      currentIndex.current = clampedIndex;
      
      if (clampedIndex >= allCards.length - 2 && hasNextPage) {
        runOnJS(fetchNextPage)();
      }
    }
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
          {allCards.slice(0, currentIndex.current + VISIBLE_CARDS + 1).map((item, index) => (
            <Card 
              key={item.id}
              item={item}
              index={index}
              position={position}
              onSwipe={handleSwipe}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
      
      {/* Stack effect base */}
      <View style={styles.stackBase} />
      <View style={[styles.stackBase, styles.stackMiddle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:180,
    marginVertical: 20
  },
  card: {
    position: 'absolute',
    height: CARD_HEIGHT,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'column'
  },
  stackBase: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: '#EAD2CA',
    height: 50,
    width: SCREEN_WIDTH * 0.85,
    borderRadius: 20,
    zIndex: -1
  },
  stackMiddle: {
    bottom: -25,
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#F0E8E5',
    zIndex: -2
  }
});

export default VerticalCardCarousel;