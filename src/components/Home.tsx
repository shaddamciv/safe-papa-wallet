import { Link } from "react-router-dom";
import savings from "../assets/savings.png";


const Home = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      
    <div className="w-1/3 text-center">
    <article className="prose">
      <h1 className="font-sans font-'Basis Grotesque Off White Pro',sans-serif text-6xl font-bold">Kickstart Your Wealth 3.0 Dashboard</h1>
      <p className="text-2xl mt-4">Get started on your journey to save periodically for your kids, in a couple of years give them NFT's that allow subscriptions. Finally give them the whole amount when they hit 30.</p>
      <Link to={`wizard`} className="link link-neutral">Get Started</Link>
      {/* <button className="mt-12 px-6 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600">Get Started</button> */}
   </article>
    </div>
    <div className="w-1/8 text-center">
    </div>
    <div className="w-1/3 hidden md:block pl-6 pt-4 pb-8">
      <div className="p-4 text-white rounded-lg">
        <img src={savings}  alt="Mobile App Image" className="rounded w-full h-full opacity-80"/>

      </div>
    </div>
  </div>
  );
};

export default Home;
