// src/components/Message.jsx
import React, { useEffect, useRef } from 'react';
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


	const [showReactions, setShowReactions] = useState(false);
	const [reactions, setReactions] = useState([]);

	const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '👎'];

	const handleAddReaction = (emoji) => {
		// In a real app, you would send this to your backend
		setReactions(prev => [
			...prev,
			{ id: Date.now(), emoji, user: { id: user.id, username: user.username } }
		]);
		setShowReactions(false);
	};

	return (
		<div
			ref={messageRef}
			className={`group relative flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
		>
			<div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${isOwn ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
				{/* ... existing content ... */}

				{/* Reactions */}
				{reactions.length > 0 && (
					<div className="flex flex-wrap mt-1 -mb-1">
						{reactions.map(reaction => (
							<div
								key={reaction.id}
								className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 mr-1 mb-1"
							>
								{reaction.emoji} {reaction.user.username}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Reaction button */}
			{!isOwn && (
				<button
					className="absolute right-0 p-1 transition-opacity bg-white border rounded-full shadow-md opacity-0 -bottom-2 group-hover:opacity-100"
					onClick={() => setShowReactions(!showReactions)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</button>
			)}

			{/* Reaction picker */}
			{showReactions && (
				<div className="absolute right-0 flex p-1 bg-white border rounded-lg shadow-lg -top-10">
					{commonReactions.map(emoji => (
						<button
							key={emoji}
							className="p-1 text-xl rounded hover:bg-gray-100"
							onClick={() => handleAddReaction(emoji)}
						>
							{emoji}
						</button>
					))}
					<button
						className="p-1 text-gray-500 rounded hover:bg-gray-100"
						onClick={() => setShowReactions(false)}
					>
						×
					</button>
				</div>
			)}
		</div>
	);
};

export default Message;