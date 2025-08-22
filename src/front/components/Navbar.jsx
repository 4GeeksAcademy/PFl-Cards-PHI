import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">BattleCards</Link>
        {/* Hamburguesa para vista de movil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ranking">Ranking</NavLink>
            </li>
          </ul>
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-outline-light me-2" to="/signup">Sign Up</Link>
              <Link className="btn btn-warning" to="/login">Login</Link>
            </>
          ) : (
            <div className="dropdown me-2">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Mi Perfil
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/mis-cartas">Perfil</Link>
                </li>
                <li>
                <li>
                  <Link className="dropdown-item" to="/mis-sobres">Mis Sobres</Link>
                </li>
                  <Link className="dropdown-item" to="/mis-cartas">Coleccion y Mazo</Link>
                </li>
                <div style={{ backgroundColor: "#f8d7da", padding: "8px" }}>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>Log out</button>
                  </li>
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}