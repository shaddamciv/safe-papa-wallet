import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Account, CreateSafe, Recurring, Stripe } from "../components";
import { FundVault } from "./DepositAndBuy";
import { useFetch } from 'usehooks-ts'
import Navbar from "./Navbar";

interface Post {
  fiatTotal: number
  items: any
}


const Dashboard = () => {
  const { isConnected } = useAccount();
  const [fiatBalance, setFiatBalance] = useState(0);
  const url:any = "https://safe-client.safe.global/v1/chains/137/safes/0x9C93CD8EEc03e5F4936C42702311Ee8D371cd7E3/balances/usd?trusted=true"
  const { data, error } = useFetch<Post>(url)
  console.log(data)
  useEffect(() => {
    if(data){

      setFiatBalance(data!!.fiatTotal)

    }

  }, [data]);
  return (
    <div className="bg-[#fafafa]">
      <Navbar />

      <div className="flex max-w-[1440px] mx-auto w-full px-[32px] md:px-[64px] lg:px-[120px]">
        <div className="flex flex-1 flex-col mt-[64px] text-center">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-[20px]">
            <div className="flex-[1] w-full md:flex-[2] grid grid-cols-2 gap-[20px]">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Total Value in Vault</div>
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
                <div className="stat">
                  <div className="stat-title">Safe Wallet</div>
                  <div className="stat-value">{fiatBalance} USDC </div>
                  <div className="stat-desc">Balance is low</div>
                </div>
              </div>
            </div>
            <div className="lg:stats lg:shadow flex-[1] w-full h-full">
              <div className="lg:stat gap-[20px] lg:gap-0 flex-1 flex lg:flex-col items-center justify-center">
                {isConnected && <Recurring />}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-[20px] lg:flex-row  overflow-hidden items-start justify-start mt-[64px]">
            <div className="flex-[1] md:flex-[2] h-full w-full">
              <table className="table table-zebra w-full overflow-x-scroll">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Subscription Name</th>
                    <th>Child</th>
                    <th>Subscription Amount</th>
                    <th>See Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>Netflix</td>
                    <td>Child 1</td>
                    <td >0xFF8...797</td>
                    <td>
                      <a href="https://app.superfluid.finance/">Subscription</a>
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>Google Play</td>
                    <td>Child 2</td>
                    <td >0xFF8...797</td>
                    <td>
                      <a href="https://app.superfluid.finance/">Subscription</a>
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>Tuition 1</td>
                    <td>Child 1</td>
                    <td >0xFF8...797</td>
                    <td>
                      <a href="https://app.superfluid.finance/">Subscription</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-[1] w-full flex-col items-center justify-center h-full">
            
              {isConnected && <Stripe />}
       
              <label className="label">
                <span className="label-text">Enter amount for Subscription</span>
              </label>
              <label className="flex-[1] justify-center  input-group">
                <input type="text" placeholder="0.01" className="input input-bordered" />
                <span>DAIX</span>
              </label>
              <button  className="btn btn-sm md:btn-md max-w-[320px] w-full rounded-[4px]">
                Add Superfluid Subscription
              </button>
            </div>
          </div>
          <button className="btn my-[64px]">Guardian Account Recovery [TODO]</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
