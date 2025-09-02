import React, { useState } from "react";
import Gateway from "../components/Gateway";
import PackCard from "../components/PackCard";
import { useNavigate } from "react-router-dom";


const packData = [
    {
        title: "1 Pack",
        description: "A pack with 5 random cards.",
        quantity: 1
    },
    {
        title: "5 Packs",
        description: "Five packs with random cards.",
        quantity: 5
    },
    {
        title: "10 Packs",
        description: "Ten packs with random cards.",
        quantity: 10
    }
];

const Shop = () => {
    const [showModal, setShowModal] = useState(false);
    const [packSeleccionado, setPackSelected] = useState("");
    const [quantity, setQuantity] = useState(0);
    const navigate = useNavigate();

    const handleBuy = (pack, qty) => {
        setPackSelected(pack);
        setQuantity(qty);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setPackSelected("");
        setQuantity(0);
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center g-4">
                    {packData.map((pack, idx) => (
                        <div key={idx} className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                            <PackCard
                                title={pack.title}
                                description={pack.description}
                                buttonText={`Buy ${pack.quantity}`}
                                onComprar={() => handleBuy(pack.title, pack.quantity)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <Gateway
                    packSeleccionado={packSeleccionado}
                    quantity={quantity}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default Shop;