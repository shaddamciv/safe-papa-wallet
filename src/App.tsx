
import Navbar from "./components/Navbar";
import Home from "./components/Home";

import "./index.css";
import Wizard from "./components/Wizard";
import Dashboard from "./components/Dashboard";

export function App() {
  return (
    <div className="h-screen">

    <Navbar />
    <Dashboard />
    {/* <Home /> */}
    {/* <Wizard /> */}
  </div>

  );
}
