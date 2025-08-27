import { backApi } from "./baseApi";

// Interfaces
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

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
  esta_verificado: string; // La API espera string, no boolean
}

export const usuarioService = {
  /**
   * Login de usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const res = await backApi.post('/auth/login/', credentials);
      console.log("token", res.data.access_token)
      // Guardar tokens en sessionStorage
      if (res.data.access_token) {
        sessionStorage.setItem('access_token', res.data.access_token);
      }
      if (res.data.refresh_token) {
        sessionStorage.setItem('refresh_token', res.data.refresh_token);
      }
      
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Error al iniciar sesión");
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getPerfil(): Promise<UserProfile> {
    try {
      const res = await backApi.get('/auth/me');
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Error al obtener perfil");
    }
  },

  /**
   * Actualizar perfil del usuario
   */
  async updatePerfil(data: UpdateProfileDto): Promise<UserProfile> {
    try {
      const res = await backApi.put('/usuario/perfil', data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Error al actualizar perfil");
    }
  },

  /**
   * Actualizar foto de perfil
   */
  async updateFoto(file: File): Promise<UserProfile> {
    try {
      const formData = new FormData();
      formData.append('foto', file);
      
      const res = await backApi.patch('/usuario/perfil/foto/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Error al actualizar foto");
    }
  },

  /**
   * Cerrar sesión (limpiar tokens)
   */
  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('access_token');
  },

  /**
   * Obtener el token de acceso
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  },

  /**
   * Obtener el token de refresh
   */
  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  },

  /**
   * Métodos de utilidad para validaciones
   */
  validators: {
    /**
     * Validar email
     */
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Validar campos requeridos para login
     */
    validateLoginFields(data: LoginCredentials): string[] {
      const errors: string[] = [];
      
      if (!data.username?.trim()) {
        errors.push("El nombre de usuario es requerido");
      }
      
      if (!data.password?.trim()) {
        errors.push("La contraseña es requerida");
      }
      
      return errors;
    },

    /**
     * Validar campos requeridos para actualizar perfil
     */
    validateProfileFields(data: UpdateProfileDto): string[] {
      const errors: string[] = [];
      
      if (!data.user.first_name?.trim()) {
        errors.push("El nombre es requerido");
      }
      
      if (!data.user.last_name?.trim()) {
        errors.push("El apellido es requerido");
      }
      
      if (!data.telefono?.trim()) {
        errors.push("El teléfono es requerido");
      }
      
      if (!data.documento?.trim()) {
        errors.push("El documento es requerido");
      }
      
      // Validar URLs si están presentes
      if (data.linkedin && !this.isValidUrl(data.linkedin)) {
        errors.push("La URL de LinkedIn no es válida");
      }
      
      if (data.twitter && !this.isValidUrl(data.twitter)) {
        errors.push("La URL de Twitter no es válida");
      }
      
      if (data.github && !this.isValidUrl(data.github)) {
        errors.push("La URL de GitHub no es válida");
      }
      
      if (data.sitio_web && !this.isValidUrl(data.sitio_web)) {
        errors.push("La URL del sitio web no es válida");
      }
      
      return errors;
    },

    /**
     * Validar URL
     */
    isValidUrl(url: string): boolean {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Validar archivo de imagen
     */
    validateImageFile(file: File): string[] {
      const errors: string[] = [];
      
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        errors.push("El archivo debe ser una imagen");
      }
      
      // Verificar tamaño (ejemplo: máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errors.push("La imagen no debe superar los 5MB");
      }
      
      // Verificar tipos permitidos
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        errors.push("Solo se permiten archivos JPG, PNG o GIF");
      }
      
      return errors;
    }
  }
};