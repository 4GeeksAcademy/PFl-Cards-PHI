import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="bg-dark text-light mt-5 py-4">
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
						<h6 className="fw-bold">Links</h6>
						<ul className="list-unstyled">
							<li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
							<li><Link to="/shop" className="text-light text-decoration-none">Shop</Link></li>
							<li><Link to="/ranking" className="text-light text-decoration-none">Ranking</Link></li>
							<li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
						</ul>
					</div>

					{/* Legal / Redes */}
					<div className="col-md-4 mb-3">
						<h6 className="fw-bold">Legal</h6>
						<ul className="list-unstyled">
							<li><Link to="/terms" className="text-light text-decoration-none">Terms & Conditions</Link></li>
							<li><Link to="/privacy" className="text-light text-decoration-none">Privacy Policy</Link></li>
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
