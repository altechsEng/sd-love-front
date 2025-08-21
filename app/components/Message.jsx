// src/components/Message.jsx
import React, { useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import emojiRegex from 'emoji-regex';

const Message = ({ message }) => {
  const { user } = useAuth();
  const { markAsRead } = useChat();
  const isOwn = message.sender_id === user.id;
  const messageRef = useRef(null);
  
  // ... existing code ...
    useEffect(() => {
    // Mark message as read when it becomes visible
    if (!isOwn && !message.is_read) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markAsRead(message);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      
      if (messageRef.current) {
        observer.observe(messageRef.current);
      }
      
      return () => observer.disconnect();
    }
  }, [message, isOwn, markAsRead]);

  // Function to render emojis at larger size
  const renderContentWithEmojis = (content) => {
    const regex = emojiRegex();
    let lastIndex = 0;
    const elements = [];
    
    content.replace(regex, (match, index) => {
      // Add text before emoji
      if (index > lastIndex) {
        elements.push(content.substring(lastIndex, index));
      }
      
      // Add emoji
      elements.push(
        <span key={index} className="inline-block mx-0.5 align-middle text-2xl">
          {match}
        </span>
      );
      
      lastIndex = index + match.length;
      return match;
    });
    
    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }
    
    return elements.length ? elements : content;
  };

  return (
    <div 
      ref={messageRef}
      className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${isOwn ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
        {message.reply_to && (
          <div className={`text-xs border-l-2 pl-2 mb-1 ${isOwn ? 'border-blue-200' : 'border-gray-300'}`}>
            {message.reply_to.sender.username}: {message.reply_to.content}
          </div>
        )}
        
        <p className="break-words">{renderContentWithEmojis(message.content)}</p>
        
        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
          {format(new Date(message.sent_at), 'HH:mm')}
          {isOwn && (
            <span className="ml-2">
              {message.statuses.every(s => s.is_read) 
                ? 'Read' 
                : message.statuses.every(s => s.is_delivered) 
                  ? 'Delivered' 
                  : 'Sent'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;