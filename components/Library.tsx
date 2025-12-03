import React from 'react';
import { StoredPaper } from '../types';

interface LibraryProps {
  papers: StoredPaper[];
  onSelectPaper: (paper: StoredPaper) => void;
  selectedFolder: string | null;
}

export const Library: React.FC<LibraryProps> = ({ papers, onSelectPaper, selectedFolder }) => {
  const filteredPapers = selectedFolder 
    ? papers.filter(p => p.folder === selectedFolder)
    : papers;

  if (filteredPapers.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-50">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        <p className="text-lg font-medium">No papers found in {selectedFolder || 'library'}</p>
        <p className="text-sm">Upload a PDF to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
           <h2 className="text-2xl font-bold opacity-90">{selectedFolder || 'All Papers'}</h2>
           <span className="text-sm opacity-50 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">{filteredPapers.length}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map(paper => (
            <div 
              key={paper.id} 
              onClick={() => onSelectPaper(paper)}
              className="group relative rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-64 overflow-hidden border border-black/5 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm"
            >
              <div className="p-5 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 opacity-80">{paper.folder || 'Uncategorized'}</span>
                  <span className="text-xs font-mono opacity-60 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{paper.year}</span>
                </div>
                
                <h3 className="font-bold leading-tight mb-2 line-clamp-3 text-lg flex-grow">{paper.title}</h3>
                <p className="text-sm opacity-70 line-clamp-1 mb-4">{paper.authors.join(', ')}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto overflow-hidden h-14 content-end mask-image-b">
                   {paper.keywords && paper.keywords.slice(0, 4).map((keyword, idx) => (
                     <span key={idx} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                       {keyword}
                     </span>
                   ))}
                   {paper.keywords && paper.keywords.length > 4 && (
                     <span className="text-xs px-2 py-1 opacity-50">+{paper.keywords.length - 4}</span>
                   )}
                </div>
              </div>
              
              <div className="px-5 py-3 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-xs opacity-50 group-hover:opacity-100 transition-opacity bg-gray-50/50 dark:bg-slate-900/30">
                <span>{new Date(paper.addedAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                  Read Analysis &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};