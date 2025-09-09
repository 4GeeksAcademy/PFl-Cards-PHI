import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="footer text-light bg-dark shadow" style={{ padding: "8px 0" }}>
			<div className="container">
				<div className="row align-items-center" style={{ minHeight: "50px" }}>
					{/* Logo / Nombre */}
					<div className="col-md-4 mb-2">
						<h5 className="fw-bold mb-1">BATTLECARDS</h5>
						<p className="small mb-1">
							A fun card game app. Collect, compete and climb the ranking!
						</p>
					</div>

					{/* Links rápidos */}
					<div className="col-md-4 mb-2">
						<h6 className="fw-bold mb-1">Developer LinkedIn:</h6>
						<ul className="list-unstyled d-flex mb-1">
							<li className="me-3">
								<Link to="https://www.linkedin.com/in/pedroserranoc/" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-underline">Pedro Serrano</Link>
							</li>
							<li className="me-3">
								<Link to="https://www.linkedin.com/in/ignacio-barrio-aranda-ab54b2133/" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-underline"> Ignacio Barrio</Link>
							</li>
							<li>
								<Link to="https://www.linkedin.com/in/héctor-fernández-cabrerizo-b72567222/" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-underline">Héctor Fernández</Link>
							</li>
						</ul>
					</div>

					<div className="col-md-4 mb-2">
						<h6 className="fw-bold mb-1">Legal</h6>
						<ul className="list-unstyled mb-1">
							<li className="text-light text-decoration-none">Terms & Conditions</li>
							<li className="text-light text-decoration-none">Privacy Policy</li>
						</ul>
					</div>
				</div>

				<hr className="border-light" style={{ margin: "6px 0" }} />
				<div className="text-center small" style={{ marginBottom: "2px" }}>
					© {new Date().getFullYear()} BATTLECARDS. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
