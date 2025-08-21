import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatInterface = () => {
  const { activeConversation, messages, typingUsers } = useChat();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);

  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-500">Select a conversation to start chatting</h2>
        </div>
      </div>
    );
  }

  const conversationName = activeConversation.is_group 
    ? activeConversation.group_name 
    : activeConversation.participants[0].username;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-white">
        <h2 className="text-xl font-semibold">{conversationName}</h2>
        <p className="text-gray-500 text-sm">
          {activeConversation.is_group 
            ? `${activeConversation.participants.length} participants` 
            : 'Online'}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="text-center py-4">Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map(message => (
                <Message key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <TypingIndicator users={typingUsers} />
      
      <div className="border-t p-4 bg-white">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatInterface;