import { useState, useEffect, createContext } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { PropTypes } from "prop-types";

export const AuthContext = createContext();

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  const initializeUser = (user) => {
    setPending(false);
    try {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const values = {
    currentUser,
  };

  return (
    <>
      <AuthContext.Provider value={values}>
        {!pending && children}
      </AuthContext.Provider>
    </>
  );
}
