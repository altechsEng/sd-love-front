
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView
} from 'react-native';
import dayjs from 'dayjs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRoute } from '@react-navigation/native';
import { useGlobalVariable } from '../../../context/global';
import { BaseImageUrl, COLORS, FAMILLY, POST_LIMIT, TEXT_SIZE } from '../../../utils/constants';
import { HomeFeedComment, HomeFeedHeart, HomeFeedShare, PostScreenBigComment, PostScreenBookMark, PostScreenDots, PostScreenMiniHeart, ProfileScreenPostDelete, ProfileScreenPostEdit } from '../../../components/vectors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from '../../../components/text';
import MessageSender from '../../../components/messageSender';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

dayjs.extend(relativeTime);

const BlogPostScreen = ({ navigation }) => {

  const queryClient = useQueryClient()
  const { item: mainItem } = useRoute().params;

  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(true);

  const [activePostItem, setActivePostItem] = useState(null)
  const [likedComments, setLikedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  const flatListRef = useRef();
  const messageInputRef = useRef();
  const { image, userData } = useGlobalVariable()
  const [replyingCom, setReplyingCom] = useState(null)

  // Sample comments data
  const [comments, setComments] = useState([]);
  const [isitemLiked, setItemIsliked] = useState(mainItem?.is_liked)
  const [activePostLikeCount, setActivePostLikeCount] = useState(mainItem?.likes_count)
  const [newComment, setNewComment] = useState('');
  const [isPostLiked, setIsPostLiked] = useState(false);
  const scrollViewRef = useRef();
  const [modalVisible, setModalVisible] = useState(false)

  // Handle post like
  const handlePostLike = () => {
    setIsPostLiked(!isPostLiked);
  };

  const handleLikePost = async () => {
    try {
      let token = await AsyncStorage.getItem("user_token");
      let postId = mainItem?.id
      await axios.post("/api/new-post-like", { postId, target: "post", target_id: postId, type: "regular" }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((res) => {
        console.log(res.data, "in handle like post")
        setItemIsliked(res.data?.liked)
        ToastAndroid.show(res.data?.message, 1000)
        setActivePostLikeCount(res.data?.likes_count)

      }).catch((err) => {
        console.log(err?.request, "in handle like post cathc..")
      })

    } catch (err) {
      console.log(err, "error in handlelike post try cathc")
    }
  }

  const handleLikeComment = async (commentId) => {

    try {
      let token = await AsyncStorage.getItem("user_token")

      axios.post(`/api/new-comment-like/${mainItem?.id}/${commentId}`, { type: "regular", target: "comment", postId: mainItem?.id, commentId, targetId: commentId }, { headers: { "Authorization": `Bearer ${token}` } }).then((res) => {
        console.log(res.data, "in like comment---")

        setLikedComments(prev => {

          return {
            ...prev,
            [commentId]: !prev[commentId]
            // [commentId]: res.data?.liked
          }
        });

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

      }).catch(err => {
        console.log(err?.request, err, "in handle like comment")
      })

    } catch (err) {
      console.log(err, " in like comment handle")
    }
  };

  const handleReplyPress = (comment) => {
    setReplyingTo(comment);
    setReplyingCom(comment)
    messageInputRef.current.focus();
  };

  const handleSendComment = async () => {
    try {

      let token = await AsyncStorage.getItem("user_token");
      let postId = mainItem?.id
      if (comment.trim() === "") return;

      const newComment = {
        id: `comment-${Date.now()}`,
        img: { uri: image },
        comment: comment,
        name: userData?.firstname,
        time: new Date(),
        likes: 0
      };

      if (replyingTo) {
        console.log(replyingCom, "pppppppppppppppppppppppppppp")
        if (token) {
          await axios.post("/api/new-child-comment", { postId, content: newComment?.comment, content_type: "string", commentId: replyingCom?.id }, {
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          }).then(res => {
            console.log(res.data, "child......comment")
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
            console.log(err, "in catch handlesend coment")
          ])
        }
      } else {
        if (token) {
          await axios.post("/api/new-comment", { postId, content: newComment?.comment, content_type: "string" }, {
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          }).then(res => {
            console.log(res.data, "......")
            // Add as a new top-level comment
            setComments(prev => [{ ...newComment, id: res.data?.comment?.id }, ...prev]);
          }).catch(err => [
            console.log(err, "in catch handlesend coment")
          ])
        }
      }

      setComment("");

      //  if (flatListRef.current) {
      //    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      //  }
    } catch (err) {

      console.log(err, "in postscreen handle send comment.")

    }
  };

  // Handle share
  const handleShare = () => {
    // Implement share functionality
    alert('Sharing post...');
  };

  const [isLoading, setIsLoading] = useState(false)
  const bookMarkMutation = useMutation({
    mutationFn: async ({ postId }) => {
      let token = await AsyncStorage.getItem("user_token");
      if (token) {
        let response = await axios.post('/api/save-post', { postId }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        })


        return { status: response.data.status, data: response.data, message: response.data?.message }
      }
    },
    onError: (error) => {
      console.error("book mark error:", error);
      ToastAndroid.show("Failed to save post", ToastAndroid.SHORT);
    }
  })
  const handleBookMark = async (post) => {

    if (userData.id === post?.user?.id) {
      console.log("cannot book mark your own post")
      return
    }
    let result = await bookMarkMutation.mutateAsync({ postId: post?.id })

    if (result.status === 200) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userSavePosts'] })
      ]);
      ToastAndroid.show(result?.message, 1000);
    }
  }

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const token = await AsyncStorage.getItem("user_token");
      const formData = new FormData();
      formData.append("post_id", postId);
      return axios.post("/api/delete-post", formData, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => {
        console.log(res.data, "Data----")
        ToastAndroid.show("Post deleted", 1000)

      }).catch(err => {
        console.log(err?.request, "opo")
      })
    },

    onSuccess: () => {
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    }
  });

  const handleDeletePost = (post) => {
    deletePostMutation.mutate(post.id)
  };

  const getAllComments = async ({ pageParam = 1 }) => {
    try {

      let token = await AsyncStorage.getItem("user_token");

      if (token) {
        const response = await axios.post(
          `/api/get-comments/${mainItem?.id}`,
          { page: pageParam, postId: mainItem?.id },
          { headers: { "Authorization": `Bearer ${token}` } }
        );

        // console.log(response.data,"poping-----")
        return response.data
      }
    } catch (err) {
      console.log(err.message, "in getallComments", Object.keys(err), err?.request);

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
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage?.next_page;
      }
      return undefined;
    },
  });

  // FLATTEN ALL PAGES INTO SINGLE ARRAY

  useEffect(() => {
    console.log("logged")
    const allComments = data?.pages.flatMap(page => page?.comments) ?? [];
    setComments(allComments)
  }, [data])

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

  // Render comment item
  const renderCommentItem = ({ item }) => {
    const isLiked = likedComments[item.id] || false;
    let time = dayjs(item?.time).fromNow()

    if (isFetching) {
      return <View key={"loader-key"} style={{ ...styles.commentContainer }}>
        <View style={styles.commentMainContent}>
          <View style={{
            overflow: 'hidden',
            height: 50,
            width: 50,
            borderRadius: 50,
            marginRight: 10,
            backgroundColor: COLORS.light
          }}>

          </View>

          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <View style={{ height: 12, width: wp("15%"), backgroundColor: COLORS.light }}></View>

              <View style={{ ...styles.commentTimeSeparator, marginLeft: 10 }}>
                <View style={{ ...styles.commentTimeDot, backgroundColor: COLORS.light }} />
              </View>
              <View style={{ height: 12, width: wp("15%"), backgroundColor: COLORS.light }}></View>
            </View>

            <View style={{ height: 12, width: wp("50%"), backgroundColor: COLORS.light }}></View>


            <View style={styles.commentActions}>
              <View style={styles.commentLeftActions}>
                <TouchableOpacity
                  style={styles.commentActionButton}
                  onPress={() => handleReplyPress(item)}
                >
                  <View style={{ height: 12, width: wp("15%"), backgroundColor: COLORS.light }}></View>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.commentActionButton}
                  onPress={() => handleLikeComment(item.id)}
                >
                  <View style={{ height: 12, width: wp("15%"), backgroundColor: COLORS.light }}></View>

                </TouchableOpacity>
              </View>

              <View style={{ ...styles?.commentRightActions, width: 24 }}>
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
      <View key={`comment-${item.id}`} style={styles.commentContainer}>
        <View style={styles.commentMainContent}>
          <View style={styles.commentAvatarContainer}>
            <Image
              source={item.img}
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
              fontSize={TEXT_SIZE.primary}
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
                    fontSize={TEXT_SIZE.secondary}
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
                    fontSize={TEXT_SIZE.secondary}
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
                  fontSize={TEXT_SIZE.secondary}
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
                <View key={`reply-${reply.id}`} style={styles.replyItem}>
                  <View style={styles.commentAvatarContainer}>
                    <Image
                      source={reply.img}
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
                        value={dayjs(reply?.time).fromNow()}
                      />
                    </View>

                    <CustomRegularPoppingText
                      style={styles.commentText}
                      fontSize={TEXT_SIZE.primary}
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
                            fontSize={TEXT_SIZE.secondary}
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
                            fontSize={TEXT_SIZE.secondary}
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
                          fontSize={TEXT_SIZE.secondary}
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: `${BaseImageUrl}/${mainItem?.user?.user_image}` }}
            style={styles.postAvatar} />
          <View style={styles.postUserInfo}>
            <Text style={styles.postUserName}>{mainItem?.user?.firstname || "Johno orlan"}</Text>
            <Text style={styles.postTime}>{dayjs(new Date(mainItem?.created_at)).fromNow() || "12 hours ago"}</Text>
          </View>

          <TouchableOpacity onPress={() => {
            if (userData?.id == mainItem?.user?.id) {
              setModalVisible(true)
              setActivePostItem(mainItem)
            }
          }}>
            <PostScreenDots />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>
          {mainItem?.text || ""}
        </Text>

        {/* Post Image */}
        <View style={mainItem?.media?.length >= 1 && styles.postMediaContainer}>
          {mainItem?.media?.length === 1 ? (
            <View className='px-3'>
              <Image
                source={{ uri: `https://sdlove-api.altechs.africa/storage/app/private/public/post_media/${mainItem?.media[0]?.url}` }}
                style={styles.singleMedia}
                resizeMode="cover"
              />
            </View>
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
            null
          )}
        </View>


        <View style={styles.postActions}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={styles.postActionItem}>
              <TouchableOpacity onPress={() => handleLikePost()}>
                {isitemLiked ? <HomeFeedHeart stroke={COLORS.primary} fill={COLORS.primary} /> : <HomeFeedHeart stroke={"#2E2E2E"} fill={"white"} />}
              </TouchableOpacity>
              <Text style={styles.postActionCount}>{activePostLikeCount || ''}</Text>
            </View>

            <View style={styles.postActionItem}>
              <TouchableOpacity>
                <HomeFeedComment stroke={"#2E2E2E"} fill={"white"} />
              </TouchableOpacity>
              <Text style={styles.postActionCount}>{mainItem?.comment_count > 0 ? mainItem.comment_count : ''}</Text>
            </View>

            {/* <View style={styles.postActionItem}>
              <TouchableOpacity>
                <HomeFeedShare fill={"#2E2E2E"} />
              </TouchableOpacity>
              <Text style={styles.postActionCount}>825</Text>
            </View> */}
          </View>

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => handleBookMark(mainItem)}
          >
            <PostScreenBookMark />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          {showComment ? (
            <View style={styles.commentsListContainer}>
              <CustomRegularPoppingText
                style={styles.sectionTitle}
                fontSize={TEXT_SIZE.medium}
                color={null}
                value={'Comments'}
              />
              <FlatList
                data={comments.length > 0 ? comments : null}
                renderItem={renderCommentItem}
                scrollEnabled={false}
                initialNumToRender={5}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderLoader}
              />
            </View>
          ) : (
            <View style={styles.noCommentsContainer}>
              <PostScreenBigComment />
              <CustomRegularPoppingText
                style={styles.noCommentsText}
                color={null}
                fontSize={TEXT_SIZE.primary}
                value="There is no comment yet."
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>


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

      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Semi-transparent overlay (simulates blur effect) */}
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          {/* Actual modal content */}
          <View style={styles.modalContainer}>
            <View className={'gap-6 py-8'} style={styles.modalContent}>
              <TouchableOpacity style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }} onPress={() => navigation.navigate("PostEdit", { item: activePostItem })}>
                <ProfileScreenPostEdit />
                <CustomRegularPoppingText color={null} style={{ marginLeft: 20 }} value={"Edit post"} fontSize={TEXT_SIZE.primary} />
              </TouchableOpacity>


              <TouchableOpacity onPress={() => handleDeletePost(activePostItem)} style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }}>
                <ProfileScreenPostDelete />
                {isLoading ? <ActivityIndicator color={COLORS.primary} /> : <CustomRegularPoppingText color={null} style={{ marginLeft: 20 }} value={"Delete post"} fontSize={TEXT_SIZE.primary} />}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 15
  },
  scrollContainer: {
    paddingBottom: 70
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10
  },


  postUserInfo: {
    flex: 1
  },
  postUserName: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: FAMILLY.semibold,
  },
  postTime: {
    fontSize: 12,
    color: '#888'
  },
  noCommentsContainer: {
    alignItems: "center"
  },
  postContent: {
    lineHeight: 22,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: COLORS.black,
    fontSize: TEXT_SIZE.primary,
    fontWeight: FAMILLY.light,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 15
  },
  postMediaContainer: {
    height: 'auto',
    maxHeight: 400,
    width: '100%'
  },
  postMediaContainerSingle: {
    height: 'auto',
    maxHeight: 400,
    width: '100%',
    paddingHorizontal: 10,
  },
  singleMedia: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  multiMediaItem: {
    width: 300,
    height: 300,
    marginLeft: 6,
  },
  multiMediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  defaultMedia: {
    width: '100%',
    height: '100%',
  },

  postActionItem: { flexDirection: "row", alignItems: "center", marginRight: 10 },

  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    borderTopColor: '#eee',
    borderBottomWidth: 0,
    borderBottomColor: '#eee',
    marginBottom: 15
  },
  postAction: {

    paddingHorizontal: 10
  },
  postActionText: {
    fontSize: 14,
    color: '#333'
  },
  likedText: {
    color: '#ff5656'
  },
  commentsSection: {
    paddingHorizontal: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FAMILLY.bold,
    marginBottom: 15,

  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 15
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  commentContent: {
    flex: 1
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  commentName: {
    fontWeight: 'bold',
    marginRight: 10
  },
  commentTime: {
    fontSize: 12,
    color: '#888'
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FAMILLY.light,
    marginBottom: 5
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentAction: {
    marginRight: 15
  },
  commentActionText: {
    fontSize: 13,
    fontWeight: FAMILLY.bold,
    color: '#555'
  },
  commentLikes: {
    fontSize: 12,
    color: '#888'
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10
  },
  commentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold'
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
    height: 40,
    width: 40,
    borderRadius: 40,
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
    marginLeft: 50,
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



  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  modalContainer: {
    width: '100%',
    // height: SCREEN_HEIGHT * 0.89,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    // height: '100%',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlogPostScreen;