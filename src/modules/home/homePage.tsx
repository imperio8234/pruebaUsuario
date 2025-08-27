// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { usuarioService, type UserProfile } from '../../services/authServices/authServices'; // Ajusta la ruta a tu servicio
import { Header } from './components/header';
import { ProfileView } from './components/ProfileView';
import { ProfileForm } from './components/profileForm';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Efecto para cargar el perfil del usuario al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userProfile = await usuarioService.getPerfil();
        setProfile(userProfile);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar el perfil.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Manejador para cerrar sesión
  const handleLogout = () => {
    usuarioService.logout();
    // Redirigir al login, por ejemplo:
    window.location.href = '/';
  };


  // Renderizado condicional basado en el estado
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10">Cargando perfil...</div>;
    }
    if (error) {
      return <div className="text-center p-10 text-red-500">{error}</div>;
    }
    if (profile) {
      return isEditing ? (
        <ProfileForm
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView onEdit={() => setIsEditing(true)} />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header userProfile={profile} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};