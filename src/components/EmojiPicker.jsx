// src/components/EmojiPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Picker } from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = ({ onSelect, position = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEmojiSelect = (emoji) => {
    onSelect(emoji.native);
    setIsOpen(false);
  };

  const positionClass = position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute ${positionClass} right-0 z-10`}>
          <Picker 
            data={data} 
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            searchPosition="sticky"
            skinTonePosition="none"
            dynamicWidth={true}
            perLine={8}
            emojiSize={24}
            set="twitter"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;