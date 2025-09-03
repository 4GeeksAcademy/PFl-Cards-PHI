import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";
import { toast } from "react-toastify";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar perfil
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

  // Update username
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

    if (!resp) return; // 👈 si 401, redirige al login

   

    const data = await resp.json();
     if (!resp.ok) {
      toast.error(data.msg || data.error || "Failed to update username");
      return;
    }

    setUserData((prev) => ({ ...prev, username: data.username }));
    toast.success("Username updated successfully");
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left column with user data */}
        <div className="col-md-4">
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

        {/* Placeholder for ranking and collection */}
        <div className="col-md-8">
          <h3>User cards</h3>
          <p>Aqui se mostraran las cartas</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;