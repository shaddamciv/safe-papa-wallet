import { useAccount } from "wagmi";
import { Account, CreateSafe, Recurring, Stripe } from "../components";

const Dashboard = () => {
  const { isConnected } = useAccount();
  return (
    <div className="flex h-screen">
      <div className="flex flex-1  flex-col">
        <div className="flex space-x-10 flex-row items-center justify-center">
          <div className="stats shadow">
            
            <div className="stat">
              <div className="stat-title">Total Value in Portfolio</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">Last Deposit 2 days ago</div>
            </div>
            
          </div>
          <div className="stats shadow">
            
            <div className="stat">
              <div className="stat-title">Total Increase in Value</div>
              <div className="stat-value">89% </div>
              <div className="stat-desc">21% more than last month</div>
            </div>
            
          </div>
          <div className="stats shadow">
            
            <div className="stat">
              <div className="stat-title">Monthly Dividend's</div>
              <div className="stat-value">120 USD </div>
              <div className="stat-desc">2% more than last month</div>
            </div>
            
          </div>
          <div className="stats shadow">
            
            
          </div>
          <div className="stats shadow">
            
            <div className="stat space-y-2 flex-1 flex flex-col items-center justify-center">
            {isConnected && <Recurring />}
            {isConnected && <Stripe />}
            </div>
            
          </div>
        </div>
        <div className="flex-1 flex space-y-10 flex-col items-center justify-center">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Subscription Name</th>
                <th>Child</th>
                <th>Subscription Amount</th>
                <th>NFT Issued</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Netflix</td>
                <td>Child 1</td>
                <td>0xFF8F016D5702113fA734ea78f168c0BF8c059797</td>
                <td><a href="https://app.superfluid.finance/">Subscription</a></td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Google Play</td>
                <td>Child 2</td>
                <td>0xFF8F016D5702113fA734ea78f168c0BF8c059797</td>
                <td><a href="https://app.superfluid.finance/">Subscription</a></td>

              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Tuition 1</td>
                <td>Child 1</td>
                <td>0xFF8F016D5702113fA734ea78f168c0BF8c059797</td>
                <td><a href="https://app.superfluid.finance/">Subscription</a></td>

              </tr>
            </tbody>
          </table>
          <button className="btn ">Add Subscription</button>
        </div>
      </div>
    </div>

    </div>

    // <div className="text-white bg-gradient-to-tr from-[#111827] to-black min-h-screen">

    //   <main className="flex max-w-[1440px] mx-auto w-full px-[32px] md:px-[64px] lg:px-[120px]">
    //     <section className="w-full flex flex-col items-center justify-center py-[64px] gap-[20px]">
    //       {isConnected && <Account />}
    //       {isConnected && <Recurring />}

    //     </section>
    //   </main>
    // </div>
  );
};

export default Dashboard;
