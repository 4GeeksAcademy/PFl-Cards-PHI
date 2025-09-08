import React, { useState, useEffect } from "react";
import Card from "./Card";
import backImg from "../assets/img/Dorso.png";

const CARD_WIDTH = 220;
const CARD_HEIGHT = 340;
const GAP_PX = 55;
const POPUP_SIDE_MARGIN = 32;

const popupMaxWidth = (CARD_WIDTH * 3) + (GAP_PX * 2) + (POPUP_SIDE_MARGIN * 2);

const Opening = ({ packs = [], onClose }) => {
    const [cardsPerRow, setCardsPerRow] = useState(3);
    const [cardSize, setCardSize] = useState({ width: CARD_WIDTH, height: CARD_HEIGHT });
    const [flipped, setFlipped] = useState({});

    useEffect(() => {
        const calculateLayout = () => {
            const containerWidth = Math.min(window.innerWidth, popupMaxWidth);
            if (containerWidth - POPUP_SIDE_MARGIN * 2 >= (CARD_WIDTH * 3 + GAP_PX * 2)) {
                setCardsPerRow(3);
                setCardSize({ width: CARD_WIDTH, height: CARD_HEIGHT });
            } else if (containerWidth - POPUP_SIDE_MARGIN * 2 >= (CARD_WIDTH * 2 + GAP_PX)) {
                setCardsPerRow(2);
                setCardSize({ width: CARD_WIDTH, height: CARD_HEIGHT });
            } else {
                const available = containerWidth - POPUP_SIDE_MARGIN * 2;
                setCardsPerRow(1);
                setCardSize({
                    width: Math.min(CARD_WIDTH, available),
                    height: Math.min(CARD_HEIGHT, available * (CARD_HEIGHT / CARD_WIDTH))
                });
            }
        };
        calculateLayout();
        window.addEventListener("resize", calculateLayout);
        return () => window.removeEventListener("resize", calculateLayout);
    }, []);

    const cardRadius = 10;
    const gap = `${GAP_PX}px`;
    const modalPadding = "32px";

    const handleFlip = (packIdx, cardIdx) => {
        setFlipped(prev => ({
            ...prev,
            [`${packIdx}-${cardIdx}`]: true
        }));
    };

    // Renderiza las cartas en filas responsivas
    const renderPack = (pack, packIdx) => {
        const cards = Array.isArray(pack) ? pack : [pack];
        const filas = [];
        for (let i = 0; i < cards.length; i += cardsPerRow) {
            filas.push(cards.slice(i, i + cardsPerRow));
        }
        return (
            <div>
                {filas.map((row, rowIdx) => (
                    <div
                        key={rowIdx}
                        className="d-flex justify-content-center mb-4"
                        style={{
                            gap,
                            flexWrap: "nowrap",
                            marginLeft: POPUP_SIDE_MARGIN,
                            marginRight: POPUP_SIDE_MARGIN,
                            display: "flex",
                            flexDirection: "row"
                        }}
                    >
                        {row.map((card, idx) => {
                            const realIdx = rowIdx * cardsPerRow + idx;
                            const cardKey = `${packIdx}-${realIdx}-${card.id ?? ''}`;
                            return (
                                <div
                                    key={cardKey}
                                    className="flip-card"
                                    onClick={() => handleFlip(packIdx, realIdx)}
                                    style={{
                                        width: cardSize.width,
                                        height: cardSize.height,
                                        flex: `0 1 ${cardSize.width}px`,
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                >
                                    <div className={`flip-card-inner${flipped[`${packIdx}-${realIdx}`] ? " flipped" : ""}`}>
                                        <div className="flip-card-front" style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <img
                                                src={backImg}
                                                alt="Dorso"
                                                className="img-fluid rounded"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    borderRadius: cardRadius
                                                }}
                                            />
                                        </div>
                                        <div className="flip-card-back" style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <div style={{
                                                width: cardSize.width,
                                                height: cardSize.height,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <Card
                                                    card={card}
                                                    hideAddToDeck={true}
                                                    style={{
                                                        width: cardSize.width,
                                                        height: cardSize.height,
                                                        borderRadius: cardRadius,
                                                        padding: "16px",
                                                        margin: "16px auto"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    const totalCards = packs.flat().length;
    const flippedCount = Object.keys(flipped).length;

    const handleFlipAll = () => {
        let newFlipped = {};
        packs.forEach((pack, packIdx) => {
            (Array.isArray(pack) ? pack : [pack]).forEach((_, cardIdx) => {
                newFlipped[`${packIdx}-${cardIdx}`] = true;
            });
        });
        setFlipped(newFlipped);
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div
                className="modal-dialog modal-lg"
                role="document"
                style={{
                    maxWidth: `${popupMaxWidth}px`,
                    width: "100%"
                }}
            >
                <div className="modal-content" style={{ padding: modalPadding }}>
                    <div className="modal-header d-flex align-items-center justify-content-between">
                        <h5 className="modal-title text-center m-0 flex-grow-1">Congratulations!</h5>
                        <div className="d-flex align-items-center gap-2">
                            {!(flippedCount >= totalCards) && (
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={handleFlipAll}
                                >
                                    Turn all
                                </button>
                            )}
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
                                <div key={packIdx} className="mb-2">
                                    {renderPack(pack, packIdx)}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="modal-footer justify-content-between">
                        <div></div>
                        <div className="d-flex align-items-center gap-2">
                            {!(flippedCount >= totalCards) && (
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={handleFlipAll}
                                >
                                    Turn all
                                </button>
                            )}
                            {flippedCount >= totalCards && (
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const style = document.createElement("style");
style.innerHTML = `
.flip-card {
    perspective: 1000px;
}
.flip-card-inner {
    width: 100%;
    height: 100%;
    border-radius: 10px;
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
    border-radius: 10px;
}
.flip-card-back {
    transform: rotateY(180deg);
}
`;
document.head.appendChild(style);

export default Opening;