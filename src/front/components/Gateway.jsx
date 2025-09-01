import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Gateway = ({ packSeleccionado, quantity, onClose }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("access_token");

    const handleBuy = async () => {
        setLoading(true);
        try {
            console.log("Quantity sent to API:", quantity);
            const response = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/buy`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            if (!response.ok) throw new Error("Purchase error");
            setLoading(false);
            navigate("/packopen");
        } catch (error) {
            setLoading(false);
            alert("There was a problem with the payment.");
        }
    };

    if (!accessToken) {
        return (
            <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">You need an account!</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p>To buy packs you must be registered or logged in.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
                            <button type="button" className="btn btn-success" onClick={() => navigate("/login")}>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Payment gateway simulation popup
    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Payment Gateway Simulation</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        <p>
                            <strong>Pack selected:</strong> {packSeleccionado}
                        </p>
                        <p>
                            <strong>Quantity:</strong> {quantity}
                        </p>
                        <p>
                            Please confirm your buy to continue.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" disabled={loading} onClick={handleBuy}>
                            {loading ? "Processing..." : "Confirm Buy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gateway;

