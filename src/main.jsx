import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './styles/theme.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { FaviconUpdater } from './components/common/FaviconUpdater'
import { router } from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <NotificationProvider>
              <FaviconUpdater />
              <RouterProvider router={router} />
            </NotificationProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
