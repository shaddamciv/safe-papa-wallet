import { useEffect, useState } from "react";
import Safe, { SafeAccountConfig } from "@safe-global/safe-core-sdk";
import {
  MetaTransactionData,
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { MetaTransactionOptions } from "@safe-global/account-abstraction-kit-poc";
import { useAccount, useProvider, useSigner } from 'wagmi';
import { Signer, ethers } from 'ethers';
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { Account, CreateSafe, Recurring, Stripe } from "../components";
import { Framework } from "@superfluid-finance/sdk-core";
import { FundVault } from "./DepositAndBuy";
import Navbar from "./Navbar";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  const [flowRate, setFlowRate] = useState("0");

  async function startSubscription() {    
    // const chainId = Number((await provider.getNetwork()).chainId);
    // const sf = await Framework.create({
    //   chainId,
    //   provider
    // });
    
    // const superSigner = sf.createSigner({ signer: signer as Signer });
    // console.log(await superSigner.getAddress());

    // const daix = await sf.loadSuperToken("fDAIx");
    // console.log(daix);
    
    try {
      // const createFlowOperation = daix.createFlow({
      //   sender: await superSigner.getAddress(),
      //   receiver: "",
      //   flowRate: flowRate
      //   // userData?: string
      // });
    
      // console.log(createFlowOperation);
      // console.log("Creating your stream...");
        
      // safe method of sending tx
      const ethAdapter1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer!!,
      });

      const superTokenABI = '{"inputs":[{"internalType":"contract ISuperfluidToken","name":"token","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"int96","name":"flowRate","type":"int96"},{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"createFlow","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"}';
      const DAIxAddress = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";

      const cfaInterface = new ethers.utils.Interface(superTokenABI);
      const createFlowData = cfaInterface.encodeFunctionData("createFlow", [
        DAIxAddress,
        "", //receiver - child
        flowRate,
        "0x"
      ]);

      const safeTransactionData: MetaTransactionData[] = [
        {
          to: "0x6EeE6060f715257b970700bc2656De21dEdF074C",
          data: createFlowData,
          value: "0",
          operation: OperationType.Call
        }
      ];
      
      console.log(safeTransactionData);
      const safeSdk = await Safe.create({
        ethAdapter: ethAdapter1,
        safeAddress: "", //safe address here
      });

      const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData,
      });
      console.log(safeTransaction);

      const txHash = await safeSdk.getTransactionHash(safeTransaction);
      const approveTxResponse = await safeSdk.approveTransactionHash(txHash);
      await approveTxResponse.transactionResponse?.wait();
      const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
      await executeTxResponse.transactionResponse?.wait();

      // const result = await createFlowOperation.exec(superSigner);
      // console.log(result);
  
      console.log(
        `Congrats - you've just created a money stream!
      `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  } 

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
                  <div className="stat-value">22220 USDC </div>
                  <div className="stat-desc">Balance is sufficient</div>
                </div>
              </div>
            </div>
            <div className="lg:stats lg:shadow flex-[1] w-full h-full">
              <div className="lg:stat gap-[20px] lg:gap-0 flex-1 flex lg:flex-col items-center justify-center">
                {isConnected && <Recurring />}

                {isConnected && <FundVault />}
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
                    <th>NFT Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>Netflix</td>
                    <td>Child 1</td>
                    <td aria-value="0xFF8F016D5702113fA734ea78f168c0BF8c059797">0xFF8...797</td>
                    <td>
                      <a href="https://app.superfluid.finance/">Subscription</a>
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>Google Play</td>
                    <td>Child 2</td>
                    <td aria-value="0xFF8F016D5702113fA734ea78f168c0BF8c059797">0xFF8...797</td>
                    <td>
                      <a href="https://app.superfluid.finance/">Subscription</a>
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>Tuition 1</td>
                    <td>Child 1</td>
                    <td aria-value="0xFF8F016D5702113fA734ea78f168c0BF8c059797">0xFF8...797</td>
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
                <input type="text" value={flowRate} onChange={(e) => setFlowRate(e.target.value)} className="input input-bordered" />
                <span>DAIX</span>
              </label>
              <button  className="btn btn-sm md:btn-md max-w-[320px] w-full rounded-[4px]" onClick={startSubscription}>
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
