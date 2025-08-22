import React, { useState } from "react";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: usuario,
                    password: contraseña
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje("Inicio de sesión exitoso.");
                // Aquí puedes guardar el token si tu API lo devuelve
                // localStorage.setItem("token", data.access_token);
            } else {
                setMensaje(data.msg || "Error al iniciar sesión.");
            }
        } catch (error) {
            setMensaje("No se pudo conectar con el servidor.");
        }
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