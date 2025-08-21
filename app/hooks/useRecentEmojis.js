// src/hooks/useRecentEmojis.js
import { useState, useEffect } from 'react';

const RECENT_EMOJIS_KEY = 'recentEmojis';

const useRecentEmojis = () => {
  const [recentEmojis, setRecentEmojis] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_EMOJIS_KEY);
    if (saved) {
      try {
        setRecentEmojis(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(RECENT_EMOJIS_KEY);
      }
    }
  }, []);
  
  const addRecentEmoji = (emoji) => {
    const newRecent = [
      emoji,
      ...recentEmojis.filter(e => e.native !== emoji.native)
    ].slice(0, 18); // Keep only 18 most recent
    
    setRecentEmojis(newRecent);
    localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(newRecent));
  };
  
  return { recentEmojis, addRecentEmoji };
};

export default useRecentEmojis;