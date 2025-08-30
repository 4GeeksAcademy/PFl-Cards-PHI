// import { toast } from "react-toastify";
let hasShownSessionExpired = false; // bandera global

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("access_token");

  const resp = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (resp && (resp.status === 401 || resp.status === 422)) {
    if (!hasShownSessionExpired) {
      hasShownSessionExpired = true; // evitar duplicados
      alert(" Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // fuerza recarga y navbar se actualiza
    }
    return null;
  }

  return resp;
};