import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PackCard from "../components/PackCard";

const Shop = () => {
    const [showModal, setShowModal] = useState(false);
    const [packSeleccionado, setPackSelected] = useState("");
    const [quantity, setQuantity] = useState(0);
    const navigate = useNavigate();

    const handleBuy = (pack) => {
        setPackSelected(pack);
        // Determina la cantidad según el pack seleccionado
        if (pack === "1 Pack") setQuantity(1);
        else if (pack === "5 Packs") setQuantity(5);
        else if (pack === "10 Packs") setQuantity(10);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setPackSelected("");
        setQuantity(0);
    };

    const handlePay = () => {
        // Suma la cantidad comprada a la que ya existe
        const packsNow = parseInt(localStorage.getItem("packsBuy") || "0", 10);
        localStorage.setItem("packsBuy", packsNow + quantity);
        navigate("/packopen");
    };

    return (
        <>
            <div className="row justify-content-center g-4 mt-5 mb-5">
                <div className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                    <PackCard
                        title="1 Pack"
                        description="A pack with random cards."
                        buttonText="Buy 1"
                        onComprar={() => handleBuy("1 Pack")}
                    />
                </div>
                <div className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                    <PackCard
                        title="5 Packs"
                        description="Five packs with random cards."
                        buttonText="Buy 5"
                        onComprar={() => handleBuy("5 Packs")}
                    />
                </div>
                <div className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                    <PackCard
                        title="10 Packs"
                        description="Ten packs with random cards."
                        buttonText="Buy 10"
                        onComprar={() => handleBuy("10 Packs")}
                    />
                </div>
            </div>

            {/* Modal de pago */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Payment Gateway</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <p>You are buying: <strong>{packSeleccionado}</strong></p>
                                <p>Number of Packs: <strong>{quantity}</strong></p>
                                {/* Aquí puedes integrar tu pasarela de pago real */}
                                <p>Simulación de pago...</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handlePay}>Pay</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default Shop