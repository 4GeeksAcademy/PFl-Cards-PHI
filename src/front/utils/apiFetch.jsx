// import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

let hasShownSessionExpired = false; // para que no muestre múltiples alerts

export const useApiFetch = () => {
  const { logout } = useContext(AuthContext);

  const apiFetch = async (url, options = {}) => {
    const accessToken = localStorage.getItem("access_token"); 

    const resp = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    // Si el token caduca o es inválido
    if (resp && (resp.status === 401 || resp.status === 422)) {
      if (!hasShownSessionExpired) {
        hasShownSessionExpired = true;
        alert(" Sesion expired. Please, log in.");
      }
      logout(); // limpia estado global y te manda al login
      return null;
    }

    return resp;
  };

  return apiFetch;
};