
import Navbar from "./components/Navbar";
import Home from "./components/Home";

import "./index.css";
import Wizard from "./components/Wizard";
import Dashboard from "./components/Dashboard";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function App() {
  const { isConnected } = useAccount();
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("safe") !== null && localStorage.getItem("safe")!!.length > 2 ) {
      navigate("/dashboard");
    } 
  }, [isConnected]);
  return (
    <div className="h-screen">

    <Navbar />
    {/* <Dashboard /> */}
    <Home />
    {/* <Wizard /> */}
  </div>

  );
}
