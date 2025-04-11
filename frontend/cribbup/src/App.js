// Contains the routing logic for the app.
import RoutesList from "./Components/RouteList/RouteList";

// AuthProvider wraps the application and provides authentication-related state and functionality
import { AuthProvider } from "./Components/Context/AuthContext";
import "./App.css";

const App = () => {
  return (
    <>
      <AuthProvider>
        <RoutesList />
      </AuthProvider>
    </>
  );
};

export default App;