import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './contexts/AuthContext.tsx';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{}}
          containerClassName=""
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <App />
    </BrowserRouter>
  </AuthProvider>
)
