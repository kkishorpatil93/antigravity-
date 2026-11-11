import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const { language } = useLanguage();

  const placeholderText =
    language === 'kn'
      ? 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ಟೊಮೆಟೊ ಎಲೆ ಹಳದಿಯಾಗಲು ಕಾರಣವೇನು?)...'
      : 'Ask any farming question (e.g. Why are my tomato leaves turning yellow?)...';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholderText}
        disabled={isLoading}
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-12 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-agri-500 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="absolute right-2 p-2 rounded-lg bg-agri-700 hover:bg-agri-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Send Question"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
};

