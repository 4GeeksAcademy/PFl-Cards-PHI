// import { toast } from "react-toastify";
import { useContext } from "react";
// import { AuthContext } from "../"

export const apiFetch = async (url, options = {}, navigate) => {
  const token = localStorage.getItem("token");

  const resp = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // Si el token expiró o es inválido
  if (resp.status === 401 || resp.status === 422) {
    alert("Tu sesión ha expirado, por favor vuelve a iniciar sesión.");
    localStorage.removeItem("token");
    navigate("/login");
    return null; //  para que no intentes leer json
  }

  return resp;
};