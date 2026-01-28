import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="141637216743-ur862m2i85pqh6ukgmv46hn89kv3q668.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
  </StrictMode>,
)
