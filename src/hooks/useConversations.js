import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'ofm_sales_ai_conversations';
const ACTIVE_CONV_KEY = 'ofm_sales_ai_active_conversation';

export function useConversations() {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_CONV_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    try {
      if (activeConversationId) {
        localStorage.setItem(ACTIVE_CONV_KEY, activeConversationId);
      } else {
        localStorage.removeItem(ACTIVE_CONV_KEY);
      }
    } catch {}
  }, [activeConversationId]);

  const createNewConversation = (title = 'New Analysis') => {
    const id = uuidv4();
    setConversations(prev => ({
      ...prev,
      [id]: {
        id,
        title,
        messages: [{ id: uuidv4(), sender: 'bot', text: 'How can I help you?', type: 'text' }],
      },
    }));
    setActiveConversationId(id);
  };

  const addMessageToConversation = (id, msg) => {
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        messages: [...(prev[id]?.messages || []), { id: uuidv4(), ...msg }],
      },
    }));
  };

  const updateConversationTitle = (id, newTitle) => {
    setConversations(prev => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle },
    }));
  };

  const deleteConversation = (id) => {
    setConversations(prev => {
      const newConvs = { ...prev };
      delete newConvs[id];
      return newConvs;
    });
    setActiveConversationId(prevId => (prevId === id ? null : prevId));
  };

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    addMessageToConversation,
    updateConversationTitle,
    deleteConversation,
  };
}
