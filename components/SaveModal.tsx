import React, { useState } from 'react';
import { Theme } from '../types';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folder: string) => void;
  existingFolders: string[];
  theme: Theme;
}

export const SaveModal: React.FC<SaveModalProps> = ({
  isOpen, onClose, onConfirm, existingFolders, theme
}) => {
  const [mode, setMode] = useState<'select' | 'create'>(existingFolders.length > 0 ? 'select' : 'create');
  const [selectedFolder, setSelectedFolder] = useState<string>(existingFolders[0] || '');
  const [newFolder, setNewFolder] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const folder = mode === 'create' ? newFolder.trim() : selectedFolder;
    if (folder) {
      onConfirm(folder);
      setNewFolder(''); // Reset
    }
  };

  const bgColor = theme === 'dark' ? 'bg-slate-800' : theme === 'eye-care' ? 'bg-[#F5F1E6]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`w-full max-w-sm rounded-xl shadow-2xl p-6 ${bgColor} ${textColor}`}>
        <h2 className="text-xl font-bold mb-4">Save to Library</h2>
        
        <div className="flex gap-4 mb-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={mode === 'select'} 
              onChange={() => setMode('select')}
              disabled={existingFolders.length === 0}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span>Existing Folder</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={mode === 'create'} 
              onChange={() => setMode('create')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span>New Folder</span>
          </label>
        </div>

        <div className="mb-6">
          {mode === 'select' ? (
            <select 
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className={`w-full p-2 rounded-lg border ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {existingFolders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              placeholder="e.g. CVPR 2024"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              autoFocus
              className={`w-full p-2 rounded-lg border ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500`}
            />
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium opacity-70 hover:opacity-100 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={mode === 'create' && !newFolder.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Paper
          </button>
        </div>
      </div>
    </div>
  );
};
