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

	const handleEmojiSelect = (emoji) => {
		const cursorPosition = inputRef.current.selectionStart;
		const textBefore = message.substring(0, cursorPosition);
		const textAfter = message.substring(cursorPosition);

		setMessage(textBefore + emoji + textAfter);

		// Move cursor after inserted emoji
		setTimeout(() => {
			inputRef.current.selectionStart = cursorPosition + emoji.length;
			inputRef.current.selectionEnd = cursorPosition + emoji.length;
		}, 0);
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-center">
			<div className="flex-1">
				{replyingTo && (
					<div className="flex justify-between p-2 mb-2 text-sm bg-gray-100 rounded">
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
				<div className="relative">
					<input
						ref={inputRef}
						type="text"
						value={message}
						onChange={handleChange}
						placeholder="Type a message..."
						className="w-full py-2 pl-4 pr-12 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div className="absolute flex space-x-2 transform -translate-y-1/2 right-3 top-1/2">
						<EmojiPicker onSelect={handleEmojiSelect} position="top" />
					</div>
				</div>
			</div>
			<button
				type="submit"
				className="p-2 ml-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
				</svg>
			</button>
		</form>
	);
};

export default MessageInput;