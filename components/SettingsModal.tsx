import React from 'react';
import { Theme, Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, theme, setTheme, language, setLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-2xl p-6 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-3 opacity-80">Appearance</label>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setTheme('light')}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'}`}
            >
              <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
              <span className="text-sm font-medium">Light</span>
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-slate-700' : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'}`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-600"></div>
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button 
              onClick={() => setTheme('eye-care')}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${theme === 'eye-care' ? 'border-amber-500 bg-[#F5F1E6] text-amber-900' : 'border-gray-200 dark:border-slate-600 hover:border-amber-300'}`}
            >
              <div className="w-6 h-6 rounded-full bg-[#F5F1E6] border border-amber-200"></div>
              <span className="text-sm font-medium">Eye Care</span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-3 opacity-80">Output Language</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${language === 'en' ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-slate-700 dark:text-blue-200' : 'border-gray-200 dark:border-slate-600'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('zh')}
              className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${language === 'zh' ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-slate-700 dark:text-blue-200' : 'border-gray-200 dark:border-slate-600'}`}
            >
              中文 (Chinese)
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
