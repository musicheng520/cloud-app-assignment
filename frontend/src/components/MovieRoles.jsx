import { useState } from "react";
import { fetchRolesAPI } from "../api/api";

export default function MovieRoles() {

  const [movieID, setMovieID] = useState("");
  const [roles, setRoles] = useState([]);

  const handleFetch = async () => {
    const res = await fetchRolesAPI(movieID);
    setRoles(res.data.data);
  };

  return (
    <div style={card}>
      <h2> Movie Roles</h2>

      <div style={row}>
        <input placeholder="Movie ID" onChange={e => setMovieID(e.target.value)} />
        <button onClick={handleFetch}>Load</button>
      </div>

      {roles.map((r, i) => (
        <div key={i}>
          <b>{r.roleName}</b>
          <p>{r.roleDescription}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20
};

const row = {
  display: "flex",
  gap: 10
};