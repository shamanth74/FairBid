import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/reactQuery.js'
import SocketProvider from './websockets/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />      
          </BrowserRouter>
        </AuthProvider>   
      </SocketProvider>
    </QueryClientProvider>     
  </StrictMode>,
)
