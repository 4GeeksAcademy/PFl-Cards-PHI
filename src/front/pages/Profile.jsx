import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";
import ProfilePrivate from "../components/ProfilePrivate";
import ProfilePublic from "../components/ProfilePublic";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [deckCards, setDeckCards] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar perfil y deck
  useEffect(() => {
    const fetchProfile = async () => {
      let url, options;
      if (id) {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`;
        options = { method: "GET" };
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;
        options = { method: "GET" };
      }
      const resp = await apiFetch(url, options, navigate);
      if (!resp) return;
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

  // Cargar posición en el ranking
  useEffect(() => {
    if (id) {
      apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.users.sort(
            (a, b) => b.deck_points - a.deck_points
          );
          const idx = sorted.findIndex((u) => u.id === parseInt(id));
          setUserRanking(idx !== -1 ? idx + 1 : null);
        })
        .catch(() => setUserRanking(null));
    } else {
      const fetchMyRanking = async () => {
        const resp = await apiFetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile/ranking`,
          { method: "GET" },
          navigate
        );
        if (!resp || !resp.ok) {
          setUserRanking(null);
          return;
        }
        const data = await resp.json();
        setUserRanking(data.position);
      };
      fetchMyRanking();
    }
  }, [id, navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  // Renderiza el componente correspondiente
  if (!id) {
    return (
      <ProfilePrivate
        userData={userData}
        deckCards={deckCards}
        userRanking={userRanking}
        editingUsername={editingUsername}
        setEditingUsername={setEditingUsername}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        navigate={navigate}
      />
    );
  } else {
    return (
      <ProfilePublic
        userData={userData}
        deckCards={deckCards}
        userRanking={userRanking}
      />
    );
  }
};

export default Profile;
