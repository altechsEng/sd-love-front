// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import EmojiPicker from './EmojiPicker';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchMessages } = useChat();
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    
    const results = await searchMessages(query);
    setResults(results);
    setShowResults(true);
  };

  const handleEmojiSelect = (emoji) => {
    setQuery(prev => prev + emoji);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full border rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <EmojiPicker onSelect={handleEmojiSelect} position="bottom" />
          <button 
            type="submit"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map(result => (
            <div key={result.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {result.sender.username.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{result.sender.username}</div>
                  <div className="text-sm text-gray-600">{result.content}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(result.sent_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;