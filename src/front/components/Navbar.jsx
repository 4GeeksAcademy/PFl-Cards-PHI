import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import battlecardsLogo from "/workspaces/PFl-Cards-PHI/docs/Imagenes/battlecardsLogo.png"; 

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark shadow"
        style={{
          position: "sticky", // Cambia fixed por sticky
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <div className="container-fluid">
          {/* Logo con imagen */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={battlecardsLogo}
              alt="BattleCards Logo"
              style={{ height: "70px", marginRight: "16px" }}
            />
          </Link>
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
                <NavLink
                  className="nav-link"
                  to="/shop"
                  style={{ fontSize: "1.25rem", padding: "10px 18px" }} // Más grande
                >
                  Shop
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/ranking"
                  style={{ fontSize: "1.25rem", padding: "10px 18px" }} // Más grande
                >
                  Ranking
                </NavLink>
              </li>
            </ul>
            {!isAuthenticated ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/signup">
                  Sign Up
                </Link>
                <Link className="btn btn-warning" to="/login">
                  Login
                </Link>
              </>
            ) : (
              <div className="dropdown me-2">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  My Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/Profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/PackOpen">
                      My Packs
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/CollectionDeck">
                      Collection and Deck
                    </Link>
                  </li>
                  <div className="bg-danger-subtle p-2">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </li>
                  </div>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}