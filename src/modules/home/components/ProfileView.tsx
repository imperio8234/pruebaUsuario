import React from 'react';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Edit3,
  ExternalLink,
  Shield,
  Briefcase,
  GraduationCap,
  Folder,
  CheckCircle
} from 'lucide-react';
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaGlobe
} from 'react-icons/fa';
import { useAuth } from '../../../context/userContext'; // Asegúrate que la ruta sea correcta

// Helper para formatear fechas
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Presente';
  return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
};

// Componente para una sección con título
const SectionCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="p-4 md:p-6 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-indigo-500" />
        {title}
      </h2>
    </div>
    <div className="p-4 md:p-6">
      {children}
    </div>
  </div>
);

// Componente para un item en la línea de tiempo (Experiencia/Educación)
const TimelineItem: React.FC<{ title: string; subtitle: string; dateRange: string; description: string; tags?: string[] }> = ({ title, subtitle, dateRange, description, tags }) => (
  <div className="relative pl-8 pb-8">
    {/* Timeline line and dot */}
    <div className="absolute left-3 top-1 w-px h-full bg-gray-200"></div>
    <div className="absolute left-[7px] top-1 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full"></div>

    <p className="text-xs text-gray-500 mb-1">{dateRange}</p>
    <h3 className="font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>

    {tags && tags.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);


export const ProfileView: React.FC<{ onEdit: () => void }> = ({ onEdit }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No hay información de usuario disponible.</p>
      </div>
    );
  }

  const socialLinks = [
    { name: 'LinkedIn', url: user.basic_info.redes_sociales.linkedin, icon: FaLinkedin, color: 'hover:text-blue-600' },
    { name: 'Twitter', url: user.basic_info.redes_sociales.twitter, icon: FaTwitter, color: 'hover:text-blue-400' },
    { name: 'GitHub', url: user.basic_info.redes_sociales.github, icon: FaGithub, color: 'hover:text-gray-900' },
    { name: 'Sitio Web', url: user.basic_info.redes_sociales.sitio_web, icon: FaGlobe, color: 'hover:text-green-600' }
  ].filter(link => link.url && link.url.trim() !== '');

  const getInitials = (firstName: string, lastName: string) => `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const latestJob = user.experiencia_laboral?.[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">

          {/* --- Columna Izquierda (Sidebar) --- */}
          <aside className="lg:col-span-4 mb-8 lg:mb-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                {/* Avatar y Nombre */}
                <div className="relative inline-block mb-4">
                  {user.basic_info.foto ? (
                    <img
                      title={`la ruta para optener la imagen la cual no acepta peticiones http://46.202.88.87:8010${user.basic_info.foto} `}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                      src={user.basic_info.foto}
                      alt="Foto de perfil"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-4xl">
                      {getInitials(user.basic_info.first_name, user.basic_info.last_name)}
                    </div>
                  )}
                  {user.esta_verificado && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1.5 border-2 border-white" title="Verificado">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900">{user.basic_info.first_name} {user.basic_info.last_name}</h1>
                <p className="text-gray-500 mb-1">@{user.basic_info.username}</p>
                {latestJob && (
                  <p className="font-semibold text-indigo-600">{latestJob.posicion} en {latestJob.empresa}</p>
                )}

                <button
                  onClick={onEdit}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </button>
              </div>

              {/* Información de Contacto */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Contacto y Detalles</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <Mail className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 break-all">{user.basic_info.email}</span>
                  </li>
                  {user.basic_info.telefono && (
                    <li className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{user.basic_info.telefono}</span>
                    </li>
                  )}
                  {user.basic_info.documento && (
                    <li className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">Doc: {user.basic_info.documento}</span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <Shield className={`w-4 h-4 mr-3 flex-shrink-0 ${user.esta_verificado ? 'text-green-500' : 'text-yellow-500'}`} />
                    <span className="text-gray-700">{user.esta_verificado ? 'Cuenta Verificada' : 'Pendiente de Verificación'}</span>
                  </li>
                </ul>

                {socialLinks.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-4">
                    {socialLinks.map(social => (
                      <a
                        key={social.name}
                        href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-400 transition-colors ${social.color}`}
                        title={social.name}
                      >
                        <social.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Habilidades */}
              {user.habilidades && user.habilidades.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.habilidades.map(habilidad => (
                      <div key={habilidad.id} className="group relative">
                        <span className="inline-block px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-full cursor-pointer">
                          {habilidad.habilidad__nombre}
                        </span>
                        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          {habilidad.tiempo_experiencia} meses de experiencia. Adquirida en {habilidad.empresa_adquisicion}.
                          {habilidad.esta_verificado && <span className="block mt-1 text-green-400 font-bold">Verificada</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* --- Columna Derecha (Contenido) --- */}
          <main className="lg:col-span-8">
            <div className="space-y-8">
              {/* Sobre mí */}
              {user.basic_info.biografia && (
                <SectionCard title="Sobre mí" icon={User}>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{user.basic_info.biografia}</p>
                </SectionCard>
              )}

              {/* Experiencia Laboral */}
              {user.experiencia_laboral && user.experiencia_laboral.length > 0 && (
                <SectionCard title="Experiencia Laboral" icon={Briefcase}>
                  <div className="relative">
                    {user.experiencia_laboral.map(exp => (
                      <TimelineItem
                        key={exp.id}
                        title={exp.posicion}
                        subtitle={exp.empresa}
                        dateRange={`${formatDate(exp.fecha_inicio)} - ${exp.actualmente ? 'Actual' : formatDate(exp.fecha_fin)}`}
                        description={exp.funciones}
                        tags={exp.habilidades.map(h => h.nombre)}
                      />
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Educación */}
              {user.educacion && user.educacion.length > 0 && (
                <SectionCard title="Educación" icon={GraduationCap}>
                  <div className="relative">
                    {user.educacion.map(edu => (
                      <TimelineItem
                        key={edu.id}
                        title={edu.titulo}
                        subtitle={`${edu.institucion} - ${edu.campo_estudio}`}
                        dateRange={`${formatDate(edu.fecha_inicio)} - ${edu.completado ? formatDate(edu.fecha_fin) : 'En curso'}`}
                        description={edu.completado ? 'Completado' : 'Estudios en curso.'}
                      />
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Portafolio */}
              {user.portafolio && user.portafolio.length > 0 && (
                <SectionCard title="Portafolio" icon={Folder}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.portafolio.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group">
                        {item.imagen && (
                          <img src={item.imagen} alt={item.titulo} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800">{item.titulo}</h4>
                          <p className="text-sm text-gray-600 mt-1 mb-3 h-16 overflow-hidden">{item.descripcion}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{formatDate(item.fecha)}</span>
                            {(item.url || item.archivo) && (
                              <a
                                href={item.url || item.archivo!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-indigo-600 font-semibold hover:underline"
                              >
                                Ver más <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};