import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";
import Card from "../components/Card";
import { toast } from "react-toastify";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [deckCards, setDeckCards] = useState([]);
  const [usersRanking, setUsersRanking] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUsername, setEditingUsername] = useState(false); // Nuevo estado

  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar perfil y deck
  useEffect(() => {
    const fetchProfile = async () => {
      let url, options;
      if (id) {
        // Perfil público de otro usuario
        url = `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`;
        options = { method: "GET" };
      } else {
        // Mi perfil privado
        url = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;
        options = { method: "GET" };
      }
      const resp = await apiFetch(url, options, navigate);

      if (!resp) return; // 👈 si hubo 401, ya redirigimos

      if (!resp.ok) {
        setError("Failed to load profile");
        setLoading(false);
        return;
      }

      const data = await resp.json();
      setUserData(data);
      setNewUsername(data.username);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate, id]);

  // Cargar deck del usuario
  useEffect(() => {
    const fetchDeckCards = async () => {
      let deckUrl;
      if (id) {
        deckUrl = `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/deck`;
      } else {
        deckUrl = `${import.meta.env.VITE_BACKEND_URL}/api/deck`;
      }
      const resp = await apiFetch(deckUrl, { method: "GET" }, navigate);
      if (!resp || !resp.ok) {
        setDeckCards([]);
        return;
      }
      const data = await resp.json();
      setDeckCards(data.cards || []);
    };
    fetchDeckCards();
  }, [navigate, id]);

  // Cargar ranking global y posición si es perfil público
  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.users.sort(
            (a, b) => b.deck_points - a.deck_points
          );
          setUsersRanking(sorted);
          const idx = sorted.findIndex((u) => u.id === parseInt(id));
          setUserRanking(idx !== -1 ? idx + 1 : null);
        })
        .catch(() => setUsersRanking([]));
    }
  }, [id]);

  // Update username (solo en perfil propio)
  const handleUpdate = async (e) => {
    e.preventDefault();

    const resp = await apiFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
      {
        method: "PUT",
        body: JSON.stringify({ username: newUsername }),
      },
      navigate
    );

    if (!resp) return;

    if (!resp.ok) {
      toast.error("Failed to update username");
      return;
    }

    const data = await resp.json();
    setUserData((prev) => ({ ...prev, username: data.username }));
    toast.success("Username updated successfully");
    setEditingUsername(false); // Bloquea la línea tras guardar
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  if (!id) {
    // Vista de perfil propio
    return (
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
  }

  // Vista de perfil público (igual que propio pero sin edición ni foto)
  return (
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
};

export default Profile;