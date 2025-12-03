import React, { useRef, useState } from 'react';
import { analyzePdf } from '../services/geminiService';
import { AnalysisResult, Theme, Language } from '../types';

interface UploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  theme: Theme;
  language: Language;
}

export const Upload: React.FC<UploadProps> = ({ onAnalysisComplete, theme, language }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const result = await analyzePdf(base64, file.type, language);
          onAnalysisComplete(result);
        } catch (e) {
          setError('Failed to analyze PDF. Please check your API key or try again.');
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isDark = theme === 'dark';
  const isEyeCare = theme === 'eye-care';

  const containerClass = isDark ? 'bg-slate-800' : isEyeCare ? 'bg-[#F5F1E6]' : 'bg-gray-50';
  const textTitle = isDark ? 'text-white' : isEyeCare ? 'text-stone-800' : 'text-gray-800';
  const textSub = isDark ? 'text-slate-400' : isEyeCare ? 'text-stone-500' : 'text-gray-500';
  
  const dropZoneBase = `relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200`;
  const dropZoneClass = isDragging 
    ? 'border-blue-500 bg-blue-50/10' 
    : isDark 
      ? 'border-slate-600 bg-slate-700 hover:border-blue-400' 
      : isEyeCare 
        ? 'border-[#D6D2C4] bg-[#E8E4D9] hover:border-amber-400'
        : 'border-gray-300 bg-white hover:border-blue-400';

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 ${containerClass} transition-colors duration-300`}>
      <div className="max-w-xl w-full">
        <h2 className={`text-3xl font-bold text-center mb-2 ${textTitle}`}>Analyze Paper</h2>
        <p className={`text-center mb-8 ${textSub}`}>
          Upload a PDF to get a structured deep-dive analysis powered by Gemini.<br/>
          <span className="text-xs opacity-75">Current Language: {language === 'en' ? 'English' : '简体中文'}</span>
        </p>

        <div
          className={`${dropZoneBase} ${dropZoneClass} ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="application/pdf"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="font-semibold text-blue-500">Reading & Analyzing...</p>
              <p className={`text-sm mt-2 ${textSub}`}>Extracting structure, charts, and key insights.</p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-600 text-blue-400' : isEyeCare ? 'bg-[#D6D2C4] text-amber-800' : 'bg-blue-100 text-blue-600'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p className={`font-medium ${textTitle}`}>Click to upload or drag and drop</p>
              <p className={`text-sm mt-2 ${textSub}`}>PDF (max 10MB)</p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
