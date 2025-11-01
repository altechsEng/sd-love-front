// src/components/EnhancedEmojiPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Picker } from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useRecentEmojis from '../hooks/useRecentEmojis';

const EnhancedEmojiPicker = ({ onSelect, position = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customData, setCustomData] = useState(null);
  const pickerRef = useRef(null);
  const { recentEmojis, addRecentEmoji } = useRecentEmojis();

  useEffect(() => {
    if (!data) return;

    // Create custom data with recent emojis category
    const customCategories = [
      {
        id: 'recent',
        name: 'Recently Used',
        emojis: recentEmojis.map(e => e.id)
      },
      ...data.categories
    ];

    // Add recent emojis to the main emoji list
    const customEmojis = [...recentEmojis, ...data.emojis];

    setCustomData({
      ...data,
      categories: customCategories,
      emojis: customEmojis
    });
  }, [recentEmojis]);

  // ... rest of existing EmojiPicker code ...
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
    addRecentEmoji(emoji);
    onSelect(emoji.native);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* ... existing button and picker code ... */}
      {isOpen && customData && (
        <div className={`absolute ${positionClass} right-0 z-10`}>
          <Picker
            data={customData}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            searchPosition="sticky"
            skinTonePosition="none"
            dynamicWidth={true}
            perLine={8}
            emojiSize={24}
            set="twitter"
            categories={customData.categories}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedEmojiPicker;