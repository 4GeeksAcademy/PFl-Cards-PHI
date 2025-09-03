import React from "react";
import Card from "./Card";

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
}) => (
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-4">
                <div className="text-center mb-3">
                    {/* Espacio para la foto */}
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background: "#e0e0e0",
                            margin: "0 auto 16px auto",
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
                    {/* Nombre de usuario y botón para editar */}
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
                                <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
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
                    <p>There are no cards in the deck.</p>
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

export default ProfilePrivate;