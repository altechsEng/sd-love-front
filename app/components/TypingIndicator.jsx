// src/components/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;
  
  // Random emoji for fun
  const emojis = ['✍️', '🤔', '💭', '💬', '📝'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  return (
    <div className="px-4 py-1">
      <div className="flex items-center text-sm text-gray-500 italic">
        <div className="flex mr-2">
          {users.slice(0, 3).map((user, index) => (
            <div 
              key={user.id} 
              className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
              style={{ zIndex: 3 - index, marginLeft: index > 0 ? '-8px' : 0 }}
            >
              {user.username.charAt(0)}
            </div>
          ))}
        </div>
        <span>
          {users.length > 1 
            ? `${users.map(u => u.username).join(', ')} are typing...`
            : `${users[0].username} is typing...`}
          <span className="ml-1">{randomEmoji}</span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;