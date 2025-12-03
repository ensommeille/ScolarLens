import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Upload } from './components/Upload';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { SettingsModal } from './components/SettingsModal';
import { SaveModal } from './components/SaveModal';
import { AnalysisResult, StoredPaper, ViewState, Theme, Language } from './types';
import { savePaper, getPapers, deletePaper } from './db';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LIBRARY);
  const [papers, setPapers] = useState<StoredPaper[]>([]);
  const [currentPaper, setCurrentPaper] = useState<StoredPaper | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // New State
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  // Temporary state for the paper being previewed before saving
  const [previewPaper, setPreviewPaper] = useState<StoredPaper | null>(null);

  // Load library on mount
  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const data = await getPapers();
      setPapers(data);
    } catch (e) {
      console.error("Failed to load library", e);
    }
  };

  const folders = Array.from(new Set(papers.map(p => p.folder))).filter(Boolean).sort();

  const handleAnalysisComplete = (result: AnalysisResult) => {
    // Create a temporary paper object for preview
    const tempPaper: StoredPaper = {
      ...result.metadata,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
      raw_analysis: result.markdown_report,
      folder: '' // No folder yet
    };

    setPreviewPaper(tempPaper);
    setCurrentPaper(tempPaper);
    setView(ViewState.PREVIEW);
  };

  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async (folderName: string) => {
    if (previewPaper) {
      const paperToSave: StoredPaper = {
        ...previewPaper,
        folder: folderName
      };
      
      await savePaper(paperToSave);
      await loadLibrary();
      
      setPreviewPaper(null); // Clear preview
      setCurrentPaper(paperToSave);
      setIsSaveModalOpen(false);
      setView(ViewState.READING);
    }
  };

  const handleSelectPaper = (paper: StoredPaper) => {
    setCurrentPaper(paper);
    setView(ViewState.READING);
  };

  const handleDeletePaper = async () => {
    if (currentPaper) {
      const confirmed = window.confirm(`Are you sure you want to delete "${currentPaper.title}"?\nThis action cannot be undone.`);
      
      if (confirmed) {
        try {
          await deletePaper(currentPaper.id);
          await loadLibrary();
          setView(ViewState.LIBRARY);
          setCurrentPaper(null);
        } catch (error) {
          console.error("Failed to delete paper:", error);
          alert("Failed to delete paper. Please try again.");
        }
      }
    }
  };
  
  // App background based on theme
  const appBg = theme === 'dark' ? 'bg-slate-900' : theme === 'eye-care' ? 'bg-[#F5F1E6]' : 'bg-gray-100';

  return (
    <div className={`flex h-screen ${appBg} font-sans transition-colors duration-300`}>
      <Sidebar
        currentView={view}
        onChangeView={setView}
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className={`md:hidden border-b p-4 flex items-center justify-between shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : theme === 'eye-care' ? 'bg-[#E8E4D9] border-[#D6D2C4] text-stone-800' : 'bg-white border-gray-200 text-gray-800'}`}>
          <span className="font-bold">ScholarLens</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 opacity-70">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {view === ViewState.UPLOAD && (
          <Upload 
            onAnalysisComplete={handleAnalysisComplete} 
            theme={theme}
            language={language}
          />
        )}

        {view === ViewState.LIBRARY && (
          <Library 
            papers={papers} 
            onSelectPaper={handleSelectPaper}
            selectedFolder={selectedFolder}
          />
        )}

        {(view === ViewState.READING || view === ViewState.PREVIEW) && currentPaper && (
          <Reader 
            paper={currentPaper} 
            onBack={() => setView(ViewState.LIBRARY)} 
            onDelete={handleDeletePaper}
            onSave={handleOpenSaveModal}
            isPreview={view === ViewState.PREVIEW}
            theme={theme}
          />
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />

      <SaveModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        existingFolders={folders}
        theme={theme}
      />
    </div>
  );
};

export default App;