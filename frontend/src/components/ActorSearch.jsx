import { useState } from "react";
import { fetchActorAPI } from "../api/api";

export default function ActorSearch() {

  const [actorID, setActorID] = useState("");
  const [movieID, setMovieID] = useState("");
  const [language, setLanguage] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetchActorAPI(actorID, movieID, language);
      setData(res.data.data);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch actor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h2> Actor Search</h2>

      <div style={row}>
        <input placeholder="Actor ID" onChange={e => setActorID(e.target.value)} />
        <input placeholder="Movie ID" onChange={e => setMovieID(e.target.value)} />
        <input placeholder="Language (fr)" onChange={e => setLanguage(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data?.actor && (
        <div>
          <h3>{data.actor.name}</h3>
          <p>{data.actor.bio}</p>
          <p>{data.actor.dob}</p>

          {data.role && (
            <>
              <h4>Role</h4>
              <p>{data.role.roleName}</p>
              <p>{data.role.roleDescription}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const row = {
  display: "flex",
  gap: 10
};