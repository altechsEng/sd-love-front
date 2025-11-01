import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
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
      <div className="p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">{conversationName}</h2>
        <p className="text-sm text-gray-500">
          {activeConversation.is_group 
            ? `${activeConversation.participants.length} participants` 
            : 'Online'}
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="py-4 text-center">Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
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
      
      <div className="p-4 bg-white border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatInterface;