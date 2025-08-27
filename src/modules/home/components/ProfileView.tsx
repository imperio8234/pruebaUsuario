// src/components/ProfileView.tsx
import React from 'react';
import { useAuth } from '../../../context/userContext'; // Ajusta la ruta según tu estructura
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaCheckCircle, FaEdit, FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendar } from 'react-icons/fa';

interface ProfileViewProps {
  onEdit: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onEdit }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No hay información de usuario disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      url: user.linkedin, 
      icon: FaLinkedin, 
      color: 'hover:text-blue-600 hover:bg-blue-50',
      bgColor: 'bg-blue-500'
    },
    { 
      name: 'Twitter', 
      url: user.twitter, 
      icon: FaTwitter, 
      color: 'hover:text-blue-400 hover:bg-blue-50',
      bgColor: 'bg-blue-400'
    },
    { 
      name: 'GitHub', 
      url: user.github, 
      icon: FaGithub, 
      color: 'hover:text-gray-800 hover:bg-gray-50',
      bgColor: 'bg-gray-800'
    },
    { 
      name: 'Sitio Web', 
      url: user.sitio_web, 
      icon: FaGlobe, 
      color: 'hover:text-green-600 hover:bg-green-50',
      bgColor: 'bg-green-500'
    }
  ].filter(link => link.url);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificado';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-48 flex items-end">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                <FaEdit className="mr-2" />
                Editar Perfil
              </button>
            </div>
            
            {/* Profile Image */}
            <div className="relative z-10 ml-8 mb-6">
              <div className="relative">
                <img 
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-xl"
                  src={user.foto || 'https://via.placeholder.com/150'} 
                  alt="Foto de perfil" 
                />
                {user.esta_verificado && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 ring-4 ring-white">
                    <FaCheckCircle className="text-white w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.user.first_name} {user.user.last_name}
                  </h1>
                  {user.esta_verificado && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FaCheckCircle className="mr-1 w-3 h-3" />
                      Verificado
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-gray-500 mb-4">@{user.username}</p>
                
                {user.biografia && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-700 leading-relaxed">{user.biografia}</p>
                  </div>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-4 py-2 rounded-xl text-gray-600 border border-gray-200 transition-all duration-200 ${social.color} hover:scale-105 hover:shadow-md`}
                          title={social.name}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {social.name}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FaEnvelope className="w-4 h-4 text-blue-600" />
              </div>
              Información de Contacto
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{user.user.email}</p>
                </div>
              </div>

              {user.telefono && (
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-gray-900 font-medium">{user.telefono}</p>
                  </div>
                </div>
              )}

              {user.documento && (
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaIdCard className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Documento</p>
                    <p className="text-gray-900 font-medium">{user.documento}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FaUser className="w-4 h-4 text-purple-600" />
              </div>
              Detalles de la Cuenta
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaUser className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Usuario</p>
                  <p className="text-gray-900 font-medium capitalize">{user.tipo_usuario || 'No especificado'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaIdCard className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Naturaleza</p>
                  <p className="text-gray-900 font-medium capitalize">{user.tipo_naturaleza || 'No especificado'}</p>
                </div>
              </div>
                {/*@ts-ignore */}
              {user.user.date_joined && (
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCalendar className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Miembro desde</p>
                    {/*@ts-ignore */}
                    <p className="text-gray-900 font-medium">{formatDate(user.user.date_joined)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  user.esta_verificado ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <FaCheckCircle className={`w-4 h-4 ${
                    user.esta_verificado ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado de Verificación</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 font-medium">
                      {user.esta_verificado ? 'Cuenta Verificada' : 'Sin Verificar'}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.esta_verificado 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.esta_verificado ? 'Activo' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Activity Card */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Resumen del Perfil
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {socialLinks.length}
              </div>
              <p className="text-blue-700 text-sm font-medium">Redes Sociales</p>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {user.esta_verificado ? '100%' : '80%'}
              </div>
              <p className="text-green-700 text-sm font-medium">Perfil Completado</p>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {user.esta_verificado ? 'PRO' : 'BÁSICO'}
              </div>
              <p className="text-purple-700 text-sm font-medium">Estado de Cuenta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};