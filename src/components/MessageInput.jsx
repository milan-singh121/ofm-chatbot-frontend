// /frontend/src/components/MessageInput.jsx

import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

const MessageInput = ({ onSendMessage, isLoading, disabled }) => {
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading && !disabled) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto p-4">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSend(e);
                            }
                        }}
                        placeholder={disabled ? "Select a conversation to begin" : "Ask about sales, inventory, or forecasts..."}
                        className="w-full pl-4 pr-20 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="1"
                        disabled={isLoading || disabled}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || disabled || !input.trim()}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
                 <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                    InsightAI by OFM. For internal use only.
                </p>
            </div>
        </div>
    );
};

export default MessageInput;
