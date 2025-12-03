import React from 'react';
import { ViewState, Theme } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  folders: string[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onOpenSettings: () => void;
  theme: Theme;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  folders,
  selectedFolder,
  onSelectFolder,
  isOpen,
  setIsOpen,
  onOpenSettings,
  theme
}) => {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-slate-900 border-slate-700' : theme === 'eye-care' ? 'bg-[#E8E4D9] border-[#D6D2C4] text-stone-800' : 'bg-slate-900 border-slate-800 text-white';
  const textClass = theme === 'eye-care' ? 'text-stone-700' : 'text-slate-300';
  const activeClass = theme === 'eye-care' ? 'bg-[#D6D2C4] text-stone-900' : 'bg-slate-800 text-blue-400';
  const hoverClass = theme === 'eye-care' ? 'hover:bg-[#D6D2C4]' : 'hover:bg-slate-800';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 ${bgClass} transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col shadow-xl border-r
      `}>
        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-slate-700' : theme === 'eye-care' ? 'border-[#D6D2C4]' : 'border-slate-800'}`}>
          <h1 className={`text-xl font-bold tracking-wider ${theme === 'eye-care' ? 'text-stone-800' : 'text-blue-400'}`}>ScholarLens</h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-6">
            <button
              onClick={() => { onChangeView(ViewState.UPLOAD); setIsOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg transition-colors font-medium shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Analyze New PDF
            </button>
          </div>

          <div className="px-4">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'eye-care' ? 'text-stone-500' : 'text-slate-500'}`}>Library</div>
            <button
              onClick={() => {
                onSelectFolder(null);
                onChangeView(ViewState.LIBRARY);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors flex items-center gap-2 ${currentView === ViewState.LIBRARY && selectedFolder === null ? activeClass : `${textClass} ${hoverClass}`}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              All Papers
            </button>
            
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => {
                  onSelectFolder(folder);
                  onChangeView(ViewState.LIBRARY);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors flex items-center gap-2 ${selectedFolder === folder ? activeClass : `${textClass} ${hoverClass}`}`}
              >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                {folder}
              </button>
            ))}
          </div>
        </nav>
        
        <div className={`p-4 border-t flex flex-col gap-2 ${isDark ? 'border-slate-700' : theme === 'eye-care' ? 'border-[#D6D2C4]' : 'border-slate-800'}`}>
           <button 
             onClick={onOpenSettings}
             className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${textClass} ${hoverClass}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             Settings
           </button>
           <div className={`text-xs text-center ${theme === 'eye-care' ? 'text-stone-400' : 'text-slate-500'}`}>
            Gemini 2.5 Flash
           </div>
        </div>
      </div>
    </>
  );
};
