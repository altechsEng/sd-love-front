import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { usePusher } from '../services/pusher';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const { user } = useAuth();
    const { bindEvents } = usePusher();

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    useEffect(() => {
        if (activeConversation) {
            bindEvents(activeConversation.id);
        }
    }, [activeConversation]);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await api.get(`/conversations/${conversationId}/messages`);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const sendMessage = async (content, replyTo = null) => {
        if (!activeConversation) return;

        try {
            const response = await api.post(`/conversations/${activeConversation.id}/messages`, {
                content,
                reply_to: replyTo?.id
            });

            setMessages(prev => [...prev, response.data]);
            return response.data;
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const markAsRead = async (message) => {
        if (message.sender_id === user.id) return;

        try {
            await api.post(`/messages/${message.id}/read`);
            // Update message status in local state
            setMessages(prev => prev.map(m =>
                m.id === message.id
                    ? { ...m, is_read: true }
                    : m
            ));
        } catch (error) {
            console.error('Failed to mark message as read', error);
        }
    };

    const searchMessages = async (query) => {
        try {
            const response = await api.get('/search/messages', { params: { query } });
            return response.data;
        } catch (error) {
            console.error('Search failed', error);
            return [];
        }
    };

    const startTyping = async () => {
        if (!activeConversation) return;
        await api.post(`/conversations/${activeConversation.id}/typing`);
    };

    const handleNewMessage = (message) => {
        if (message.conversation_id === activeConversation?.id) {
            setMessages(prev => [...prev, message]);
        }

        // Update conversation list
        setConversations(prev => {
            const index = prev.findIndex(c => c.id === message.conversation_id);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = { ...updated[index], last_message: message };
                return updated.sort((a, b) =>
                    new Date(b.last_message.sent_at) - new Date(a.last_message.sent_at)
                );
            }
            return prev;
        });
    };

    const handleMessageRead = (messageId, userId) => {
        if (userId === user.id) return;

        setMessages(prev => prev.map(m =>
            m.id === messageId
                ? { ...m, is_read: true }
                : m
        ));
    };

    const handleUserTyping = (typingUser) => {
        if (typingUser.id === user.id) return;

        setTypingUsers(prev => {
            // Prevent duplicates
            if (!prev.find(u => u.id === typingUser.id)) {
                return [...prev, typingUser];
            }
            return prev;
        });

        // Clear typing indicator after 3 seconds
        setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u.id !== typingUser.id));
        }, 3000);
    };

    // Bind Pusher events
    //   const bindEvents = (conversationId) => {
    //     const channel = pusher.subscribe(`private-conversation.${conversationId}`);

    //     channel.bind('MessageSent', (data) => {
    //       handleNewMessage(data.message);
    //     });

    //     channel.bind('MessageRead', (data) => {
    //       handleMessageRead(data.messageId, data.userId);
    //     });

    //     channel.bind('UserTyping', (data) => {
    //       handleUserTyping(data.user);
    //     });

    //     return () => {
    //       channel.unbind_all();
    //       pusher.unsubscribe(`private-conversation.${conversationId}`);
    //     };
    //   };

    return (
        <ChatContext.Provider value={{
            conversations,
            activeConversation,
            messages,
            typingUsers,
            setActiveConversation,
            fetchMessages,
            sendMessage,
            markAsRead,
            searchMessages,
            startTyping,
            fetchConversations
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);