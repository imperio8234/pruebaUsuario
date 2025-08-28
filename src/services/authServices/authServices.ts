import { backApi } from "../baseApi";
import type { LoginCredentials, LoginResponse, UpdateProfileDto, UserProfile, UserProfileData, UserProfileResponse } from "./typeUser";

export const usuarioService = {
  /**
   * Login de usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const res = await backApi.post('/login/', credentials);
      const { access, refresh } = res.data.data;
      
      // Guardar tokens en sessionStorage (corregido: usar los nombres correctos)
      if (access) {
        sessionStorage.setItem('access_token', access);
      }
      if (refresh) {
        sessionStorage.setItem('refresh_token', refresh);
      }
      
      return res.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Error al iniciar sesión");
    }
  },

  /**
   * Obtener perfil del usuario autenticado (nueva estructura)
   */
  async getPerfil(): Promise<UserProfileResponse> {
    console.log("opteniendo perfil de usuario")
    try {
      const res = await backApi.get('/perfil');
      console.log("data", res.data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Error al obtener perfil");
    }
  },

  /**
   * Obtener perfil del usuario autenticado (formato legacy)
   * @deprecated Usar getPerfil() para la nueva estructura
   */
  async getPerfilLegacy(): Promise<UserProfile> {
    try {
      const res = await backApi.get('/perfil');
      console.log("data", res.data);
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
      const res = await backApi.put('/usuario/perfil/', data);
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
      
      const res = await backApi.patch('/perfil/foto/', formData, {
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
   * Métodos de utilidad para transformar datos
   */
  utils: {
    /**
     * Transformar UserProfileData a formato legacy para compatibilidad
     */
    transformToLegacyFormat(profileData: UserProfileData): UserProfile {
      const { basic_info } = profileData;
      return {
        id: basic_info.id_usuario,
        username: basic_info.username,
        user: {
          first_name: basic_info.first_name,
          last_name: basic_info.last_name,
          email: basic_info.email,
        },
        telefono: basic_info.telefono,
        tipo_usuario: profileData.tipo_usuario,
        tipo_naturaleza: "", // No disponible en nueva estructura
        biografia: basic_info.biografia,
        documento: basic_info.documento,
        linkedin: basic_info.redes_sociales.linkedin,
        twitter: basic_info.redes_sociales.twitter,
        github: basic_info.redes_sociales.github,
        sitio_web: basic_info.redes_sociales.sitio_web,
        esta_verificado: profileData.esta_verificado,
        foto: basic_info.foto,
        fecha_creacion: "", // No disponible en nueva estructura
        fecha_actualizacion: "", // No disponible en nueva estructura
      };
    },

    /**
     * Transformar formato legacy a UpdateProfileDto
     */
    transformToUpdateDto(profileData: UserProfileData): UpdateProfileDto {
      const { basic_info } = profileData;
      return {
        user: {
          first_name: basic_info.first_name,
          last_name: basic_info.last_name,
        },
        telefono: basic_info.telefono,
        tipo_usuario: profileData.tipo_usuario,
        tipo_naturaleza: "", // No disponible en nueva estructura
        biografia: basic_info.biografia,
        documento: basic_info.documento,
        linkedin: basic_info.redes_sociales.linkedin,
        twitter: basic_info.redes_sociales.twitter,
        github: basic_info.redes_sociales.github,
        sitio_web: basic_info.redes_sociales.sitio_web,
        esta_verificado: profileData.esta_verificado ? "true" : "false",
      };
    }
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
      
      if (!data.user?.first_name?.trim()) {
        errors.push("El nombre es requerido");
      }
      
      if (!data.user?.last_name?.trim()) {
        errors.push("El apellido es requerido");
      }
      
      if (!data.telefono?.trim()) {
        errors.push("El teléfono es requerido");
      }
      
      if (!data.documento?.trim()) {
        errors.push("El documento es requerido");
      }

      // Validar email si está presente
      if (data.user && 'email' in data.user && data.user.email && !this.isValidEmail(data.user.email as any)) {
        errors.push("El email no tiene un formato válido");
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
    },

    /**
     * Validar teléfono (formato básico)
     */
    validatePhone(phone: string): boolean {
      // Validación básica: solo números, espacios, guiones y paréntesis
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
    },

    /**
     * Validar documento (formato básico)
     */
    validateDocument(document: string): boolean {
      // Validación básica: solo números y letras
      const docRegex = /^[A-Za-z0-9]+$/;
      return docRegex.test(document) && document.length >= 5;
    }
  }
};