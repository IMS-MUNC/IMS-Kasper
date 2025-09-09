import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import 'jquery-slimscroll';
import "select2"; // import select2 jQuery plugin
import "select2/dist/css/select2.min.css"; // select2 CSS
import "select2/dist/js/select2.min.js"; // select2 CSS
import { SidebarProvider } from './Context/sidetoggle/SidebarContext.jsx';
import ToastProvider from './utils/toastify/toastifyContainer.jsx';
import { Provider } from "react-redux";
import store from './components/Redux/store';
import { ViewProvider } from "./Context/ViewContax/viewType.jsx";
import { SettingsProvider } from "./Context/purchase/PurchaseContext.jsx";
import { SocketProvider } from './Context/SocketContext.jsx';
import { AuthProvider } from './components/auth/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider />
    <SidebarProvider>
      <Provider store={store}> {/* ✅ Wrap your App inside Provider */}
        <SettingsProvider>
          <ViewProvider>
            <SocketProvider>
              <AuthProvider>
              <GoogleOAuthProvider clientId="1096176100360-e4a9a7o5mp9ghndmr5squt2gutj8ec7j.apps.googleusercontent.com">
              <App />
              </GoogleOAuthProvider>
            </AuthProvider>
            </SocketProvider>
          </ViewProvider>
        </SettingsProvider>
      </Provider>
    </SidebarProvider>
  </StrictMode>
);
