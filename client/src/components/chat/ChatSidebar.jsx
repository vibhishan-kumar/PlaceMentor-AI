import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { groupChatsByDate } from '../../utils/formatDate';
import {
  Plus,
  Search,
  MessageSquare,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const ChatSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    chats,
    currentChatId,
    selectChat,
    startNewChat,
    renameChat,
    deleteChat,
    searchQuery,
    setSearchQuery
  } = useChat();

  const { user, logout } = useAuth();

  // State for active action menu on chat item
  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [chatToDelete, setChatToDelete] = useState(null);

  // Group chats by date
  const groupedChats = groupChatsByDate(chats);

  const handleStartNewChat = async () => {
    await startNewChat();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleSelectChat = (chatId) => {
    selectChat(chatId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const startEditing = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setNewChatTitle(chat.title);
    setActiveMenuChatId(null);
  };

  const saveRename = async (chatId, e) => {
    e?.stopPropagation();
    if (newChatTitle.trim()) {
      await renameChat(chatId, newChatTitle.trim());
    }
    setEditingChatId(null);
  };

  const cancelRename = (e) => {
    e?.stopPropagation();
    setEditingChatId(null);
  };

  const confirmDelete = async () => {
    if (chatToDelete) {
      await deleteChat(chatToDelete.id);
      setChatToDelete(null);
    }
  };

  const renderChatGroup = (title, chatList) => {
    if (!chatList || chatList.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
          {title}
        </h4>
        <div className="space-y-0.5">
          {chatList.map((chat) => {
            const isSelected = chat.id === currentChatId;
            const isEditing = chat.id === editingChatId;

            return (
              <div
                key={chat.id}
                onClick={() => !isEditing && handleSelectChat(chat.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  />

                  {isEditing ? (
                    <div
                      className="flex items-center gap-1 flex-1 min-w-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={newChatTitle}
                        onChange={(e) => setNewChatTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(chat.id, e);
                          if (e.key === 'Escape') cancelRename(e);
                        }}
                        autoFocus
                        className="w-full bg-slate-950 px-2 py-1 text-xs rounded border border-teal-500 text-white focus:outline-none"
                      />
                      <button
                        onClick={(e) => saveRename(chat.id, e)}
                        className="p-1 text-teal-400 hover:text-teal-300"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={cancelRename}
                        className="p-1 text-slate-400 hover:text-slate-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="truncate flex-1">{chat.title || 'Untitled Chat'}</span>
                  )}
                </div>

                {/* Actions (Rename, Delete) */}
                {!isEditing && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuChatId(activeMenuChatId === chat.id ? null : chat.id);
                      }}
                      className={`p-1 rounded text-slate-500 hover:text-slate-200 transition-opacity ${
                        isSelected || activeMenuChatId === chat.id
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {activeMenuChatId === chat.id && (
                      <div
                        className="absolute right-0 top-6 z-30 w-32 rounded-xl bg-slate-900 border border-slate-700 p-1 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => startEditing(chat, e)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                          <Edit2 className="w-3 h-3 text-teal-400" />
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuChatId(null);
                            setChatToDelete(chat);
                          }}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 w-72 select-none">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide">PlaceMentor AI</h2>
            <p className="text-[10px] text-teal-400 font-medium">Placement Conversations</p>
          </div>
        </div>

        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3 pb-2">
        <button
          onClick={handleStartNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-slate-950 font-semibold text-xs shadow-md shadow-teal-500/10 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          New Placement Chat
        </button>
      </div>

      {/* Search Chats */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grouped Chat History */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {chats.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No conversations yet.</p>
            <p className="text-[11px] text-slate-600 mt-1">Start a chat to prepare for placements!</p>
          </div>
        ) : (
          <>
            {renderChatGroup('Today', groupedChats.today)}
            {renderChatGroup('Yesterday', groupedChats.yesterday)}
            {renderChatGroup('Previous 7 Days', groupedChats.previous7Days)}
            {renderChatGroup('Older', groupedChats.older)}
          </>
        )}
      </div>

      {/* Sidebar Footer: Student Profile & Settings */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.program || 'UoH'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(chatToDelete)}
        onClose={() => setChatToDelete(null)}
        title="Delete Conversation?"
      >
        <p className="text-xs text-slate-300 leading-relaxed">
          Are you sure you want to delete <strong className="text-white">"{chatToDelete?.title}"</strong>?
          This action will permanently remove all messages in this conversation.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setChatToDelete(null)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex h-full">{sidebarContent}</div>

      {/* Mobile Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10 flex-1 max-w-[280px] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
