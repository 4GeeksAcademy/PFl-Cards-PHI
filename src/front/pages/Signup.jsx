import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Obtener usuarios guardados
        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar si el usuario o correo ya existen
        const existe = usuariosGuardados.some(
            (u) => u.usuario === usuario || u.correo === correo
        );

        if (existe) {
            setError("El usuario o correo ya existen.");
            return;
        }

        // Guardar nuevo usuario
        const nuevoUsuario = { usuario, correo, contraseña };
        localStorage.setItem(
            "usuarios",
            JSON.stringify([...usuariosGuardados, nuevoUsuario])
        );

        // Limpiar error y autenticar
        setError("");
        login();
        navigate("/");
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="text-center mb-4">Crear cuenta</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="usuario" className="form-label">Usuario</label>
                            <input type="text" className="form-control" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="correo" className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contraseña" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;