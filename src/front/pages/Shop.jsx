import React, { useState, useCallback } from "react";
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
    const [modalPack, setModalPack] = useState(null); // {title, description, quantity} o null
    const navigate = useNavigate();

    const handleBuy = useCallback((pack) => {
        setModalPack(pack);
    }, []);

    const handleClose = useCallback(() => {
        setModalPack(null);
    }, []);

    return (
        <>
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center g-4">
                    {packData.map((pack, idx) => (
                        <div key={idx} className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                            <PackCard
                                title={pack.title}
                                description={pack.description}
                                buttonText={`Buy ${pack.quantity}`}
                                onComprar={() => handleBuy(pack)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {modalPack && (
                <Gateway
                    packSeleccionado={modalPack.title}
                    quantity={modalPack.quantity}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default Shop;