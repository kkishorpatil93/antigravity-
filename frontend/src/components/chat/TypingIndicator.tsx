import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 rounded-2xl rounded-bl-none text-gray-500 w-fit">
      <span className="w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-agri-600 animate-bounce" />
    </div>
  );
};

