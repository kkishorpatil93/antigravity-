import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-agri-100 text-agri-800 flex items-center justify-center mb-4 shadow-sm">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-agri-950 mb-2">404</h1>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        The agricultural advisory page you are looking for does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button size="md">Return to Dashboard</Button>
      </Link>
    </div>
  );
};

