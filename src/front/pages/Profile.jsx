import React, { useEffect, useState, useCallback } from "react";
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

  // Cargar perfil y deck en paralelo
  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      let profileUrl, deckUrl;
      if (id) {
        profileUrl = `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`;
        deckUrl = `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/deck`;
      } else {
        profileUrl = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;
        deckUrl = `${import.meta.env.VITE_BACKEND_URL}/api/deck`;
      }
      try {
        const [respProfile, respDeck] = await Promise.all([
          apiFetch(profileUrl, { method: "GET" }, navigate),
          apiFetch(deckUrl, { method: "GET" }, navigate)
        ]);
        if (!respProfile || !respProfile.ok) {
          if (isMounted) {
            setError("Failed to load profile");
            setLoading(false);
          }
          return;
        }
        const profileData = await respProfile.json();
        if (isMounted) {
          setUserData(profileData);
          setNewUsername(profileData.username);
        }
        if (respDeck && respDeck.ok) {
          const deckData = await respDeck.json();
          if (isMounted) setDeckCards(deckData.cards || []);
        } else {
          if (isMounted) setDeckCards([]);
        }
        if (isMounted) setLoading(false);
      } catch {
        if (isMounted) {
          setError("Failed to load profile");
          setLoading(false);
        }
      }
    };
    fetchAll();
    return () => { isMounted = false; };
  }, [navigate, id]);

  // Cargar posición en el ranking
  useEffect(() => {
    let isMounted = true;
    if (id) {
      apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.users.sort(
            (a, b) => b.deck_points - a.deck_points
          );
          const idx = sorted.findIndex((u) => u.id === parseInt(id));
          if (isMounted) setUserRanking(idx !== -1 ? idx + 1 : null);
        })
        .catch(() => { if (isMounted) setUserRanking(null); });
    } else {
      const fetchMyRanking = async () => {
        const resp = await apiFetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile/ranking`,
          { method: "GET" },
          navigate
        );
        if (!resp || !resp.ok) {
          if (isMounted) setUserRanking(null);
          return;
        }
        const data = await resp.json();
        if (isMounted) setUserRanking(data.position);
      };
      fetchMyRanking();
    }
    return () => { isMounted = false; };
  }, [id, navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  // Renderiza el componente correspondiente
  return !id ? (
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
  ) : (
    <ProfilePublic
      userData={userData}
      deckCards={deckCards}
      userRanking={userRanking}
    />
  );
};

export default Profile;
