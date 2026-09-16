import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { groupChatsByDate } from '../../utils/formatDate';
import {
  SquarePen,
  Search,
  MessageSquare,
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  Check,
  PanelLeftClose,
  FileText,
  Briefcase,
  Sparkles,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const ChatSidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, setIsMobileOpen }) => {
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
  const navigate = useNavigate();

  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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

  const navTools = [
    { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { label: 'My Resumes', path: '/my-resumes', icon: Briefcase },
    { label: 'JD Analyzer', path: '/jd-analyzer', icon: Sparkles },
    { label: 'Placement Resources', path: '/resources', icon: BookOpen },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 w-64 sm:w-72 select-none">
      {/* Top Header matching ChatGPT: Brand title + Search + Collapse icon */}
      <div className="p-3.5 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
            PlaceMentor <span className="text-teal-400 font-semibold">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearching(!isSearching)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Search chats"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Hide / Collapse Sidebar Toggle */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input (Expandable) */}
      {isSearching && (
        <div className="px-3 pb-2 animate-fadeIn">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
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
      )}

      {/* Primary Actions matching ChatGPT */}
      <div className="px-3 space-y-1">
        {/* New Chat Button */}
        <button
          onClick={handleStartNewChat}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 hover:text-white transition-all group"
        >
          <SquarePen className="w-4 h-4 text-slate-400 group-hover:text-white" />
          <span>New chat</span>
        </button>

        {/* Feature Nav Links */}
        {navTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-all"
            >
              <Icon className="w-4 h-4 text-slate-500" />
              <span>{tool.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-2 border-t border-slate-800/80 mx-3" />

      {/* Recents Section Header matching screenshot */}
      <div className="px-4 pt-1 pb-1">
        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Recents
        </h3>
      </div>

      {/* Recents Chat List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {chats.length === 0 ? (
          <div className="text-center py-6 px-4">
            <p className="text-xs text-slate-500">No chat history yet.</p>
          </div>
        ) : (
          chats.map((chat) => {
            const isSelected = chat.id === currentChatId;
            const isEditing = chat.id === editingChatId;

            return (
              <div
                key={chat.id}
                onClick={() => !isEditing && handleSelectChat(chat.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
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
                  <span className="truncate flex-1 pr-2">{chat.title || 'New Chat'}</span>
                )}

                {/* More Options Button */}
                {!isEditing && (
                  <div className="relative shrink-0">
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
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {activeMenuChatId === chat.id && (
                      <div
                        className="absolute right-0 top-6 z-30 w-32 rounded-xl bg-slate-900 border border-slate-700 p-1 shadow-xl animate-fadeIn"
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
          })
        )}
      </div>

      {/* Bottom Student Profile matching ChatGPT screenshot */}
      <div className="p-3 border-t border-slate-800/80 relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-slate-900/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Student Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wide truncate">
                {user?.name || 'STUDENT NAME'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user?.program || 'UoH'} • Placement
              </p>
            </div>
          </div>

          <MoreHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
        </button>

        {/* Profile Popover Menu */}
        {showProfileMenu && (
          <div
            className="absolute bottom-16 left-3 right-3 rounded-2xl bg-slate-900 border border-slate-700/80 p-1.5 shadow-2xl z-40 animate-fadeIn"
            onClick={() => setShowProfileMenu(false)}
          >
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <User className="w-4 h-4 text-teal-400" />
              <span>Student Profile</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>

            <div className="my-1 border-t border-slate-800" />

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(chatToDelete)}
        onClose={() => setChatToDelete(null)}
        title="Delete chat?"
      >
        <p className="text-xs text-slate-300 leading-relaxed">
          Are you sure you want to delete <strong className="text-white">"{chatToDelete?.title}"</strong>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setChatToDelete(null)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-500"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Rendered if not collapsed) */}
      {!isCollapsed && (
        <div className="hidden md:flex h-full shrink-0 transition-all duration-300">
          {sidebarContent}
        </div>
      )}

      {/* Mobile Drawer */}
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
