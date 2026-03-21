import { useState } from "react";
import { fetchRolesAPI } from "../api/api";

export default function MovieRoles() {

  const [movieID, setMovieID] = useState("");
  const [actorID, setActorID] = useState(""); 
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!movieID) {
      setError("Please enter Movie ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetchRolesAPI(movieID, actorID); //get actor
      setRoles(res.data.data || []);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h2> Movie Roles</h2>

      <div style={row}>
        <input
          placeholder="Movie ID"
          value={movieID}
          onChange={e => setMovieID(e.target.value)}
        />

        <input
          placeholder="Actor ID (optional)"
          value={actorID}
          onChange={e => setActorID(e.target.value)}
        />

        <button onClick={handleFetch}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {error && <p style={errorText}> error!!! {error}</p>}

      {!loading && roles.length === 0 && !error && (
        <p style={{ opacity: 0.6 }}>No roles found</p>
      )}

      <div style={{ marginTop: 15 }}>
        {roles.map((r, i) => (
          <div key={i} style={roleCard}>
            <b>{r.roleName}</b>
            <p>{r.roleDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const row = {
  display: "flex",
  gap: 10,
  marginBottom: 10
};

const roleCard = {
  padding: 12,
  borderRadius: 8,
  background: "#f5f6fa",
  marginBottom: 10
};

const errorText = {
  color: "red",
  fontSize: 14
};