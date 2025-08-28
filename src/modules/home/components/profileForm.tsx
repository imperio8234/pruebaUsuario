import React, { useState, useRef, type ChangeEvent } from 'react';
import type { UpdateProfileDto } from '../../../services/authServices/typeUser';
import { showNotification } from '../../hooks/useNotify';
import {
  User,
  Camera,
  Upload,
  X,
  Save,
  Phone,
  CreditCard,
  Type,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaGlobe
} from 'react-icons/fa';
import { useAuth } from '../../../context/userContext';

// --- (Componentes FormSectionCard y FormInput sin cambios) ---
const FormSectionCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    <div className="p-4 md:p-5 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <Icon className="w-5 h-5 mr-3 text-indigo-500" />
        {title}
      </h2>
    </div>
    <div className="p-4 md:p-5">
      {children}
    </div>
  </div>
);

const FormInput: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; icon: React.ElementType; disabled?: boolean; }> = ({ id, name, label, value, onChange, type = 'text', placeholder, icon: Icon, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:bg-gray-100"
        placeholder={placeholder}
      />
    </div>
  </div>
);
// --- (Fin de componentes sin cambios) ---

export const ProfileForm: React.FC<{ onCancel: () => void; onSuccess?: () => void; }> = ({ onCancel, onSuccess }) => {
  const { user, updateProfile, updateProfilePhoto, isLoading, error, clearError } = useAuth();

  if (!user) {
    return <div className="p-8 text-center text-gray-600">No hay información de usuario disponible.</div>;
  }

  const [formData, setFormData] = useState<UpdateProfileDto>({
    user: {
      first_name: user.basic_info.first_name,
      last_name: user.basic_info.last_name,
    },
    telefono: user.basic_info.telefono || '',
    biografia: user.basic_info.biografia || '',
    documento: user.basic_info.documento || '',
    linkedin: user.basic_info.redes_sociales.linkedin || '',
    twitter: user.basic_info.redes_sociales.twitter || '',
    github: user.basic_info.redes_sociales.github || '',
    sitio_web: user.basic_info.redes_sociales.sitio_web || '',
    tipo_usuario: user.tipo_usuario || 'freelancer',
    esta_verificado: "true",
    tipo_naturaleza: "natural"
  });

  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false); // <-- NUEVO: Estado de carga solo para la foto
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (error) clearError();

    if (name === 'first_name' || name === 'last_name') {
      setFormData(prev => ({ ...prev, user: { ...prev.user, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // <-- MODIFICADO: Lógica de validación de archivo
  const handleFileChange = (file: File) => {
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showNotification("error", "Formato no válido. Solo se permiten archivos JPG y PNG.");
        return;
      }

      setNewPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (error) clearError();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  const removePhoto = () => {
    setNewPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // <-- MODIFICADO: handleSubmit ahora solo guarda los datos del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      showNotification("success", "Perfil actualizado exitosamente");
      // Si la foto se guardó antes y se quedó la preview, la limpiamos.
      if (previewUrl) {
        removePhoto();
      }
      onSuccess?.();
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      showNotification("error", "No se pudo actualizar el perfil. Revisa los campos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // <-- NUEVO: Función para manejar solo la subida de la foto
  const handlePhotoSubmit = async () => {
    if (!newPhoto) return;

    setIsUploadingPhoto(true);
    try {
      await updateProfilePhoto(newPhoto);
      showNotification("success", "Foto de perfil actualizada.");
      setNewPhoto(null);
      setPreviewUrl(null);
      // La foto actualizada se mostrará desde el `user context` después de que se recargue.
    } catch (err) {
      console.error('Error al actualizar la foto:', err);
      showNotification("error", "No se pudo actualizar la foto.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const isFormLoading = isLoading || isSubmitting;
  const isAnyActionLoading = isFormLoading || isUploadingPhoto; // <-- NUEVO: Estado de carga general

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="text-gray-600 mt-1">Actualiza tu información personal y profesional.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Error al actualizar</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
            {/* --- Columna Izquierda --- */}
            <aside className="lg:col-span-4 space-y-6">
              <FormSectionCard title="Foto de Perfil" icon={Camera}>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {previewUrl || user.basic_info.foto ? (
                      <img
                        title={`la ruta para optener la imagen la cual no acepta peticiones http://46.202.88.87:8010${user.basic_info.foto} `}
                        src={previewUrl || `${import.meta.env.VITE_API_DOCS}${user.basic_info.foto}`} alt="Vista previa" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-md">
                        {getInitials(user.basic_info.first_name, user.basic_info.last_name)}
                      </div>
                    )}
                    {(isFormLoading || isUploadingPhoto) && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                    {previewUrl && <button type="button" onClick={removePhoto} className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"><X className="w-4 h-4" /></button>}
                  </div>

                  {/* <-- MODIFICADO: Se añade el botón para guardar solo la foto --> */}
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={handlePhotoSubmit}
                      disabled={isUploadingPhoto || isFormLoading}
                      className="w-full px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-400 transition-colors flex items-center justify-center"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Guardando foto...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Foto
                        </>
                      )}
                    </button>
                  )}

                  {/* <-- MODIFICADO: Se restringen los tipos de archivo --> */}
                  <input type="file" accept="image/jpeg, image/png" ref={fileInputRef} onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} className="hidden" disabled={isAnyActionLoading} />

                  <div
                    className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${isAnyActionLoading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'} ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => !isAnyActionLoading && fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Arrastra o haz clic</p>
                    <p className="text-xs text-gray-500">JPG o PNG (máx 5MB)</p>
                  </div>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Información Principal" icon={User}>
                <div className="space-y-4">
                  <FormInput id="first_name" name="first_name" label="Nombre" value={formData.user.first_name} onChange={handleChange} placeholder="Tu nombre" icon={Type} disabled={isAnyActionLoading} />
                  <FormInput id="last_name" name="last_name" label="Apellido" value={formData.user.last_name} onChange={handleChange} placeholder="Tu apellido" icon={Type} disabled={isAnyActionLoading} />
                  <FormInput id="telefono" name="telefono" label="Teléfono" value={formData.telefono} onChange={handleChange} type="tel" placeholder="+57 300 123 4567" icon={Phone} disabled={isAnyActionLoading} />
                  <FormInput id="documento" name="documento" label="Documento" value={formData.documento} onChange={handleChange} placeholder="Número de documento" icon={CreditCard} disabled={isAnyActionLoading} />
                </div>
              </FormSectionCard>
            </aside>

            {/* --- Columna Derecha --- */}
            <main className="lg:col-span-8 space-y-6">
              <FormSectionCard title="Sobre Mí y Cuenta" icon={Briefcase}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                    <textarea name="biografia" id="biografia" value={formData.biografia} onChange={handleChange} rows={5} disabled={isAnyActionLoading} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:bg-gray-100 resize-none" placeholder="Una breve descripción sobre ti, tus habilidades y experiencia..."></textarea>
                  </div>
                  <div>
                    <label htmlFor="tipo_usuario" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                    <select name="tipo_usuario" id="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange} disabled={isAnyActionLoading} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:bg-gray-100">
                      <option value="freelancer">Freelancer</option>
                      <option value="empresa">Empresa</option>
                      <option value="estudiante">Estudiante</option>
                      <option value="profesional">Profesional</option>
                    </select>
                  </div>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Redes Sociales y Sitio Web" icon={FaGlobe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput id="linkedin" name="linkedin" label="LinkedIn" value={formData.linkedin} onChange={handleChange} type="url" placeholder="URL de tu perfil" icon={FaLinkedin} disabled={isAnyActionLoading} />
                  <FormInput id="github" name="github" label="GitHub" value={formData.github} onChange={handleChange} type="url" placeholder="URL de tu perfil" icon={FaGithub} disabled={isAnyActionLoading} />
                  <FormInput id="twitter" name="twitter" label="Twitter" value={formData.twitter} onChange={handleChange} type="url" placeholder="URL de tu perfil" icon={FaTwitter} disabled={isAnyActionLoading} />
                  <FormInput id="sitio_web" name="sitio_web" label="Sitio Web" value={formData.sitio_web} onChange={handleChange} type="url" placeholder="https://tu-sitio.com" icon={FaGlobe} disabled={isAnyActionLoading} />
                </div>
              </FormSectionCard>
            </main>
          </div>

          {/* --- Botones de Acción --- */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button type="button" onClick={onCancel} disabled={isAnyActionLoading} className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isAnyActionLoading} className="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-400 transition-colors flex items-center justify-center">
                {isFormLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};