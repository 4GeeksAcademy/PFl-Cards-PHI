import React from "react";
import Card from "./Card";

const ProfilePublic = ({ userData, deckCards, userRanking }) => (
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-4">
                <div className="text-center mb-3">
                    {/* Solo muestra el nombre de usuario, sin foto ni edición */}
                    <div className="d-flex align-items-center justify-content-center mb-2">
                        <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                            {userData?.username}
                        </span>
                    </div>
                </div>
            </div>
            <div className="col-md-8">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h3 className="text-center flex-grow-1 mb-0">Deck</h3>
                    <span
                        className="badge bg-primary ms-2"
                        style={{
                            fontSize: "1.5rem",
                            padding: "0.4em 1em",
                            verticalAlign: "middle",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        {userRanking && (
                            <span style={{ fontSize: "1.5rem", color: "#fff" }}>
                                {userRanking}º
                                <span style={{ margin: "0 8px" }}>-</span>
                            </span>
                        )}
                        {userData?.deck_points}
                    </span>
                </div>
                {deckCards.length === 0 ? (
                    <p className="text-center">There are no cards in the deck.</p>
                ) : (
                    <div className="row justify-content-center">
                        {deckCards.map((card) => (
                            <div
                                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex justify-content-center"
                                key={card.id}
                            >
                                <Card card={card} hideAddToDeck={true} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default ProfilePublic;