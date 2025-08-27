

import './App.css'
import LoginComponent from './modules/auth/loginComponent'
import { useAuth } from './context/userContext'
import { HomePage } from './modules/home/homePage';
import { Toaster } from 'sonner';

function App() {
  const {isAuthenticated} = useAuth();
console.log("es autenticado", isAuthenticated)
  return (

    <div className='w-full h-screen'>
       {isAuthenticated? <HomePage />:<LoginComponent />}
        <Toaster richColors position="bottom-right" />
    </div>

  )
}

export default App
