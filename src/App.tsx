

import './App.css'
import LoginComponent from './modules/auth/loginComponent'
import { useAuth } from './context/userContext'
import { HomePage } from './modules/home/homePage';
import { Toaster } from 'sonner';
import { Loading } from './modules/common/perfilLoading';

function App() {
  const {isAuthenticated, isLoading} = useAuth();
 if (isLoading) {
  return <Loading text='espera un momento' />
 }
  return (

    <div className='w-full h-screen'>
       {isAuthenticated? <HomePage />:<LoginComponent />}
        <Toaster richColors position="bottom-right" />
    </div>

  )
}

export default App
