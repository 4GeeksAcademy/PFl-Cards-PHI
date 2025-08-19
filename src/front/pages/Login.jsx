import React, { useState } from "react";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Usuario:", usuario);
        console.log("Contraseña:", contraseña);
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
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                </form>
            </div>
          </div>
        </div>
    );
};

export default Login;