
import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../../../services/authServices/authServices'; // Ajusta la ruta
import { LogOut, UserCircle } from 'lucide-react';
 // Ajusta la ruta


interface HeaderProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">MiApp</h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <span className="text-gray-700 hidden sm:block">
              Hola, {userProfile?.user.first_name || 'Usuario'}
            </span>
            {userProfile?.foto ? (
              <img src={userProfile.foto} alt="Perfil" className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                {userProfile ? getInitials(userProfile.user.first_name, userProfile.user.last_name) : <UserCircle />}
              </div>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-2 border-b">
                <p className="text-sm text-gray-700 font-semibold">{userProfile?.user.first_name} {userProfile?.user.last_name}</p>
                <p className="text-xs text-gray-500">{userProfile?.user.email}</p>
              </div>
              <a
                href="#profile"
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); /* Lógica para ir al perfil */ }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="mr-3" /> Ver Perfil
              </a>
              <button
                onClick={onLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3" /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};