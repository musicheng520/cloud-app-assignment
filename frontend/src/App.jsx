import ActorSearch from "./components/ActorSearch";
import MovieRoles from "./components/MovieRoles";
import AddRole from "./components/AddRole";

function App() {
  return (
    <div style={{ padding: 40, background: "#f5f7fa", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}> Movie Cast System</h1>

      <ActorSearch />
      <MovieRoles />
      <AddRole />
    </div>
  );
}

export default App;