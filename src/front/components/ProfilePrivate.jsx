import React, { useEffect, useState } from "react";
import Card from "./Card";
import { apiFetch } from "../utils/apiFetch";
import { Link } from "react-router-dom";
import defaultAvatar from "../assets/img/rigo-baby.jpg";
import { toast } from "react-toastify";

const ProfilePrivate = ({
    userData,
    deckCards,
    userRanking,
    editingUsername,
    setEditingUsername,
    newUsername,
    setNewUsername,
    navigate
}) => {
    
    const [collectionStats, setCollectionStats] = useState(null);
    const [profileImg, setProfileImg] = useState(null); // url local de la imagen
    useEffect(() => {
        const fetchStats = async () => {
            let stats = {};
            try {
                const accessToken = localStorage.getItem("access_token");
                // Colección del usuario
                const respUser = await apiFetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/collection`,
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                let userCards = [];
                if (respUser.ok) {
                    const data = await respUser.json();
                    userCards = data["User collection"] || [];
                    stats.uniqueCount = userCards.length;
                    stats.totalCount = userCards.reduce((acc, c) => acc + (c.quantity || 1), 0);
                    stats.commonCount = userCards.filter(c => c.game_rarity === "common").length;
                    stats.rareCount = userCards.filter(c => c.game_rarity === "rare").length;
                    stats.legendaryCount = userCards.filter(c => c.game_rarity === "legendary").length;
                }
                // Catálogo global
                const respGlobal = await apiFetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/cards`
                );
                if (respGlobal.ok) {
                    const cardsData = await respGlobal.json();
                    const cards = cardsData.cards || [];
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
    // Handler para subir imagen de perfil
    const handleProfileImg = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setProfileImg(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await apiFetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: newUsername })
                }
            );
            const data = await resp.json();
            if (resp.ok) {
                setEditingUsername(false);
                if (typeof userData === "object") {
                    userData.username = data.username;
                }
                toast.success("Name updated successfully");
            } else {
                toast.error(data.msg || "Error updating name");
            }
        } catch (err) {
            toast.error("Network error updating name");
        }
    };

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
                                marginBottom: "12px",
                                backgroundColor: "rgba(20, 20, 20, 0.8)",
                                border: "1px solid #9b9b9bff",
                                textAlign: "center",
                                borderRadius: "18px"

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
                                    position: "relative"
                                }}
                            >
                                <img
                                    src={profileImg || defaultAvatar}
                                    alt="Profile"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%"
                                    }}
                                />
                                <label htmlFor="profile-img-upload" style={{
                                    position: "absolute",
                                    bottom: "-18px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "#1976d2",
                                    color: "#fff",
                                    borderRadius: "16px",
                                    padding: "2px 12px",
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                }}>
                                    Edit photo
                                    <input
                                        id="profile-img-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleProfileImg}
                                    />
                                </label>
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
                                            Save
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
                                    backgroundColor: "rgba(20, 20, 20, 0.8)",
                                    border: "1px solid #9b9b9bff",
                                    textAlign: "center",
                                    borderRadius: "18px",
                                }}>


                                <div className="row g-2 justify-content-center">
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#317ceeff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>Total cards</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>
                                                {collectionStats.totalCount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#32a547ff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>Unique cards</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>
                                                {collectionStats.uniqueCount} / {collectionStats.totalUnique}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#807b7bff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>Common</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>
                                                {collectionStats.commonCount} / {collectionStats.totalCommon}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#8134caff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>Rare</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>
                                                {collectionStats.rareCount} / {collectionStats.totalRare}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-12">
                                        <div className="d-flex flex-column align-items-center" style={{ background: "#a0a300ff", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px" }}>
                                            <span style={{ color: "#333", fontWeight: "bold", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>Legendary</span>
                                            <span style={{ color: "#333", fontSize: "1.2rem", textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>
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
                <div className="col-md-9 ">
                    <div className="d-flex mb-3 flex-wrap flex-md-nowrap align-items-center "
                        style={{
                            minHeight: "56px",
                            gap: "16px",
                            justifyContent: "center"
                        }}
                    >
                        {/* Deck centrado */}
                        <div className="d-flex-grow-1 align-items-center justify-content-center">
                            <h1 className=""
                                style={{
                                    color: "#1976d2",
                                    fontWeight: "bold",
                                    display: "flex",
                                    textShadow: "0px 0px 4px rgba(0, 0, 0, 1)",
                                    verticalAlign: "middle"
                                }}
                            >
                                Deck
                            </h1>
                        </div>
                        {/* Puntuación y posición */}
                        <div>
                            <span className="badge bg-primary"
                                style={{
                                    fontSize: "1.5rem",
                                    padding: "0.4em 1em",
                                    verticalAlign: "middle",
                                    display: "flex",
                                    gap: "12px",
                                    minWidth: "120px"
                                }}
                            >
                                <Link to="/ranking" style={{ textDecoration: "none", color: "#fff" }}>
                                    {userRanking && (
                                        <span style={{ fontSize: "1.5rem" }}>
                                            {userRanking}º <span style={{ margin: "0 8px" }}>-</span>
                                        </span>
                                    )}
                                    {userData?.deck_points}
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: "rgba(20, 20, 20, 0.8)",
                            border: "1px solid #9b9b9bff",
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
