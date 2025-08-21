import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, startTyping } = useChat();
  const inputRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    await sendMessage(message, replyingTo);
    setMessage('');
    setReplyingTo(null);
    
    // Reset typing state
    setIsTyping(false);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator
    if (!isTyping) {
      setIsTyping(true);
      startTyping();
    }
    
    // Reset typing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="flex-1">
        {replyingTo && (
          <div className="bg-gray-100 p-2 mb-2 rounded text-sm flex justify-between">
            <div>
              Replying to <span className="font-semibold">{replyingTo.sender.username}</span>: 
              {replyingTo.content.substring(0, 30)}{replyingTo.content.length > 30 ? '...' : ''}
            </div>
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setReplyingTo(null)}
            >
              ×
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        type="submit"
        className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;