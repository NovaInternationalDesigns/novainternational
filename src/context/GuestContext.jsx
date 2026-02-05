import { createContext, useContext, useState } from "react";

const GuestContext = createContext(null);

export const GuestProvider = ({ children }) => {
  // guest object: { _id, name, email, sessionId }
  const [guest, setGuest] = useState(null);

  const startGuestSession = (guestData) => setGuest(guestData);

  const endGuestSession = () => setGuest(null);

  return (
    <GuestContext.Provider value={{ guest, setGuest, startGuestSession, endGuestSession }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => useContext(GuestContext);