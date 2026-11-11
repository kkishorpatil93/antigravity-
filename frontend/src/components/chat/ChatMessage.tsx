import React from 'react';
import { Sprout, User, AlertTriangle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  followUpQuestions?: string[];
  warnings?: string[];
  onSelectFollowUp?: (q: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  followUpQuestions,
  warnings,
  onSelectFollowUp,
}) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-agri-700 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Sprout className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
          isAssistant
            ? 'bg-white text-gray-800 rounded-tl-none border border-earth-100 shadow-2xs'
            : 'bg-agri-700 text-white rounded-tr-none shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {warnings && warnings.length > 0 && (
          <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              {warnings.map((w, idx) => (
                <p key={idx}>{w}</p>
              ))}
            </div>
          </div>
        )}

        {followUpQuestions && followUpQuestions.length > 0 && onSelectFollowUp && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-500 mb-2">Suggested Follow-ups:</p>
            <div className="flex flex-wrap gap-1.5">
              {followUpQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowUp(q)}
                  className="text-left text-xs bg-agri-50 hover:bg-agri-100 text-agri-900 border border-agri-200 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <span
          className={`block text-[10px] mt-1.5 ${
            isAssistant ? 'text-gray-400' : 'text-agri-200 text-right'
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-2xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

