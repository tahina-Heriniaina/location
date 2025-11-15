import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  UserPlus,
  BarChart3,
  User,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  subItems?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Voitures', href: '/voitures', icon: Car },
  { name: 'Chauffeurs', href: '/chauffeurs', icon: User },
  { 
    name: 'Réservations', 
    icon: Calendar,
    subItems: [
      { name: 'Liste des réservations', href: '/ListeReservations' },
      { name: 'Gérer les réservations', href: '/reservations' },
    ],
  },
  { name: 'Bénéfices', href: '/benefices', icon: BarChart3 },
  { name: 'Administrateurs', href: '/admins', icon: UserPlus },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
         className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 transform transition-all duration-300 ease-in-out z-50 shadow-lg flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/images/rapide.png"
              alt="Rapide Icon"
              className="h-11 w-11 object-contain"
            />
            <img
              src="/assets/images/logo.png"
              alt="RentAdmin Logo"
              className="h-12 object-contain"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 flex-1 overflow-y-auto">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              // Si l'item a des sous-items
              if (item.subItems) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white`}
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                      {item.name}
                    </button>
                    {openSubmenu === item.name && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = location.pathname === sub.href;
                          return (
                            <NavLink
                              key={sub.name}
                              to={sub.href}
                              onClick={() => setIsOpen(false)}
                              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                isSubActive
                                  ? 'bg-green-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              {sub.name}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Item normal sans sous-items
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href!}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">AD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">En ligne</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
