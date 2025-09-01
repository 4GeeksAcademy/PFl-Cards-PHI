import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApiFetch } from "../utils/apiFetch";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Carga la info del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
          { method: "GET" },
          logout,
          navigate
        );
        if (data) {
          setUserData(data);
          setNewUsername(data.username);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  // Update username
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
        {
          method: "PUT",
          body: JSON.stringify({ username: newUsername }),
        },
        logout,
        navigate
      );

      if (data) {
        setUserData((prev) => ({ ...prev, username: data.username }));
        alert("Username updated successfully");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>My profile</h3>
      <p><strong>Username:</strong> {userData?.username}</p>
      <p><strong>Email:</strong> {userData?.email}</p>

      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">New username</label>
          <input
            type="text"
            className="form-control"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default Profile;