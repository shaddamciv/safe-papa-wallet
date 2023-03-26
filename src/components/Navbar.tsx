import { ConnectButton } from "@rainbow-me/rainbowkit";


const Navbar = () => {
  return (
    <nav className="w-full max-h-[10vh] h-full px-[32px] py-[20px] md:px-[64px] lg:px-[120px] flex items-center justify-between">
      <div>
        <h1>LOGO</h1>
      </div>

      <div><ConnectButton /></div>
    </nav>
  );
};

export default Navbar;
