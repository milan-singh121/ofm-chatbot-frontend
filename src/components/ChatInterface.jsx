import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useConversations } from '../hooks/useConversations';
import ChatMessage from './ChatMessage';
import Sidebar from './Sidebar';
import Header from './Header';
import MessageInput from './MessageInput';

const ChatInterface = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    addMessageToConversation,
    updateConversationTitle,
    deleteConversation,
  } = useConversations();

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (Object.keys(conversations).length === 0) {
      createNewConversation("OFM Sales Analysis");
    }
  }, [conversations, createNewConversation]);

  const activeConversation = useMemo(
    () => conversations[activeConversationId],
    [conversations, activeConversationId]
  );
  const messages = useMemo(() => activeConversation?.messages || [], [activeConversation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const handleSendMessage = async (input) => {
    if (!input.trim() || isLoading || !activeConversationId) return;
    addMessageToConversation(activeConversationId, { sender: 'user', text: input, type: 'text' });

    if (messages.length === 1) {
      updateConversationTitle(activeConversationId, input);
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('query', input);
    formData.append('conversation_id', activeConversationId);

    const historyForAPI = messages.slice(1).map(msg => ({
      role: msg.sender === 'bot' ? 'bot' : 'user',
      content: msg.text
    }));
    formData.append('history', JSON.stringify(historyForAPI));
// 'http://127.0.0.1:8000/api/chat'
    try {
      const response = await fetch('https://ofm-chatbot-backend.onrender.com', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: `HTTP error! Status: ${response.status}` }));
        throw new Error(err.detail || 'Unknown error occurred.');
      }
      const botResponse = await response.json();
      addMessageToConversation(activeConversationId, botResponse);
    } catch (error) {
      addMessageToConversation(activeConversationId, {
        sender: 'bot',
        text: `Sorry, an error occurred: ${error.message}. Please check server connection.`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans antialiased`}>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={(id) => { setActiveConversationId(id); setIsSidebarOpen(false); }}
        createNewConversation={createNewConversation}
        deleteConversation={deleteConversation}
      />
      <main className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-all relative">
        <Header
          title={activeConversation?.title || "OFM Sales AI"}
          onHistoryClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onThemeToggle={toggleTheme}
          theme={theme}
        />
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
          <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
            {activeConversation ? messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} />
            )) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400 italic">
                Select or start a conversation to begin.
              </div>
            )}
            {isLoading && <ChatMessage.Loading />}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-300 dark:border-gray-700 p-4">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={!activeConversationId} />
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
