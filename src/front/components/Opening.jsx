import React, { useState, useEffect } from "react";
import Card from "./Card";

const Opening = ({ packs = [], onClose }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => { setIsMobile(window.innerWidth <= 576); };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Helper para dividir las cartas en 2 arriba y 3 abajo
    const renderPack = (pack, packIdx) => {
        if (!Array.isArray(pack)) pack = [pack];
        if (isMobile) {
            // Móvil: una columna
            return (
                <div className="d-flex flex-column align-items-center gap-4">
                    {pack.map((card, idx) => (
                        <Card key={card.id || idx} card={card} hideAddToDeck={true} />
                    ))}
                </div>
            );
        } else {
            // Escritorio: 2 arriba, 3 abajo
            return (
                <div>
                    <div className="d-flex justify-content-center gap-4 mb-4">
                        {pack.slice(0, 2).map((card, idx) => (
                            <Card key={card.id || idx} card={card} hideAddToDeck={true} />
                        ))}
                    </div>
                    <div className="d-flex justify-content-center gap-4">
                        {pack.slice(2, 5).map((card, idx) => (
                            <Card key={card.id || idx + 2} card={card} hideAddToDeck={true} />
                        ))}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header d-flex flex-row align-items-center justify-content-between">
                        <h5 className="modal-title text-center flex-grow-1">Congratulations!</h5>
                        <button type="button" className="btn-close ms-3" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {(!Array.isArray(packs) || packs.length === 0) ? (
                            <p>Loading Cards...</p>
                        ) : (
                            packs.map((pack, packIdx) => (
                                <div key={packIdx} className="mb-4">
                                    {renderPack(pack, packIdx)}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Opening;