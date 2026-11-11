import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-xl border border-red-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-950 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-red-700 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};

