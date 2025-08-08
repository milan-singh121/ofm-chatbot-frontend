import React from 'react';
import { Trash2, X } from 'lucide-react';

const Sidebar = ({
  isOpen,
  setIsOpen,
  conversations,
  activeConversationId,
  setActiveConversationId,
  createNewConversation,
  deleteConversation,
}) => (
  <>
    {/* Overlay for mobile */}
    <div
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${isOpen ? 'block' : 'hidden'}`}
      onClick={() => setIsOpen(false)}
    />
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-gray-200 dark:bg-gray-800 border-r dark:border-gray-900 flex flex-col shadow-lg transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:shadow-none
      `}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Conversations</span>
        <div className="flex items-center gap-2">
          {/* Correct onClick: use arrow function */}
          <button
            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={() => createNewConversation()}
            title="New Conversation"
            tabIndex={0}
            type="button"
          >
            +
          </button>
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
            title="Close"
            tabIndex={0}
            type="button"
          >
            <X size={20} color="currentColor" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.values(conversations).map(conv => (
          <div
            key={conv.id}
            className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-lg group
              ${conv.id === activeConversationId ? 'font-semibold text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-300'}`}
          >
            <div
              className="truncate w-full"
              onClick={() => { setActiveConversationId(conv.id); setIsOpen(false); }}
              title={typeof conv.title === 'string' ? conv.title : ''}
            >
              {typeof conv.title === 'string' ? conv.title : ''}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent click
                deleteConversation(conv.id);
              }}
              title="Delete Conversation"
              className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              tabIndex={-1}
              type="button"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  </>
);

export default Sidebar;
