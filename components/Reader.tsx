import React from 'react';
import { StoredPaper, Theme } from '../types';

interface ReaderProps {
  paper: StoredPaper;
  onBack: () => void;
  onDelete: () => void;
  onSave?: () => void;
  isPreview?: boolean;
  theme: Theme;
}

// Simple Markdown Parser Helpers
const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const RenderMarkdown = ({ text, themeStyles }: { text: string, themeStyles: any }) => {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={i} className={`text-3xl font-bold mt-8 mb-4 leading-tight ${themeStyles.h1}`}>{parseInline(trimmed.substring(2))}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={i} className={`text-2xl font-bold mt-8 mb-3 border-b pb-2 ${themeStyles.h2}`}>{parseInline(trimmed.substring(3))}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={i} className={`text-xl font-bold mt-6 mb-2 ${themeStyles.h3}`}>{parseInline(trimmed.substring(4))}</h3>;
        }
        
        // Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <li key={i} className="ml-5 list-disc my-1 pl-1 leading-relaxed">{parseInline(trimmed.substring(2))}</li>;
        }
        
        // Numbered Lists (Simple detection)
        if (/^\d+\.\s/.test(trimmed)) {
           const match = trimmed.match(/^\d+\.\s/);
           if (match) {
             const number = match[0];
             const content = trimmed.substring(number.length);
             return <div key={i} className="flex gap-2 my-1 leading-relaxed"><span className="font-bold">{number}</span><span>{parseInline(content)}</span></div>;
           }
        }

        // Empty lines
        if (trimmed === '') {
          return <div key={i} className="h-4"></div>;
        }
        
        // Default Paragraph
        return <p key={i} className="my-2 leading-relaxed">{parseInline(line)}</p>;
      })}
    </>
  );
};

export const Reader: React.FC<ReaderProps> = ({ paper, onBack, onDelete, onSave, isPreview = false, theme }) => {
  const isDark = theme === 'dark';
  const isEyeCare = theme === 'eye-care';

  const bgMain = isDark ? 'bg-slate-900' : isEyeCare ? 'bg-[#F5F1E6]' : 'bg-gray-50';
  const bgCard = isDark ? 'bg-slate-800 border-slate-700' : isEyeCare ? 'bg-[#E8E4D9] border-[#D6D2C4]' : 'bg-white border-gray-200';
  const textMain = isDark ? 'text-gray-100' : isEyeCare ? 'text-stone-900' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : isEyeCare ? 'text-stone-500' : 'text-gray-500';
  const headerBg = isDark ? 'bg-slate-800 border-slate-700' : isEyeCare ? 'bg-[#E8E4D9] border-[#D6D2C4]' : 'bg-white border-gray-200';

  const themeStyles = {
    h1: textMain,
    h2: isDark ? 'border-slate-600' : isEyeCare ? 'border-[#D6D2C4] text-stone-800' : 'border-gray-200 text-gray-800',
    h3: isDark ? 'text-gray-300' : isEyeCare ? 'text-stone-700' : 'text-gray-700',
  };

  return (
    <div className={`h-full flex flex-col ${bgMain} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-none border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm ${headerBg}`}>
        <div className="flex items-center gap-4 max-w-[70%]">
          <button onClick={onBack} className={`${textMuted} hover:${textMain} flex-shrink-0`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="overflow-hidden">
             <h1 className={`text-lg font-bold truncate ${textMain}`} title={paper.title}>{paper.title}</h1>
             <div className={`text-xs flex gap-2 ${textMuted} truncate`}>
               <span>{paper.year}</span>
               {paper.folder && (
                 <>
                   <span>•</span>
                   <span>{paper.folder}</span>
                 </>
               )}
             </div>
          </div>
        </div>
        <div className="flex gap-3 items-center flex-shrink-0">
          {isPreview && onSave && (
             <button 
             onClick={onSave}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
             <span className="hidden sm:inline">Save</span>
           </button>
          )}
          
          {!isPreview && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors group relative"
              title="Delete Paper"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${bgMain} ${isDark ? 'dark' : ''}`}>
        <div className="max-w-4xl mx-auto p-4 md:p-10">
          <div className={`shadow-sm border rounded-xl p-6 md:p-12 ${bgCard} text-lg`}>
            
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mb-8 border-b pb-6 border-dashed border-gray-200 dark:border-gray-700">
              {paper.keywords.map((k, i) => (
                <span key={i} className={`px-3 py-1 text-sm rounded-full font-medium ${isDark ? 'bg-blue-900/30 text-blue-300' : isEyeCare ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                  {k}
                </span>
              ))}
            </div>

            {/* Markdown Content */}
            <div className={`markdown-body ${textMain}`}>
               <RenderMarkdown text={paper.raw_analysis} themeStyles={themeStyles} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};