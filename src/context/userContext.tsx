import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { usuarioService, type LoginCredentials, type UserProfile, type UpdateProfileDto } from '../services/authServices/authServices';

// Tipos para el estado
interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Tipos para las acciones
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: UserProfile }
  | { type: 'AUTH_ERROR'; payload: string }          // Solo para errores de autenticación
  | { type: 'OPERATION_ERROR'; payload: string }     // Para errores de operaciones (nuevo)
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// Tipos para el contexto
interface AuthContextType {
  // Estado
  state: AuthState;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  updateProfilePhoto: (file: File) => Promise<void>;
  loadUserProfile: () => Promise<void>;
  clearError: () => void;
  
  // Utilidades
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_ERROR':
      // Solo para errores de autenticación críticos (login, loadUserProfile)
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    
    case 'OPERATION_ERROR':
      // Para errores de operaciones que NO afectan la autenticación
      return {
        ...state,
        // ✅ Mantiene isAuthenticated y user intactos
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (usuarioService.isAuthenticated()) {
          await loadUserProfile();
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Función para hacer login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Validar campos
      const validationErrors = usuarioService.validators.validateLoginFields(credentials);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Hacer login
      await usuarioService.login(credentials);
      
      // Cargar perfil del usuario
      await loadUserProfile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Función para hacer logout
  const logout = (): void => {
    usuarioService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userProfile = await usuarioService.getPerfil();
      dispatch({ type: 'AUTH_SUCCESS', payload: userProfile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar perfil';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage }); // ✅ AUTH_ERROR porque es crítico
      // Si hay error al cargar el perfil, hacer logout automático
      usuarioService.logout();
      throw error;
    }
  };

  // Función para actualizar el perfil
  const updateProfile = async (data: UpdateProfileDto): Promise<void> => {
    console.log("actualizando datos", data);
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validar campos
      const validationErrors = usuarioService.validators.validateProfileFields(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Actualizar perfil
      const updatedUser = await usuarioService.updatePerfil(data);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
      // ✅ Cambio: usar OPERATION_ERROR en lugar de AUTH_ERROR
      dispatch({ type: 'OPERATION_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para actualizar la foto de perfil
  const updateProfilePhoto = async (file: File): Promise<void> => {
    console.log("actualizando foto", file);
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validar archivo
      const validationErrors = usuarioService.validators.validateImageFile(file);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Actualizar foto
      const updatedUser = await usuarioService.updateFoto(file);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar foto';
      // ✅ Cambio: usar OPERATION_ERROR en lugar de AUTH_ERROR
      dispatch({ type: 'OPERATION_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Función para limpiar errores
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Valor del contexto
  const contextValue: AuthContextType = {
    // Estado
    state,
    
    // Acciones
    login,
    logout,
    updateProfile,
    updateProfilePhoto,
    loadUserProfile,
    clearError,
    
    // Utilidades (acceso directo para conveniencia)
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// Hook para verificar si el usuario está autenticado
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    canAccess: isAuthenticated && !isLoading,
  };
};