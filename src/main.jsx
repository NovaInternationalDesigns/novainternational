import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/ContextProvider.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { GuestProvider } from "./context/GuestContext.jsx";
import { PurchaseOrderProvider } from "./context/PurchaseOrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <GuestProvider>
          <PurchaseOrderProvider>
            <App />
          </PurchaseOrderProvider>
        </GuestProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
