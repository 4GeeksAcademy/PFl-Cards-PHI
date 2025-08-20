import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">Logo</Link>

        {/* Botón hamburguesa */}
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

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/decks">Decks</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ranking">Ranking</NavLink>
            </li>
          </ul>

          {/* Botones en desktop */}
          <div className="d-none d-lg-flex">
            <Link className="btn btn-outline-light me-2" to="/signup">Sign Up</Link>
            <Link className="btn btn-warning" to="/login">Login</Link>
          </div>

          {/* Botones en móvil */}
          <div className="d-lg-none mt-3">
            <Link className="btn btn-outline-light w-100 mb-2" to="/signup">Sign Up</Link>
            <Link className="btn btn-warning w-100" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}