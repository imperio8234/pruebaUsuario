# App Usuario - Prueba Técnica Aula Matriz

## 📋 Descripción

Aplicación web desarrollada con React, TypeScript y Vite para la gestión de perfiles de usuario. La aplicación permite autenticación, visualización y edición de perfiles con carga de imágenes.

## 🛠️ Tecnologías Utilizadas

- **React 18+** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **React Icons** - Biblioteca de iconos para React
- **Context API** - Manejo de estado global

## 📋 Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- **Node.js** versión 18.0.0 o superior
- **npm** o **yarn** como gestor de paquetes

### Verificar versión de Node.js
```bash
node --version
```

### Instalar Node.js (si es necesario)
Puedes descargar Node.js desde [nodejs.org](https://nodejs.org/) o usar un gestor de versiones como `nvm`:

```bash
# Con nvm (recomendado)
nvm install 18
nvm use 18
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd app-usuario-aula-matriz
```

### 2. Instalar dependencias
```bash
# Con npm
npm install

# O con yarn
yarn install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo:

```bash
cp .env.example .env
```

Editar el archivo `.env` con la configuración de tu API:

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Ejemplo de configuración:**
```env
# Desarrollo local
VITE_API_BASE_URL=http://localhost:8000/api

# Servidor de pruebas
VITE_API_BASE_URL=https://api-prueba.aulamatriz.com/api

# Producción
VITE_API_BASE_URL=https://api.aulamatriz.com/api
```

### 4. Ejecutar en modo desarrollo
```bash
# Con npm
npm run dev

# O con yarn
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run dev:host     # Inicia el servidor accesible desde la red local

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa de la construcción de producción

# Linting y formateo
npm run lint         # Ejecuta ESLint para revisar el código
npm run lint:fix     # Corrige automáticamente los errores de ESLint

# Testing (si se implementa)
npm run test         # Ejecuta las pruebas
npm run test:watch   # Ejecuta las pruebas en modo observación
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ProfileForm.tsx  # Formulario de edición de perfil
│   ├── ProfileView.tsx  # Vista de perfil de usuario
│   └── ui/              # Componentes de interfaz básicos
├── context/             # Contextos de React
│   └── userContext.tsx  # Context para manejo de autenticación
├── services/            # Servicios y llamadas a API
│   └── authServices/    # Servicios de autenticación
├── hooks/               # Custom hooks
├── types/               # Definiciones de tipos TypeScript
├── utils/               # Utilidades y helpers
├── assets/              # Recursos estáticos
├── styles/              # Estilos globales
│   └── index.css        # Estilos principales con Tailwind
├── App.tsx              # Componente raíz
├── main.tsx            # Punto de entrada de la aplicación
└── vite-env.d.ts       # Tipos de Vite
```

## 🔑 Funcionalidades

### ✅ Implementadas
- **Autenticación de usuarios**
  - Login con email y contraseña
  - Manejo de sesiones con tokens
  - Logout seguro

- **Gestión de perfil**
  - Visualización de información personal
  - Edición de datos del perfil
  - Carga y actualización de foto de perfil
  - Validación de formularios

- **Interfaz de usuario**
  - Diseño responsivo y moderno
  - Efectos visuales (glassmorphism, gradientes)
  - Animaciones y transiciones suaves
  - Iconografía consistente

### 🚧 Características Técnicas
- **Manejo de estado** con Context API y useReducer
- **Tipado completo** con TypeScript
- **Validación de datos** en cliente y preparada para servidor
- **Manejo de errores** robusto y user-friendly
- **Carga de archivos** con drag & drop
- **Responsive design** para todos los dispositivos

## 🔧 Configuración de desarrollo

### ESLint Configuration

Para desarrollo en producción, actualizar la configuración de ESLint:

```js
// eslint.config.js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

### Plugins adicionales para React:
```bash
npm install -D eslint-plugin-react-x eslint-plugin-react-dom
```

## 🌐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Nombre de la aplicación | `App Usuario Aula Matriz` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |

## 🚀 Despliegue

### Construcción para producción
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Despliegue en Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Despliegue en Vercel
```bash
vercel --prod
```

## 🐛 Solución de Problemas

### Error: "Node version not supported"
```bash
# Actualizar Node.js a la versión 18 o superior
nvm install 18
nvm use 18
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error de CORS en desarrollo
Verificar que la variable `VITE_API_BASE_URL` esté correctamente configurada y que el servidor API permita requests desde `http://localhost:5173`.

### Problemas con Tailwind CSS
```bash
# Verificar que Tailwind esté correctamente configurado
npx tailwindcss -i ./src/styles/index.css -o ./dist/output.css --watch
```

## 📞 Soporte

Para problemas técnicos o preguntas sobre la implementación:

1. Revisar la documentación de cada tecnología utilizada
2. Verificar la configuración de variables de entorno
3. Comprobar que todas las dependencias estén instaladas correctamente
4. Asegurar que el servidor API esté ejecutándose y sea accesible

## 📝 Notas de Desarrollo

- El proyecto utiliza **Vite** como bundler para un desarrollo más rápido
- **Tailwind CSS** está configurado para purging automático en producción
- Los **tipos TypeScript** están completamente definidos para mejor DX
- El **Context API** maneja el estado global de autenticación
- Las **validaciones** están implementadas tanto en cliente como preparadas para servidor

## 📄 Licencia

Este proyecto ha sido desarrollado como prueba técnica para Aula Matriz.

---

**Versión:** 1.0.0  
**Fecha:** 2025  
**Desarrollado para:** Aula Matriz