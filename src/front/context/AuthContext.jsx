import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Guardamos el token en estado
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  console.log(token);
  

  // Función para hacer login (guardar token en memoria y en localStorage)
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("access_token", newToken);
  };
  
  // Función para hacer logout (borrar token en memoria y en localStorage)
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // Cuando la app se monta, comprobamos si ya había un token guardado
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token, 
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};