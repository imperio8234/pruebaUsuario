import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../context/userContext';


interface LoginFormData {
  username: string;
  password: string;
}

interface LoginComponentProps {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onLoginSuccess?: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  onForgotPassword = () => console.log('Forgot password clicked'),
  onSignUp = () => console.log('Sign up clicked'),
  onLoginSuccess = () => console.log('Login successful')
}) => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<Partial<LoginFormData>>({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && !loginSuccess) {
      setLoginSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 2500);
    }
  }, [isAuthenticated, loginSuccess, onLoginSuccess]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    clearError();
    
    try {
      await login(formData);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (localErrors[field]) {
      setLocalErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    if (error) {
      clearError();
    }
  };

  // Pantalla de éxito
 /* if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center space-y-8">
            {/* Success Animation 
            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-200 relative">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
                {/* Ripple effect 
                <div className="absolute inset-0 rounded-full border-4 border-emerald-300 animate-ping opacity-30"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-light text-gray-900">Perfecto</h2>
              <p className="text-gray-500 text-lg">Accediendo a tu cuenta...</p>
            </div>

            {/* Loading dots 
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }*/

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="space-y-8 text-center max-w-md">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-light">Bienvenido</h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Accede a tu cuenta y gestiona tu perfil de manera sencilla y segura.
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="text-center lg:hidden">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-light text-gray-900">Iniciar Sesión</h1>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-left">
            <h1 className="text-3xl font-light text-gray-900 mb-2">Iniciar Sesión</h1>
            <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  focusedField === 'username' || formData.username 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`}
              >
                Usuario
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-0 py-3 bg-transparent border-0 border-b-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors duration-200 ${
                    localErrors.username 
                      ? 'border-red-300 focus:border-red-500' 
                      : focusedField === 'username' || formData.username
                      ? 'border-gray-900 focus:border-gray-900'
                      : 'border-gray-200 focus:border-gray-900'
                  }`}
                  placeholder="nombre_usuario"
                />
                <div className={`absolute right-0 top-3 transition-opacity duration-200 ${
                  focusedField === 'username' ? 'opacity-100' : 'opacity-0'
                }`}>
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {localErrors.username && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {localErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  focusedField === 'password' || formData.password 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-0 py-3 pr-12 bg-transparent border-0 border-b-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors duration-200 ${
                    localErrors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : focusedField === 'password' || formData.password
                      ? 'border-gray-900 focus:border-gray-900'
                      : 'border-gray-200 focus:border-gray-900'
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute right-0 top-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className={`transition-opacity duration-200 ${
                    focusedField === 'password' ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              {localErrors.password && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {localErrors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-4 px-6 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-500">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onSignUp}
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;