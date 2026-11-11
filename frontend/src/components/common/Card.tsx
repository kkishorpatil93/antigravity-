import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer,
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-earth-100/80 shadow-sm overflow-hidden transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-agri-200' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-agri-950">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 text-xs text-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
};

