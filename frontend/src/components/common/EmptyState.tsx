import React from 'react';
import { Sprout } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-cream-50/60 rounded-xl border border-dashed border-gray-300 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center mb-4">
        {icon || <Sprout className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-agri-950 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

