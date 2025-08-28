// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Header } from './components/header';
import { ProfileView } from './components/ProfileView';
import { ProfileForm } from './components/profileForm';
import { useAuth } from '../../context/userContext';
import { Loading } from '../common/perfilLoading';

export const HomePage: React.FC = () => {
  const { user, isLoading, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);


  // Manejador para limpiar errores
  const handleClearError = () => {
    clearError();
  };

  // Renderizado condicional basado en el estado
  const renderContent = () => {
    if (isLoading) {
      return (
        <Loading />
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar el perfil</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleClearError}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center p-10">
          <p className="text-gray-600">No se pudo cargar la información del usuario.</p>
        </div>
      );
    }

    return isEditing ? (
      <ProfileForm
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    ) : (
      <ProfileView onEdit={() => setIsEditing(true)} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header 
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};