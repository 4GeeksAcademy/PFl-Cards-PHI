import React, { useState, useEffect } from "react";
import Card from "./Card";

const backImg = "docs/Imagenes/Dorso.png";

const Opening = ({ packs = [], onClose }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
    const [flipped, setFlipped] = useState({});

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleFlip = (packIdx, cardIdx) => {
        setFlipped(prev => ({
            ...prev,
            [`${packIdx}-${cardIdx}`]: true
        }));
    };

    // Divide en dos filas: primera con 2, segunda con 3
    const renderPack = (pack, packIdx) => {
        if (!Array.isArray(pack)) pack = [pack];
        const cards = pack;
        const firstRow = cards.slice(0, 2);
        const secondRow = cards.slice(2, 5);

        return (
            <div>
                <div className="d-flex justify-content-center mb-4 gap-4">
                    {firstRow.map((card, idx) => (
                        <div
                            key={card.id || idx}
                            className="flip-card"
                            onClick={() => handleFlip(packIdx, idx)}
                        >
                            <div className={`flip-card-inner${flipped[`${packIdx}-${idx}`] ? " flipped" : ""}`}>
                                <div className="flip-card-front">
                                    <img
                                        src={backImg}
                                        alt="Dorso"
                                        className="img-fluid rounded"
                                        style={{ width: "220px", height: "340px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="flip-card-back">
                                    <Card card={card} hideAddToDeck={true} style={{
                                        width: "220px",
                                        height: "340px",
                                        borderRadius: "0px"
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center mb-4 gap-4">
                    {secondRow.map((card, idx) => (
                        <div
                            key={card.id || idx + 2}
                            className="flip-card"
                            onClick={() => handleFlip(packIdx, idx + 2)}
                        >
                            <div className={`flip-card-inner${flipped[`${packIdx}-${idx + 2}`] ? " flipped" : ""}`}>
                                <div className="flip-card-front">
                                    <img
                                        src={backImg}
                                        alt="Dorso"
                                        className="img-fluid rounded"
                                        style={{ width: "220px", height: "340px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="flip-card-back">
                                    <Card card={card} hideAddToDeck={true} style={{
                                        width: "220px",
                                        height: "340px",
                                        borderRadius: "14px"
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const totalCards = packs.flat().length;
    const flippedCount = Object.keys(flipped).length;

    const handleFlipAll = () => {
        let newFlipped = {};
        packs.forEach((pack, packIdx) => {
            pack.forEach((_, cardIdx) => {
                newFlipped[`${packIdx}-${cardIdx}`] = true;
            });
        });
        setFlipped(newFlipped);
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header d-flex align-items-center justify-content-between">
                        <h5 className="modal-title text-center m-0 flex-grow-1">Congratulations!</h5>
                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={handleFlipAll}
                            >
                                Turn all
                            </button>
                            {flippedCount >= totalCards && (
                                <button type="button" className="btn-close ms-2" onClick={onClose}></button>
                            )}
                        </div>
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
                    <div className="modal-footer justify-content-center">
                        {flippedCount >= totalCards && (
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos para el efecto de girar carta
const style = document.createElement("style");
style.innerHTML = `
.flip-card {
    perspective: 1000px;
    display: inline-block;
}
.flip-card-inner {
    width: 220px;
    height: 340px;
    border-radius: 14px;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    position: relative;
    cursor: pointer;
}
.flip-card-inner.flipped {
    transform: rotateY(180deg);
}
.flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 14px;
}
.flip-card-back {
    transform: rotateY(180deg);
}
`;
document.head.appendChild(style);

export default Opening;