import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const USERS_PER_PAGE = 50;
const trophies = [
    "🥈", // plata (2º, izquierda)
    "🏆", // copa oro (1º, centro)
    "🥉"  // bronce (3º, derecha)
];
const medalBg = [
    "rgba(185, 185, 185, 1)", // plata difuminado (2º, izquierda)
    "rgba(255, 217, 0, 1)",   // oro difuminado (1º, centro)
    "rgba(205, 128, 50, 1)"   // bronce difuminado (3º, derecha)
];

const podiumHeights = ["120px", "170px", "90px"]; // 2º, 1º, 3º

const Ranking = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [myProfile, setMyProfile] = useState(null);
    const [myRanking, setMyRanking] = useState(null);

    useEffect(() => {
        apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.users)) {
                    const sorted = [...data.users].sort((a, b) => b.deck_points - a.deck_points);
                    setUsers(sorted);
                }
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            setMyProfile(null);
            setMyRanking(null);
            return;
        }
        apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.id) {
                    setMyProfile(data);
                    const idx = users.findIndex(u => u.id === data.id);
                    setMyRanking(idx !== -1 ? idx + 1 : null);
                } else {
                    setMyProfile(null);
                    setMyRanking(null);
                }
            })
            .catch(() => {
                setMyProfile(null);
                setMyRanking(null);
            });
    }, [users]);

    const totalPages = useMemo(() => Math.ceil(users.length / USERS_PER_PAGE), [users]);
    const startIdx = useMemo(() => (currentPage - 1) * USERS_PER_PAGE, [currentPage]);
    const usersToShow = useMemo(() => users.slice(startIdx, startIdx + USERS_PER_PAGE), [users, startIdx]);
    // Top 3 para el podium (orden: 2º, 1º, 3º)
    const top3 = useMemo(() => [users[1], users[0], users[2]].filter(Boolean), [users]);

    // Callbacks para paginación
    const handlePrevPage = useCallback(() => setCurrentPage(p => Math.max(1, p - 1)), []);
    const handleNextPage = useCallback(() => setCurrentPage(p => Math.min(totalPages, p + 1)), [totalPages]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center mb-5">
            <div className="container" style={{ maxWidth: "900px" }}>
                <div className="row justify-content-center mb-4">
                    <div className="col-auto">
                        {myProfile && myRanking ? (
                            <div className="alert alert-info text-center fw-bold mb-0">
                                {/* Usuario y posicion*/}
                                <Link
                                    to={`/profile`}
                                    className="text-decoration-none fw-bold"
                                    style={{
                                        color: "rgba(80, 80, 80, 1) !important",
                                        fontWeight: "bold",
                                        WebkitTextFillColor: "rgba(80, 80, 80, 1)",
                                        textShadow: "none"
                                    }}
                                >
                                    {myRanking}º{" "}
                                    {myProfile.username}
                                </Link>
                                {/* Puntuación con color por defecto */}
                                <span
                                    className="badge bg-primary ms-2"
                                    style={{
                                        fontSize: "1.5rem",
                                        padding: "0.4em 1em",
                                        verticalAlign: "middle"
                                    }}
                                >
                                    {myProfile.deck_points}
                                </span>
                            </div>
                        ) : (
                            <div className="alert alert-secondary text-center mb-0" 
                            style={{ 
                                color: "rgba(80, 80, 80, 1) !important", 
                                fontWeight: "bold",
                                WebkitTextFillColor:"rgba(80, 80, 80, 1)",
                                textShadow: "none"}}>
                                Login/Signup to see your ranking position
                            </div>
                        )}
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <div className=" rounded-4 p-4"
                        style={{
                            display: "flex",
                            gap: "0.7rem",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            width: "100%",
                            maxWidth: "900px",
                            flexWrap: "nowrap"
                        }}
                    >
                        {top3.map((user, idx) => (
                            user ? (
                                <div key={user.id}
                                    className="d-flex flex-column align-items-center"
                                    style={{
                                        width: "calc(33.33% - 0.47rem)",
                                        minWidth: "90px",
                                        maxWidth: "220px",
                                        flex: "1 1 0",
                                        transition: "width 0.2s",
                                    }}
                                >
                                    {/* Trofeo/Medalla */}
                                    <span style={{
                                        fontSize: "2.2rem",
                                        marginBottom: "0.2rem"
                                    }}>
                                        {trophies[idx]}
                                    </span>
                                    {/* Atril */}
                                    <div
                                        style={{
                                            background: medalBg[idx],
                                            borderRadius: "18px 18px 0 0",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                                            width: "100%",
                                            height: podiumHeights[idx],
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            position: "relative",
                                            minHeight: "60px",
                                            paddingTop: "6px"
                                        }}
                                    >
                                        <span
                                            className="fw-bold"
                                            style={{
                                                color: "#111 !important",
                                                fontWeight: "bold",
                                                WebkitTextFillColor: "#111",
                                                textShadow: "none",
                                                fontSize: "clamp(0.8rem, 2vw, 1.3rem)",
                                                wordBreak: "break-word",
                                                textAlign: "center",
                                                width: "100%",
                                                marginBottom: "0.2rem"
                                            }}
                                            title={user.username}
                                        >
                                            {user.username}
                                        </span>
                                        <div style={{ flex: 1 }} />
                                        <span
                                            className="badge bg-primary mb-3"
                                            style={{
                                                fontSize: "1.1rem",
                                                padding: "0.3em 0.7em",
                                                width: "80%",
                                                textAlign: "center",
                                                transition: "font-size 0.2s, width 0.2s"
                                            }}
                                        >
                                            {user.deck_points}
                                        </span>
                                        <div style={{
                                            width: "100%",
                                            height: "18px",
                                            background: medalBg[idx],
                                            borderRadius: "0 0 18px 18px",
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0
                                        }}></div>
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>
                <div className="table-responsive" >
                    <table className="table table-striped table-hover text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ color: "#111" }}>Position</th>
                                <th style={{ color: "#111" }}>User</th>
                                <th>Deck Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersToShow.map((user, idx) => {
                                const globalIdx = startIdx + idx;
                                let trophy = null;
                                if (globalIdx < 3) trophy = trophies[[1, 0, 2][globalIdx]];
                                return (
                                    <tr className={`table-dark ${user.id}`} key={user.id}>
                                        <td style={{ color: "#111", fontWeight: "bold" }}>{globalIdx + 1}º</td>
                                        <td>
                                            {trophy && (
                                                <span style={{ fontSize: "1.3rem", marginRight: "0.3rem", verticalAlign: "middle" }}>
                                                    {trophy}
                                                </span>
                                            )}
                                            <Link
                                                to={`/profile/${user.id}`}
                                                className="text-decoration-underline"
                                                style={{ color: "#111", fontWeight: "bold" }}
                                            >
                                                {user.username}
                                            </Link>
                                        </td>
                                        <td>
                                            <span
                                                className="badge bg-primary"
                                                style={{ fontSize: "1.3rem", padding: "0.3em 0.9em" }}
                                            >
                                                {user.deck_points}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                    <button
                        className="btn btn-outline-primary"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>
                    <span className="fw-bold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-outline-primary"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ranking;
