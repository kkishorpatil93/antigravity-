import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header
        showSidebarToggle
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-full overflow-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};

