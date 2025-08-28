
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RedesSociales {
  github: string;
  linkedin: string;
  sitio_web: string;
  twitter: string;
}

export interface BasicInfo {
  biografia: string;
  documento: string;
  email: string;
  first_name: string;
  foto: string;
  id_usuario: number;
  last_name: string;
  redes_sociales: RedesSociales;
  telefono: string;
  username: string;
}

export interface Educacion {
  campo_estudio: string;
  completado: boolean;
  fecha_fin: string;
  fecha_inicio: string;
  id: number;
  institucion: string;
  titulo: string;
  usuario_id: number;
}

export interface Habilidad {
  id: number;
  nombre: string;
}

export interface ExperienciaLaboral {
  actualmente: boolean;
  empresa: string;
  fecha_fin: string | null;
  fecha_inicio: string;
  funciones: string;
  habilidades: Habilidad[];
  id: number;
  posicion: string;
}

export interface HabilidadDetallada {
  empresa_adquisicion: string;
  esta_verificado: boolean;
  habilidad__nombre: string;
  habilidad_id: number;
  id: number;
  tiempo_experiencia: number;
}

export interface Portafolio {
  archivo: string;
  descripcion: string;
  fecha: string;
  id: number;
  imagen: string;
  tipo: string;
  titulo: string;
  url: string | null;
  usuario_id: number;
}

export interface UserProfileData {
  basic_info: BasicInfo;
  educacion: Educacion[];
  esta_verificado: boolean;
  experiencia_laboral: ExperienciaLaboral[];
  habilidades: HabilidadDetallada[];
  portafolio: Portafolio[];
  tipo_usuario: string;
}

export interface UserProfileResponse {
  data: UserProfileData;
  message: string;
  status: string;
}

// Interface para la respuesta legacy (mantener compatibilidad)
export interface UserProfile {
  id: number;
  username: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  telefono: string;
  tipo_usuario: string;
  tipo_naturaleza: string;
  biografia: string;
  documento: string;
  linkedin: string;
  twitter: string;
  github: string;
  sitio_web: string;
  esta_verificado: boolean;
  foto?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface UpdateProfileDto {
  user: {
    first_name: string;
    last_name: string;
  };
  telefono: string;
  tipo_usuario: string;
  tipo_naturaleza: string; 
  biografia: string;
  documento: string;
  linkedin: string;
  twitter: string;
  github: string;
  sitio_web: string;
  esta_verificado: string; 
}