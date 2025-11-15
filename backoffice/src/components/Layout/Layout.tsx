import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Content */}
      <div className="flex flex-col flex-1  min-h-screen">
        {/* Header fixe en haut */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Zone blanche bien établie */} 
        <main className="flex-1 p-6 bg-white dark:bg-gray-800 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div> 

          
        </main>
      </div>
    </div>
  );
};

