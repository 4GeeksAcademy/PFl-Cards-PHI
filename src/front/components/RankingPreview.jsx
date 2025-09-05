import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

export default function RankingPreview() {
    const [topUsers, setTopUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                const sorted = data.users.sort((a, b) => b.deck_points - a.deck_points);
                setTopUsers(sorted.slice(0, 5)); //  solo los primeros 5
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div
            className="card shadow-sm"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/ranking")}
        >
            <div className="card-header bg-dark text-white fw-bold">
                🏆 Top 5 Ranking
            </div>
            <ul className="list-group list-group-flush">
                {topUsers.map((user, idx) => (
                    <li
                        key={user.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span>
                            {idx + 1}º {user.username}
                        </span>
                        <span className="badge bg-primary">
                            {user.deck_points}
                        </span>
                    </li>
                ))}
                {topUsers.length === 0 && (
                    <li className="list-group-item text-center text-muted">
                        Loading ranking...
                    </li>
                )}
            </ul>
            <div className="card-footer text-center text-decoration-underline text-primary">
                View full ranking →
            </div>
        </div>
    );
}