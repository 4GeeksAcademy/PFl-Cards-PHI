import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Obtener usuarios guardados
        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar si el usuario y contraseña coinciden
        const usuarioValido = usuariosGuardados.find(
            (u) => u.usuario === usuario && u.contraseña === contraseña
        );

        if (!usuarioValido) {
            setError("Usuario o contraseña incorrectos.");
            return;
        }

        // Autenticar y redirigir
        login();
        navigate("/");
    };

    return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-4">
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="usuario" className="form-label">Usuario</label>
                        <input type="text" className="form-control" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contraseña" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required/>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                </form>
                {mensaje && (
                    <div className="alert alert-info mt-3" role="alert">
                        {mensaje}
                    </div>
                )}
            </div>
          </div>
        </div>
    );
};

export default Login;