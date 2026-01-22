import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/ContextProvider.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { PurchaseOrderProvider } from "./context/PurchaseOrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider> 
        <PurchaseOrderProvider>
          <App />
        </PurchaseOrderProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
