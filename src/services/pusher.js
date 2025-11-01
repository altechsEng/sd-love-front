import AsyncStorage from '@react-native-async-storage/async-storage';
import Pusher from 'pusher-js';
import { useEffect } from 'react';

// let token = AsyncStorage.getItem("user_token");

const pusher = new Pusher('eb6c70a861cda9345f53', {
  cluster: 'eu',
  authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${AsyncStorage.getItem('user_token')}`,
    },
  },
});

export const usePusher = () => {
  const bindEvents = (conversationId, callbacks) => {
    const channel = pusher.subscribe(`private-conversation.${conversationId}`);
    
    if (callbacks.onNewMessage) {
      channel.bind('MessageSent', callbacks.onNewMessage);
    }
    
    if (callbacks.onMessageRead) {
      channel.bind('MessageRead', callbacks.onMessageRead);
    }
    
    if (callbacks.onUserTyping) {
      channel.bind('UserTyping', callbacks.onUserTyping);
    }
    
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-conversation.${conversationId}`);
    };
  };

  return { bindEvents };
};