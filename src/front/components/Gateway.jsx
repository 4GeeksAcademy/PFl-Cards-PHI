import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiFetch } from "../utils/apiFetch";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Gateway = ({ packSeleccionado, quantity, onClose }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("access_token");

    const handleBuy = async () => {
        setLoading(true);
        try {
            console.log("Quantity sent to API:", quantity);
            const response = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pack: Number(quantity) }) //el backend espera "pack" con valores 1|5|10 para mapear al price_id de Stripe, de ahi el cambio
            });
            const data = await response.json();

            // En el código original solo se comprobaba si response.ok, ahora tambien se verifica que venga data.id, porque Stripe necesita ese ID para redirigir 
            if (!response.ok || !data?.id) throw new Error(data?.msg || "Failed to create session");

            // Redirección a Stripe Checkout usando el sessionId devuelto por el backend
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
            if (error) throw error;

            // navigate("/packopen"); //ya no es necesaria la navegación directa a /packopen, ya que ahora la gestiona Stripe


        } catch (error) {
            console.error(error);
            toast.error("There was a problem with the payment.");
            setLoading(false);
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
                        <h5 className="modal-title">You will be redirected</h5>
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
                            You will be redirected to Stripe Checkout to complete your purchase.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" disabled={loading} onClick={handleBuy}>
                            {loading ? "Processing..." : "Go to Stripe"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gateway;

