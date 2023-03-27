import { ConnectButton } from "@rainbow-me/rainbowkit";
import papa from "../assets/papa.png";

const Navbar = () => {
  return (
    <nav className="w-full max-h-[10vh] h-full px-[32px] py-[20px] md:px-[64px] lg:px-[120px] flex items-center justify-between">
      <div>
      <img src={papa}  alt="Logo App Image" className="max-h-[10vh]"/>

      </div>

      <div><ConnectButton /></div>
    </nav>
  );
};

export default Navbar;
