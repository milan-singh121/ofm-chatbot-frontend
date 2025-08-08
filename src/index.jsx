import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Send, Bot, User, FileText, Sparkles, Loader2, Sun, Moon, History, X } from 'lucide-react';

// --- Theme Context (for Light/Dark Mode) ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);


// --- Reusable UI Components ---

const ChatMessage = ({ msg }) => {
  const { theme } = useTheme();
  const isBot = msg.sender === 'bot';
  const colors = theme === 'dark' 
    ? ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"]
    : ["#5A67D8", "#38A169", "#D69E2E", "#DD6B20", "#3182CE"];

  return (
    <div className="flex items-start gap-4 w-full">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300`}>
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1 pt-1">
        <p className="font-bold text-gray-800 dark:text-gray-200">{isBot ? 'Fashion AI' : 'You'}</p>
        <div className="mt-1 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          <p className="whitespace-pre-wrap">{msg.text}</p>
          {msg.type === 'chart' && msg.chartData && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg w-full h-[350px] animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={msg.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#4A5568" : "#E2E8F0"} />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? "#A0AEC0" : "#4A5568"} tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568', fontSize: 12 }} />
                  <YAxis stroke={theme === 'dark' ? "#A0AEC0" : "#4A5568"} tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568', fontSize: 12 }}/>
                  <Tooltip 
                    contentStyle={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
                        border: `1px solid ${theme === 'dark' ? '#4A5568' : '#E2E8F0'}`, 
                        backdropFilter: 'blur(4px)' 
                    }} 
                    labelStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#1A202C' }}
                  />
                  <Legend wrapperStyle={{fontSize: "14px"}} />
                  {msg.dataKeys && msg.dataKeys.map((key, index) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2} activeDot={{ r: 8 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="flex items-start gap-4 w-full">
    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <Bot size={20} className="text-gray-600 dark:text-gray-300" />
    </div>
    <div className="flex-1 pt-1 flex items-center gap-3">
       <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" size={20} />
       <span className="text-sm text-gray-500 dark:text-gray-400">Analyzing...</span>
    </div>
  </div>
);


// --- Main App Component ---
const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [conversations, setConversations] = useState(() => JSON.parse(localStorage.getItem('conversations')) || {});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const messages = conversations[activeConversationId]?.messages || [];

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const createNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConversation = {
        id: newId,
        title: "New Conversation",
        messages: [{
            sender: 'bot',
            text: 'Hello! I am your Fashion Insights AI. Ask me about sales, inventory, or revenue forecasts.',
            type: 'text'
        }]
    };
    setConversations(prev => ({ ...prev, [newId]: newConversation }));
    setActiveConversationId(newId);
  };

  useEffect(() => {
    if (Object.keys(conversations).length === 0) {
        createNewConversation();
    } else if (!activeConversationId) {
        setActiveConversationId(Object.keys(conversations)[0]);
    }
  }, []);


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input, type: 'text' };
    
    const updatedConversations = { ...conversations };
    updatedConversations[activeConversationId].messages.push(userMessage);

    // Update title if it's the first user message
    if (updatedConversations[activeConversationId].messages.length === 2) {
        updatedConversations[activeConversationId].title = input;
    }

    setConversations(updatedConversations);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // --- Backend API Call ---
    // In a real app, you would also send the conversation ID
    // so the backend can access chat history from MongoDB.
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput, conversation_id: activeConversationId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || `HTTP error! status: ${response.status}`);
      }

      const botResponse = await response.json();
      setConversations(prev => {
          const newConversations = { ...prev };
          newConversations[activeConversationId].messages.push(botResponse);
          return newConversations;
      });

    } catch (error) {
      console.error("Error fetching from backend:", error);
      const errorResponse = {
        sender: 'bot',
        text: `Sorry, an error occurred: ${error.message}.`,
        type: 'text'
      };
      setConversations(prev => {
          const newConversations = { ...prev };
          newConversations[activeConversationId].messages.push(errorResponse);
          return newConversations;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
            <Sparkles size={40} className="text-indigo-500"/>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Fashion Insights AI</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Ready to analyze your sales and inventory data.</p>
    </div>
  );

  const Sidebar = () => (
    <div className={`absolute top-0 left-0 h-full w-72 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 flex flex-col p-4`}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">History</h2>
            <button onClick={() => setIsHistoryOpen(false)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <X size={20} />
            </button>
        </div>
        <button onClick={createNewConversation} className="w-full mb-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            + New Chat
        </button>
        <div className="flex-grow overflow-y-auto">
            {Object.values(conversations).reverse().map(conv => (
                <button 
                    key={conv.id} 
                    onClick={() => {
                        setActiveConversationId(conv.id);
                        setIsHistoryOpen(false);
                    }}
                    className={`w-full text-left p-2 my-1 rounded-md truncate ${activeConversationId === conv.id ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                    {conv.title}
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <div className={`flex h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans antialiased theme-${theme}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col items-center relative">
        <header className="w-full max-w-4xl p-4 flex justify-between items-center">
            <button onClick={() => setIsHistoryOpen(true)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <History size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                {conversations[activeConversationId]?.title || 'Fashion AI'}
            </h1>
            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>

        <div className="flex-1 w-full max-w-4xl overflow-y-auto px-4 pb-24 pt-8">
          <div className="flex flex-col space-y-8">
            {messages.length > 0 ? messages.map((msg, index) => <ChatMessage key={index} msg={msg} />) : <WelcomeScreen />}
            {isLoading && <LoadingIndicator />}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="absolute bottom-0 w-full flex justify-center p-6 bg-gradient-to-t from-white dark:from-gray-950 to-transparent">
            <div className="w-full max-w-4xl">
                <div className="flex items-start bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-2 shadow-2xl">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 resize-none max-h-48"
                        placeholder="Ask about sales, inventory, or forecasts..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-3 rounded-lg transition-colors self-end"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send />
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

// --- Final Wrapper ---
// This ensures the App is wrapped in the ThemeProvider
const FinalApp = () => (
    <ThemeProvider>
        <App />
    </ThemeProvider>
);

export default FinalApp;
