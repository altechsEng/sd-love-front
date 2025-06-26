 



import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from "../../../utils/constants";
import { 
  PostScreenSendComment, 
  HomeFeedBell, 
  PostScreenImagePicker, 
  PostScreenBigComment, 
  PostScreenBookMark, 
  HomeFeedComment, 
  PostScreenDots, 
  HomeFeedGradient, 
  HomeFeedHeart, 
  HomeFeedSearch,
  HomeFeedShare,
  HomeFeedSmallArrowRight,
  HomeFeedThreeDots,
  LogoSmall, 
  PostScreenMiniHeart 
} from "../../components/vectors.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../app/components/text';
import CustomTextInput from "../../../app/components/textInput";
import { ScrollView } from "react-native-gesture-handler";
import MessageSender from '../../../app/components/messageSender.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGlobalVariable } from '../../context/global.jsx';
import { useInfiniteQuery } from '@tanstack/react-query';
 

dayjs.extend(relativeTime);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PostScreen = ({ navigation }) => {
   const [mainItem, setMainItem] = useState(null);
   const { item } = useRoute().params;
   const [comment, setComment] = useState("");
   const [showComment, setShowComment] = useState(false);
    
   const defaultComments = [
      {
        id: "post122-98",
        img: require("../../../assets/images/test_match1.jpg"),
        comment: "Lorem ipsum dolor sit amet consectetur. Commodo sapien metus et a vitae a nec. Enim blandit mauris habitasse mattis justo. Tellus lorem massa auctor.",
        name: "Maggy McLeen",
        time: "23h ago",
        likes: 23,
      },
      {
        id: "post102-35",
        img: require("../../../assets/images/test_match1.jpg"),
        comment: "Lorem ipsum dolor sit amet consectetur. Commodo sapien metus et a vitae a nec. Enim blandit mauris habitasse mattis justo.",
        name: "Maggy McLeen",
        time: "23h ago",
        likes: 15,
        replies: [
          {
            id: "post102rep2",
            img: require("../../../assets/images/test_match1.jpg"),
            comment: "Lorem ipsum dolor sit amet consectetur. Commodo sapien metus et a vitae a nec. Enim blandit mauris habitasse mattis justo.",
            name: "Maggy McLeen",
            time: "23h ago",
            likes: 5,
          }
        ]
      },
    ]
   const [comments, setComments] = useState([]);
   const [likedComments, setLikedComments] = useState({});
   const [replyingTo, setReplyingTo] = useState(null);
   const scrollViewRef = useRef();
   const flatListRef = useRef();
   const messageInputRef = useRef();
   const {image,userData} = useGlobalVariable()
   const [replyingCom,setReplyingCom] = useState(null)
 
 
   useEffect(() => {
     setMainItem(item);
     getAllComments()     
   }, [item]);



       const isSearching = useRef(false);
     const getAllComments = async ({ pageParam = 0 }) => {
          try {
               isSearching.current = true;
                
               let token = await AsyncStorage.getItem("user_token");

             
               if (token) {
                    const response = await axios.post(
                         '/api/get-comments',
                         { offset: pageParam, limit: POST_LIMIT ,postId:mainItem?.id },
                         { headers: { "Authorization": `Bearer ${token}` } }
                    );
  
                 
  
                    isSearching.current = false;
                  console.log(response.data,"poping-----")
                    return {
                         comments:response?.data?.comments,
                         nextOffset: response?.data?.next_offset,
                    };
               }
          } catch (err) {
               console.log(err.message, "in getallComments", Object.keys(err), err?.request);
               isSearching.current = false;
               throw err; // Important for React Query error handling
          }
     };
  
     const {
          data,
          fetchNextPage,
          hasNextPage,
          isFetchingNextPage,
          isFetching
     } = useInfiniteQuery({
          queryKey: ["comments"],
          queryFn: getAllComments,
          getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
          initialPageParam: 0,
     });
  

     
     // FLATTEN ALL PAGES INTO SINGLE ARRAY
     const allComments = data?.pages.flatMap(page => page?.comments) ?? [];
     useEffect(()=>{
    
      setComment(allComments)
     },[data])

    
  
     const loadMoreItem = () => {
          if (hasNextPage && !isFetchingNextPage) {
               fetchNextPage();
          }
     };
  
     const renderLoader = () => {
 
          return isFetchingNextPage ? (
               <ActivityIndicator size="large" color={COLORS.blue} />
          ) : null;
     };
 

 

 


const handleLikePost = async() => {
  try {
     let token = await AsyncStorage.getItem("user_token");
     let postId = mainItem?.id
    await axios.post("/api/new-post-like",{postId,target:"post",target_id:postId,type:"regular"},{
                    headers: {
            "Authorization": `Bearer ${token}`}
          }).then((res) => {
    console.log(res.data,"in handle like post")
    ToastAndroid.show(res.data?.message,1000)
  
  }).catch((err) => {
    console.log(err,"in handle like post cathc..")
  })

  } catch(err) {
    console.log(err,"error in handlelike post try cathc")
  }
}
 

 
 
  const handleBookMark = async (postId) => {
    try {
        let token = await AsyncStorage.getItem("user_token");
      if (token) {
        await axios.post('/api/save-post', { postId }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }).then((res) => {
          if (res.data.status === 200) {
            ToastAndroid.show("Post saved successfully", 1000);
          }
        }).catch((err) => {
          console.log(err, "error in catch");
        });
      }
    } catch (err) {
      console.log(err, "the error");
    }
  };

  const handleLikeComment = (commentId) => {
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: likedComments[commentId] ? comment.likes - 1 : comment.likes + 1
        };
      }
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              likes: likedComments[commentId] ? reply.likes - 1 : reply.likes + 1
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    }));
  };

 
  const handleReplyPress = (comment) => {
    setReplyingTo(comment);
    setReplyingCom(comment)
    messageInputRef.current.focus();
  };

  const handleSendComment = async() => {
    try {

     let token = await AsyncStorage.getItem("user_token");
     let postId = mainItem?.id
     if (comment.trim() === "") return;
    
    const newComment = {
      id: `comment-${Date.now()}`,
      img: {uri:image }|| require("../../../assets/images/test_person1.png"),
      comment: comment,
      name: userData?.firstname,
      time: new Date(),
      likes: 0
    };

  
    
    if (replyingTo) {

      console.log(replyingCom,"pppppppppppppppppppppppppppp")
 
           if(token) {
     await axios.post("/api/new-child-comment",{postId,content:newComment?.comment,content_type:"string",commentId:replyingCom?.id},{
                    headers: {
            "Authorization": `Bearer ${token}`,
          }
      }).then(res=>{
          console.log(res.data,"child......comment")
                // Add as a reply
      setComments(prev => prev.map(c => {
        if (c.id === replyingTo.id) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment]
          };
        }
        // Check if it's a reply to a reply
        if (c.replies && c.replies.some(r => r.id === replyingTo.id)) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === replyingTo.id) {
                return {
                  ...r,
                  replies: [...(r.replies || []), newComment]
                };
              }
              return r;
            })
          };
        }
        return c;
      }));
      setReplyingTo(null);

      }).catch(err => [
          console.log(err,"in catch handlesend coment")
      ])
     }

    } else {

     

     
     if(token) {
     await axios.post("/api/new-comment",{postId,content:newComment?.comment,content_type:"string"},{
                    headers: {
            "Authorization": `Bearer ${token}`,
          }
      }).then(res=>{
          console.log(res.data,"......")
       // Add as a new top-level comment
      setComments(prev => [{...newComment,id:res.data?.comment?.id}, ...prev]);
      }).catch(err => [
          console.log(err,"in catch handlesend coment")
      ])
     }
    }
    
      setComment("");
    
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    } catch(err) {
      
      console.log(err,"in postscreen handle send comment.")
    
    }
  };

  const renderCommentItem = ({ item }) => {
    const isLiked = likedComments[item.id] || false;
    let time = dayjs(item?.time).fromNow()  
     
   if(isFetching) {
         return  <View style={{...styles.commentContainer}}>
        <View style={styles.commentMainContent}>
          <View style={{
                overflow: 'hidden',
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor:COLORS.light
          }}>
         
          </View>
          
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
               <View style={{height:12,width:wp("15%"),backgroundColor:COLORS.light}}></View>
             
              <View style={{...styles.commentTimeSeparator,marginLeft:10}}>
                <View style={{...styles.commentTimeDot,backgroundColor:COLORS.light}} />
              </View>
               <View style={{height:12,width:wp("15%"),backgroundColor:COLORS.light}}></View>
            </View>
            
               <View style={{height:12,width:wp("50%"),backgroundColor:COLORS.light}}></View>
           
            
            <View style={styles.commentActions}>
              <View style={styles.commentLeftActions}>
                <TouchableOpacity 
                  style={styles.commentActionButton}
                  onPress={() => handleReplyPress(item)}
                >
               <View style={{height:12,width:wp("15%"),backgroundColor:COLORS.light}}></View>

                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.commentActionButton}
                  onPress={() => handleLikeComment(item.id)}
                >
               <View style={{height:12,width:wp("15%"),backgroundColor:COLORS.light}}></View>

                </TouchableOpacity>
              </View>
              
              <View style={{...styles?.commentRightActions,width:24}}>
                <TouchableOpacity  >
                  <PostScreenMiniHeart color={COLORS.light} />
                </TouchableOpacity>
               
              </View>
            </View>
          </View>
        </View>
  
      </View>
    }

    
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentMainContent}>
          <View style={styles.commentAvatarContainer}>
            <Image 
              source={item.img || require("../../../assets/images/test_person1.png")} 
              style={styles.commentAvatar}
            />
          </View>
          
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <CustomSemiBoldPoppingText 
                style={styles.commentName} 
                fontSize={TEXT_SIZE.primary - 2} 
                color={"black"} 
                value={item.name}
              />
              <View style={styles.commentTimeSeparator}>
                <View style={styles.commentTimeDot} />
              </View>
              <CustomRegularPoppingText 
                fontSize={TEXT_SIZE.small} 
                color={"#A0A7AE"} 
                value={time}
              />
            </View>
            
            <CustomRegularPoppingText 
              style={styles.commentText}
              fontSize={TEXT_SIZE.small} 
              color={null} 
              value={item.comment}
            />
            
            <View style={styles.commentActions}>
              <View style={styles.commentLeftActions}>
                <TouchableOpacity 
                  style={styles.commentActionButton}
                  onPress={() => handleReplyPress(item)}
                >
                  <CustomRegularPoppingText 
                    style={styles.commentActionText} 
                    fontSize={TEXT_SIZE.small - 1} 
                    color={null} 
                    value={'Reply'}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.commentActionButton}
                  onPress={() => handleLikeComment(item.id)}
                >
                  <CustomRegularPoppingText 
                    style={[styles.commentActionText, isLiked && styles.likedText]} 
                    fontSize={TEXT_SIZE.small - 1} 
                    color={isLiked ? "#FF5656" : null} 
                    value={'Like'}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.commentRightActions}>
                <TouchableOpacity onPress={() => handleLikeComment(item.id)}>
                  <PostScreenMiniHeart color={isLiked ? "#FF5656" : "none"} />
                </TouchableOpacity>
                <CustomRegularPoppingText 
                  style={styles.likeCount}
                  fontSize={TEXT_SIZE.small - 1} 
                  color={null} 
                  value={item.likes.toString()}
                />
              </View>
            </View>
          </View>
        </View>
        
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map(reply => {
              const isReplyLiked = likedComments[reply.id] || false;
              return (
                <View key={reply.id} style={styles.replyItem}>
                  <View style={styles.commentAvatarContainer}>
                    <Image 
                      source={reply.img || require("../../../assets/images/test_person1.png")} 
                      style={styles.commentAvatar}
                    />
                  </View>
                  
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <CustomSemiBoldPoppingText 
                        style={styles.commentName} 
                        fontSize={TEXT_SIZE.primary - 2} 
                        color={"black"} 
                        value={reply.name}
                      />
                      <View style={styles.commentTimeSeparator}>
                        <View style={styles.commentTimeDot} />
                      </View>
                      <CustomRegularPoppingText 
                        fontSize={TEXT_SIZE.small} 
                        color={"#A0A7AE"} 
                        value={reply.time}
                      />
                    </View>
                    
                    <CustomRegularPoppingText 
                      style={styles.commentText}
                      fontSize={TEXT_SIZE.small} 
                      color={null} 
                      value={reply.comment}
                    />
                    
                    <View style={styles.commentActions}>
                      <View style={styles.commentLeftActions}>
                        <TouchableOpacity 
                          style={styles.commentActionButton}
                          onPress={() => handleReplyPress(reply)}
                        >
                          <CustomRegularPoppingText 
                            style={styles.commentActionText} 
                            fontSize={TEXT_SIZE.small - 1} 
                            color={null} 
                            value={'Reply'}
                          />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.commentActionButton}
                          onPress={() => handleLikeComment(reply.id)}
                        >
                          <CustomRegularPoppingText 
                            style={[styles.commentActionText, isReplyLiked && styles.likedText]} 
                            fontSize={TEXT_SIZE.small - 1} 
                            color={isReplyLiked ? "#FF5656" : null} 
                            value={'Like'}
                          />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.commentRightActions}>
                        <TouchableOpacity onPress={() => handleLikeComment(reply.id)}>
                          <PostScreenMiniHeart color={isReplyLiked ? "#FF5656" : "none"} />
                        </TouchableOpacity>
                        <CustomRegularPoppingText 
                          style={styles.likeCount}
                          fontSize={TEXT_SIZE.small - 1} 
                          color={null} 
                          value={reply.likes.toString()}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  return (
 
<FlatList

data={["key-new-1"]}
renderItem={({item}) => {
  return <View style={{flex:1}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{...styles.container,flex:1,backgroundColor:"white"}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <TouchableOpacity style={styles.userAvatarContainer}>
                <Image 
                  source={mainItem?.img || require("../../../assets/images/test_person1.png")} 
                  style={styles.userAvatar}
                />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {mainItem?.user?.firstname || "Johno orlan"}
                </Text>
                <Text style={styles.postTime}>
                  {dayjs(mainItem?.created_at).fromNow() || "12 hours ago"}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.postOptions}>
              <PostScreenDots />
            </TouchableOpacity>
          </View>
          
          {/* Post Content */}
          <View style={styles.postContent}>
            <Text style={styles.postText}>
              {mainItem?.text || "Lorem ipsum dolor sit amet consectetur. Lorem varius quisque odio nisl tempor sit bibendum pulvinar sed. pharetra sed magnis vitae."}
            </Text>
          </View>
          
          {/* Post Media */}
          <View style={styles.postMediaContainer}>
            {mainItem?.media?.length === 1 ? (
              <Image 
                source={{ uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${mainItem?.media[0]?.url}` }} 
                style={styles.singleMedia}
                resizeMode="cover"
              />
            ) : mainItem?.media?.length > 1 ? (
              <FlatList
                data={mainItem?.media}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.multiMediaItem}>
                    <Image 
                      source={{ uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${item?.url}` }} 
                      style={styles.multiMediaImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Image 
                source={require("../../../assets/images/match_con1.jpg.jpg")} 
                style={styles.defaultMedia}
                resizeMode="cover"
              />
            )}
          </View>
          
          {/* Post Actions */}
          <View style={styles.postActions}>
            <View style={styles.postLeftActions}>
              <View style={styles.postActionItem}>
                <TouchableOpacity onPress={()=> handleLikePost()}>
                  <HomeFeedHeart stroke={"#2E2E2E"} fill={"white"} />
                </TouchableOpacity>
                <Text style={styles.postActionCount}>{item?.likes_count}</Text>
              </View>
              
              <View style={styles.postActionItem}>
                <TouchableOpacity onPress={() => setShowComment(!showComment)}>
                  <HomeFeedComment stroke={"#2E2E2E"} fill={"white"} />
                </TouchableOpacity>
                <Text style={styles.postActionCount}>{comments.length}</Text>
              </View>
              
              <View style={styles.postActionItem}>
                <TouchableOpacity>
                  <HomeFeedShare fill={"#2E2E2E"} />
                </TouchableOpacity>
                <Text style={styles.postActionCount}>825</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={() => handleBookMark(mainItem?.id)}
            >
              <PostScreenBookMark />
            </TouchableOpacity>
          </View>
          
          {/* Comments Section */}
          <View style={styles.commentsSection}>
            {showComment ? (
              <View style={styles.commentsListContainer}>
                <CustomRegularPoppingText 
                  style={styles.commentsTitle} 
                  fontSize={TEXT_SIZE.primary + 1} 
                  color={null} 
                  value={'Comments'}
                />
                <FlatList
                  ref={flatListRef}
                  data={allComments.length>0?allComments:defaultComments}
                  renderItem={renderCommentItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={10}
                  onEndReached={loadMoreItem}
                  onEndReachedThreshold={0.8}
                  ListFooterComponent={renderLoader}
                />
              </View>
            ) : (
              <View style={styles.noCommentsContainer}>
                <PostScreenBigComment />
                <CustomRegularPoppingText 
                  style={styles.noCommentsText} 
                  color={null} 
                  fontSize={TEXT_SIZE.small} 
                  value="There is no comment yet."
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      


   


    </KeyboardAvoidingView>

    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{...styles.container,backgroundColor:"white"}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
            {/* Comment Input */}
      <View style={styles.messageSenderContainer}>
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>
              Replying to {replyingTo.name}
            </Text>
            <TouchableOpacity 
              style={styles.cancelReplyButton}
              onPress={() => setReplyingTo(null)}
            >
              <Text style={styles.cancelReplyText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        
  
          <MessageSender 
          ref={messageInputRef}
          placeHolder={replyingTo ? `Reply to ${replyingTo.name}` : "Add a comment"} 
          action={handleSendComment} 
          state={comment} 
          setState={setComment}
      />
 
      </View>
    </KeyboardAvoidingView>
</View>
}}
/>


     
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingBottom: 80, // Space for the input
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: COLORS.light,
  },
  postUserInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarContainer: {
    borderRadius: 50,
    height: 50,
    width: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    height: '100%',
    width: '100%',
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    color: COLORS.black,
    fontSize: TEXT_SIZE.primary,
    fontFamily: FAMILLY.semibold,
  },
  postTime: {
    color: COLORS.gray,
    fontSize: TEXT_SIZE.small,
    fontFamily: FAMILLY.light,
  },
  postOptions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContent: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  postText: {
    color: COLORS.black,
    fontSize: TEXT_SIZE.secondary,
    fontFamily: FAMILLY.light,
  },
  postMediaContainer: {
    height: 200,
    width: '100%',
  },
  singleMedia: {
    width: '100%',
    height: '100%',
  },
  multiMediaItem: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  multiMediaImage: {
    width: '100%',
    height: '100%',
  },
  defaultMedia: {
    width: '100%',
    height: '100%',
  },
  postActions: {
    paddingHorizontal: 20,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  postLeftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionItem: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postActionCount: {
    fontFamily: FAMILLY.light,
    marginLeft: 5,
  },
  bookmarkButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsSection: {
    minHeight: SCREEN_HEIGHT * 0.35,
    borderBottomWidth: 2,
    borderColor: COLORS.light,
  },
  commentsListContainer: {
    paddingHorizontal: 10,
  },
  commentsTitle: {
    textAlign: 'left',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  noCommentsContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    marginTop: 10,
  },
  commentContainer: {
    borderBottomWidth: 2,
    borderColor: COLORS.light,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  commentMainContent: {
    flexDirection: 'row',
    width: '100%',
  },
  commentAvatarContainer: {
    overflow: 'hidden',
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  commentAvatar: {
    height: '100%',
    width: '100%',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commentName: {
    marginRight: 5,
  },
  commentTimeSeparator: {
    backgroundColor: 'white',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentTimeDot: {
    height: 5,
    marginBottom: 2,
    width: 5,
    backgroundColor: 'black',
    borderRadius: 50,
    marginRight: 5,
  },
  commentText: {
    marginTop: 5,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  commentLeftActions: {
    flexDirection: 'row',
  },
  commentActionButton: {
    marginRight: 10,
  },
  commentActionText: {
    marginRight: 10,
  },
  likedText: {
    color: '#FF5656',
  },
  commentRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
  replyItem: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
    messageSenderContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: COLORS.light,
    },
    replyingToContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor: '#f5f5f5',
    },
    replyingToText: {
      fontSize: TEXT_SIZE.small,
      color: COLORS.gray,
    },
    cancelReplyButton: {
      padding: 5,
    },
    cancelReplyText: {
      fontSize: TEXT_SIZE.small,
      color: COLORS.gray,
    },
});

export default PostScreen;

