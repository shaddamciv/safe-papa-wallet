import { useAccount } from "wagmi";

import { Account, CreateSafe, Recurring, Stripe  } from "./components";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

import "./index.css";
import Wizard from "./components/Wizard";

export function App() {
  const { isConnected } = useAccount();
  return (
    <div className="h-screen">

    <Navbar />
    <Home />
    <Wizard />
  </div>
    // <div className="text-white bg-gradient-to-tr from-[#111827] to-black min-h-screen">
    //   
    //   <main className="flex max-w-[1440px] mx-auto w-full px-[32px] md:px-[64px] lg:px-[120px]">
    //     <section className="w-full flex flex-col items-center justify-center py-[64px] gap-[20px]">
    //       {isConnected && <Account />}
    //       {isConnected && <CreateSafe />}
    //       {isConnected && <Recurring />}
    //       {isConnected && <Stripe />}
    //     </section>
    //   </main>
    // </div>
  );
}
