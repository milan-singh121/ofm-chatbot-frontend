import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, isLoading, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    // Auto-resize the textarea height based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            // Set a max height (e.g., 200px)
            textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading && !disabled) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="relative flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        // Send on Enter, new line on Shift+Enter
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSend(e);
                        }
                    }}
                    placeholder={disabled ? "Select a conversation to begin" : "Ask about sales, inventory, or forecasts..."}
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                    rows="1"
                    disabled={isLoading || disabled}
                />
                <button
                    type="submit"
                    disabled={isLoading || disabled || !input.trim()}
                    className="absolute right-3 bottom-2.5 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    aria-label="Send message"
                >
                    <Send size={20} />
                </button>
            </form>
             <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                InsightAI by OFM. For internal use only.
            </p>
        </div>
    );
};

export default MessageInput;
