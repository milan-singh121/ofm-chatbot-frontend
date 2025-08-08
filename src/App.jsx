// /frontend/src/App.jsx

import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <ThemeProvider>
      <ChatInterface />
    </ThemeProvider>
  );
}

export default App;
