import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // <- access_token

  // Carga la info del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!resp.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await resp.json();
        setUserData(data);
        setNewUsername(data.username);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Update username
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!resp.ok) {
        throw new Error("Failed to update username");
      }

      const data = await resp.json();
      setUserData((prev) => ({ ...prev, username: data.username }));
      alert("Username updated successfully");
    } catch (err) {
      setError(err.message);
    }
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