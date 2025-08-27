// src/components/ProfileForm.tsx
import React, { useState, useRef, type ChangeEvent } from 'react';
import { useAuth } from '../../../context/userContext';
import type { UpdateProfileDto } from '../../../services/authServices/authServices';
import { showNotification } from '../../hooks/useNotify';

interface ProfileFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onCancel, onSuccess }) => {
  const { user, updateProfile, updateProfilePhoto, isLoading, error, clearError } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No hay información de usuario disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState<UpdateProfileDto>({
    user: {
      first_name: user.user.first_name,
      last_name: user.user.last_name,
    },
    telefono: user.telefono,
    biografia: user.biografia,
    documento: user.documento,
    linkedin: user.linkedin,
    twitter: user.twitter,
    github: user.github,
    sitio_web: user.sitio_web,
    tipo_usuario: user.tipo_usuario,
    tipo_naturaleza: user.tipo_naturaleza,
    esta_verificado: String(user.esta_verificado)
  });

  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (error) {
      clearError();
    }
    
    if (name === 'first_name' || name === 'last_name') {
      setFormData(prev => ({ ...prev, user: { ...prev.user, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (file: File) => {
    if (file) {
      setNewPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      if (error) {
        clearError();
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      
      if (newPhoto) {
        await updateProfilePhoto(newPhoto);
      }
      showNotification("success", "perfil actualizado")
      onSuccess?.();
      setNewPhoto(null);
      setPreviewUrl(null);
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Editar Perfil</h1>
                <p className="text-blue-100">Actualiza tu información personal</p>
              </div>
              <div className="hidden sm:block">
                <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-8 relative">
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800 mb-1">Error al actualizar</h3>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Upload Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Foto de Perfil
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                    <img
                      src={previewUrl || user.foto || 'https://via.placeholder.com/150'}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {(isLoading || isSubmitting) && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    className="hidden"
                    disabled={isLoading || isSubmitting}
                  />
                  
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Arrastra una imagen aquí
                    </p>
                    <p className="text-gray-500 mb-4">o</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading || isSubmitting}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {isLoading ? 'Cargando...' : 'Seleccionar Archivo'}
                    </button>
                    <p className="text-xs text-gray-500 mt-3">PNG, JPG, GIF hasta 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información Personal
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="first_name" 
                        id="first_name" 
                        value={formData.user.first_name} 
                        onChange={handleChange} 
                        disabled={isLoading || isSubmitting}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                        placeholder="Ingresa tu nombre"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input 
                      type="text" 
                      name="last_name" 
                      id="last_name" 
                      value={formData.user.last_name} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input 
                      type="tel" 
                      name="telefono" 
                      id="telefono" 
                      value={formData.telefono} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="+57 123 456 7890"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="documento" className="block text-sm font-semibold text-gray-700 mb-2">
                      Documento
                    </label>
                    <input 
                      type="text" 
                      name="documento" 
                      id="documento" 
                      value={formData.documento} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="Número de documento"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="biografia" className="block text-sm font-semibold text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea 
                    name="biografia" 
                    id="biografia" 
                    value={formData.biografia} 
                    onChange={handleChange} 
                    rows={4} 
                    disabled={isLoading || isSubmitting}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800 resize-none"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9l-3-3m0 0l-3 3" />
                  </svg>
                  Redes Sociales
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="linkedin" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                      LinkedIn
                    </label>
                    <input 
                      type="url" 
                      name="linkedin" 
                      id="linkedin" 
                      value={formData.linkedin} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="https://linkedin.com/in/usuario"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="github" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </label>
                    <input 
                      type="url" 
                      name="github" 
                      id="github" 
                      value={formData.github} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="https://github.com/usuario"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="twitter" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      Twitter
                    </label>
                    <input 
                      type="url" 
                      name="twitter" 
                      id="twitter" 
                      value={formData.twitter} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="https://twitter.com/usuario"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sitio_web" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9l-3-3m0 0l-3 3" />
                      </svg>
                      Sitio Web
                    </label>
                    <input 
                      type="url" 
                      name="sitio_web" 
                      id="sitio_web" 
                      value={formData.sitio_web} 
                      onChange={handleChange} 
                      disabled={isLoading || isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-800"
                      placeholder="https://misitio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full sm:w-auto px-8 py-3 border-2 border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Cambios
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};