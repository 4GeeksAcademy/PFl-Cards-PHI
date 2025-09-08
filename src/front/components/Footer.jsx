import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="footer text-light mt-5 py-4">
			<div className="container">
				<div className="row">
					{/* Logo / Nombre */}
					<div className="col-md-4 mb-3">
						<h5 className="fw-bold">BATTLECARDS</h5>
						<p className="small">
							A fun card game app. Collect, compete and climb the ranking!
						</p>
					</div>

					{/* Links rápidos */}
					<div className="col-md-4 mb-3">
						<h6 className="fw-bold">Developer links</h6>
						<ul className="list-unstyled">
							<li><Link to="/" className="text-light text-decoration-none">Linkeding Pedro</Link></li>
							<li><Link to="/" className="text-light text-decoration-none">Linkeding Ignacio</Link></li>
							<li><Link to="/" className="text-light text-decoration-none">Linkeding Hector</Link></li>
						</ul>
					</div>

					{/* Legal / Redes */}
					<div className="col-md-4 mb-3">
						<h6 className="fw-bold">Legal</h6>
						<ul className="list-unstyled">
							<li className="text-light text-decoration-none">Terms & Conditions</li>
							<li className="text-light text-decoration-none">Privacy Policy</li>
						</ul>
					</div>
				</div>

				<hr className="border-light" />
				<div className="text-center small">
					© {new Date().getFullYear()} BATTLECARDS. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
