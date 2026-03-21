import { useState } from "react";
import { addRoleAPI } from "../api/api";

export default function AddRole() {

  const [form, setForm] = useState({
    movieID: "",
    actorID: "",
    roleName: "",
    roleDescription: ""
  });

  const handleSubmit = async () => {
    try {
      await addRoleAPI(form);
      alert("Added!");
    } catch {
      alert("Failed");
    }
  };

  return (
    <div style={card}>
      <h2> Add Role</h2>

      <div style={grid}>
        <input placeholder="Movie ID" onChange={e => setForm({ ...form, movieID: e.target.value })} />
        <input placeholder="Actor ID" onChange={e => setForm({ ...form, actorID: e.target.value })} />
        <input placeholder="Role Name" onChange={e => setForm({ ...form, roleName: e.target.value })} />
        <input placeholder="Role Description" onChange={e => setForm({ ...form, roleDescription: e.target.value })} />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10
};