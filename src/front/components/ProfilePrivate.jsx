import React, { useEffect, useState } from "react";
import Card from "./Card";
import { apiFetch } from "../utils/apiFetch";

const ProfilePrivate = ({
    userData,
    deckCards,
    userRanking,
    editingUsername,
    setEditingUsername,
    newUsername,
    setNewUsername,
    navigate,
    handleUpdate
}) => {
    const [collectionStats, setCollectionStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            let stats = {};
            try {
                // Usuario (con JWT)
                const accessToken = localStorage.getItem("access_token");
                const respUser = await apiFetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/collection`,
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                if (respUser.ok) {
                    const data = await respUser.json();
                    const userCards = data["User collection"] || [];
                    stats.totalCount = userCards.reduce((acc, c) => acc + (c.quantity || 1), 0);
                    stats.uniqueCount = userCards.length;
                    stats.commonCount = userCards.filter(c => c.game_rarity === "common").length;
                    stats.rareCount = userCards.filter(c => c.game_rarity === "rare").length;
                    stats.legendaryCount = userCards.filter(c => c.game_rarity === "legendary").length;
                }
                // Global
                const respGlobal = await apiFetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/cards`
                );
                if (respGlobal.ok) {
                    const cards = await respGlobal.json();
                    stats.totalUnique = cards.length;
                    stats.totalCommon = cards.filter(c => c.game_rarity === "common").length;
                    stats.totalRare = cards.filter(c => c.game_rarity === "rare").length;
                    stats.totalLegendary = cards.filter(c => c.game_rarity === "legendary").length;
                }
                setCollectionStats(stats);
            } catch (e) {
                setCollectionStats(null);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Columna de datos de usuario*/}
                <div className="col-md-3">
                    <div className="mb-3">
                        {/* Foto y edición de nombre */}
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginBottom: "12px"
                            }}
                        >
                            <div
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "50%",
                                    background: "#e0e0e0",
                                    marginBottom: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "2.5rem",
                                    color: "#888",
                                    overflow: "hidden",
                                }}
                            >
                                <span role="img" aria-label="profile">
                                    👤
                                </span>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                {editingUsername ? (
                                    <form
                                        onSubmit={handleUpdate}
                                        className="d-flex align-items-center"
                                        style={{ gap: "8px" }}
                                    >
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            placeholder="Nuevo nombre de usuario"
                                            style={{ maxWidth: "140px" }}
                                        />
                                        <button type="submit" className="btn btn-primary btn-sm">
                                            Guardar
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <span style={{
                                            fontSize: "1.7rem",
                                            fontWeight: "bold",
                                            letterSpacing: "1px",
                                            textAlign: "center"
                                        }}>
                                            {userData?.username}
                                        </span>
                                        <button
                                            className="btn btn-outline-primary btn-sm ms-2"
                                            type="button"
                                            onClick={() => setEditingUsername(true)}
                                            style={{ marginLeft: "12px" }}
                                        >
                                            Edit name
                                        </button>
                                    </>
                                )}
                            </div>
                            <p className="mt-3">
                                <strong>Email:</strong> {userData?.email}
                            </p>
                        </div>
                        {/* Estadísticas de colección */}
                        {collectionStats && (
                            <div className="mt-3 p-3 shadow-sm"
                                style={{
                                    backgroundColor: "rgba(179, 217, 255, 0.7)",
                                    textAlign: "left",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "18px",
                                }}>
                                <div className="row g-2">
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#6acfeeff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold" }}>Total cards</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem" }}>
                                                {collectionStats.totalCount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#99eea8ff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold" }}>Unique cards</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem" }}>
                                                {collectionStats.uniqueCount} / {collectionStats.totalUnique}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#bdbdbd", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold" }}>Common</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem" }}>
                                                {collectionStats.commonCount} / {collectionStats.totalCommon}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#c0aae9ff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold" }}>Rare</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem" }}>
                                                {collectionStats.rareCount} / {collectionStats.totalRare}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#ffe082", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold" }}>Legendary</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem" }}>
                                                {collectionStats.legendaryCount} / {collectionStats.totalLegendary}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Columna de deck*/}
                <div className="col-md-9">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="text-center flex-grow-1 mb-0" style={{
                            fontWeight: "bold",
                            color: "#333"
                        }}>Deck</h3>
                        <span
                            className="badge bg-primary ms-2"
                            style={{
                                fontSize: "1.5rem",
                                padding: "0.4em 1em",
                                verticalAlign: "middle",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                boxShadow: "0 2px 8px #bbb"
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
                    <div
                        style={{
                            backgroundColor: "rgba(179, 217, 255, 0.7)",
                            borderRadius: "18px",
                            minHeight: "220px",
                            marginBottom: "20px",
                            width: "100%",
                            overflowX: "auto",
                            paddingLeft: "5px"
                        }}
                    >
                        {deckCards.length === 0 ? (
                            <p className="text-center">There are no cards in the deck.</p>
                        ) : (
                            <div
                                className="d-flex justify-content-center"
                                style={{
                                    gap: "18px",
                                    flexWrap: "wrap",
                                    width: "100%",
                                    minWidth: "320px",
                                }}
                            >
                                {deckCards
                                    .slice()
                                    .sort((a, b) => {
                                        const rarityOrder = { legendary: 0, rare: 1, common: 2 };
                                        return rarityOrder[a.game_rarity] - rarityOrder[b.game_rarity];
                                    })
                                    .map((card) => (
                                        <div
                                            key={card.id}
                                            style={{
                                                minWidth: "220px",
                                                maxWidth: "220px",
                                                flex: "1 0 220px",
                                                display: "flex",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Card card={card} hideAddToDeck={true} />
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePrivate;
