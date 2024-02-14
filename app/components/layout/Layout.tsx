// components/Layout.tsx

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between">
    <header className="bg-blue-500 text-white p-4 text-lg font-semibold">
      Chat Application
    </header>
    <main className="flex flex-1 justify-center items-center bg-gray-100 p-4">
      {children}
    </main>
    <footer className="bg-gray-200 text-center p-4 text-sm">
      © 2024 Chat Application
    </footer>
  </div>
);

export default Layout;
