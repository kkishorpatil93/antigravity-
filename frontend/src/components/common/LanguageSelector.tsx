import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SupportedLanguage } from '../../types';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center bg-agri-50 border border-agri-200 rounded-lg p-0.5 text-xs font-medium text-agri-900 shadow-sm">
        <Languages className="w-3.5 h-3.5 ml-1.5 text-agri-700 mr-1" />
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 rounded-md transition-all ${
            language === 'en'
              ? 'bg-agri-700 text-white shadow-xs font-semibold'
              : 'text-gray-600 hover:text-agri-900'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage('kn')}
          className={`px-2 py-1 rounded-md transition-all ${
            language === 'kn'
              ? 'bg-agri-700 text-white shadow-xs font-semibold'
              : 'text-gray-600 hover:text-agri-900'
          }`}
        >
          ಕನ್ನಡ
        </button>
      </div>
    </div>
  );
};

