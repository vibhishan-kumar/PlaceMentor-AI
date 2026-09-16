import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch student chats on authentication
  const fetchChats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingChats(true);
      const response = await api.get('/chats');
      if (response.data.success) {
        setChats(response.data.chats);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoadingChats(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Select and load a chat conversation
  const selectChat = async (chatId) => {
    if (chatId === currentChatId) return;
    try {
      setCurrentChatId(chatId);
      setLoadingMessages(true);
      const response = await api.get(`/chats/${chatId}`);
      if (response.data.success) {
        setCurrentMessages(response.data.chat.messages || []);
      }
    } catch (error) {
      toast.error('Failed to load chat conversation.');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Start a new chat
  const startNewChat = async (initialTitle = 'New Chat') => {
    try {
      const response = await api.post('/chats', { title: initialTitle });
      if (response.data.success) {
        const newChat = response.data.chat;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        setCurrentMessages([]);
        return newChat;
      }
    } catch (error) {
      toast.error('Failed to create new chat session.');
      throw error;
    }
  };

  // Send a message (with optional attached resume file)
  const sendMessage = async (content, resumeFile = null, targetCompany = '', targetRole = '') => {
    if (!content?.trim() && !resumeFile) return;
    if (sendingMessage) return;

    let targetChatId = currentChatId;

    try {
      setSendingMessage(true);

      // If no chat is active, create one first
      if (!targetChatId) {
        const created = await startNewChat('New Chat');
        targetChatId = created.id;
      }

      // Optimistic user message addition
      const displayContent = resumeFile
        ? `📎 **Attached Resume:** \`${resumeFile.name}\`\n\n${(content || '').trim() || 'Please evaluate this resume for campus placements and ATS compatibility.'}`
        : content.trim();

      const tempUserMessage = {
        id: 'temp-' + Date.now(),
        chatId: targetChatId,
        role: 'USER',
        content: displayContent,
        createdAt: new Date().toISOString()
      };
      setCurrentMessages((prev) => [...prev, tempUserMessage]);

      // Call API with multipart/form-data if file attached, otherwise JSON
      let response;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('content', (content || '').trim());
        formData.append('resume', resumeFile);
        if (targetCompany) formData.append('targetCompany', targetCompany);
        if (targetRole) formData.append('targetRole', targetRole);

        response = await api.post(`/chats/${targetChatId}/messages`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post(`/chats/${targetChatId}/messages`, {
          content: content.trim()
        });
      }

      if (response.data.success) {
        const { userMessage, assistantMessage, chatTitle } = response.data;

        // Replace optimistic message and append assistant message
        setCurrentMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id),
          userMessage,
          assistantMessage
        ]);

        // Update chat title and position in list
        setChats((prev) => {
          const exists = prev.find((c) => c.id === targetChatId);
          const updatedChat = {
            ...(exists || { id: targetChatId }),
            title: chatTitle || exists?.title || 'Placement Discussion',
            updatedAt: new Date().toISOString()
          };
          return [updatedChat, ...prev.filter((c) => c.id !== targetChatId)];
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.response?.data?.message || 'Unable to send message right now.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Rename a chat
  const renameChat = async (chatId, newTitle) => {
    try {
      const response = await api.patch(`/chats/${chatId}`, { title: newTitle });
      if (response.data.success) {
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
        );
        toast.success('Chat renamed successfully.');
      }
    } catch (error) {
      toast.error('Failed to rename chat.');
    }
  };

  // Delete a chat
  const deleteChat = async (chatId) => {
    try {
      const response = await api.delete(`/chats/${chatId}`);
      if (response.data.success) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setCurrentMessages([]);
        }
        toast.success('Chat deleted.');
      }
    } catch (error) {
      toast.error('Failed to delete chat.');
    }
  };

  // Filtered chats based on search query
  const filteredChats = chats.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <ChatContext.Provider
      value={{
        chats: filteredChats,
        allChats: chats,
        currentChatId,
        currentMessages,
        loadingChats,
        loadingMessages,
        sendingMessage,
        searchQuery,
        setSearchQuery,
        fetchChats,
        selectChat,
        startNewChat,
        sendMessage,
        renameChat,
        deleteChat,
        setCurrentChatId,
        setCurrentMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
