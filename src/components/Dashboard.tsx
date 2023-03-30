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
import { useFetch } from 'usehooks-ts'
import Navbar from "./Navbar";
import useStorageState from "react-use-storage-state";
// import { polygon } from "wagmi/dist/chains";

interface Post {
  fiatTotal: number
  items: any
}


const Dashboard = () => {
  const { isConnected } = useAccount();
  const [fiatBalance, setFiatBalance] = useState(0);
  const url:any = "https://safe-client.safe.global/v1/chains/137/safes/0x9C93CD8EEc03e5F4936C42702311Ee8D371cd7E3/balances/usd?trusted=true"
  const { data: walletBalance, error } = useFetch<Post>(url)
  const DAIxAddress = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";
  const [safeAddress, setSafeAddress] = useStorageState('safe', "")
  const [addresses, setAddresses] = useStorageState('kids',[""]);

 
  useEffect(() => {
    if(walletBalance){

      setFiatBalance(walletBalance!!.fiatTotal)

    }

  }, [walletBalance]);
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  const [flowRate, setFlowRate] = useState("0");

  async function startSubscription() {    
  
    try {
      // safe method of sending tx
      const ethAdapter1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer!!,
      });

      const superTokenABI = [{"inputs":[{"internalType":"contract ISuperfluidToken","name":"token","type":"address"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"int96","name":"flowRate","type":"int96"},{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"createFlow","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"}];

      const cfaInterface = new ethers.utils.Interface(superTokenABI);
      const createFlowData = cfaInterface.encodeFunctionData("createFlow", [
        DAIxAddress,
        safeAddress,
        addresses[0],//send to the first kid
        parseInt(flowRate),
        "0x"
      ]);

      const safeTransactionData: MetaTransactionData[] = [
        {
          to: "0xcfa132e353cb4e398080b9700609bb008eceb125",
          data: createFlowData,
          value: "0",
          operation: OperationType.Call
        }
      ];
      
      console.log(safeTransactionData, safeAddress);
      const safeSdk = await Safe.create({
        ethAdapter: ethAdapter1,
        safeAddress: safeAddress, //safe address here
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

  async function stopSubscription() {    
  
    try {
      // safe method of sending tx
      const ethAdapter1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer!!,
      });

      const superTokenABI = [{"inputs":[{"internalType":"contract ISuperToken","name":"token","type":"address"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"deleteFlow","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

      const cfaInterface = new ethers.utils.Interface(superTokenABI);
      const deleteFlow = cfaInterface.encodeFunctionData("deleteFlow", [
        DAIxAddress,
        safeAddress,
        addresses[0],
        "0x00"
      ]);

      const safeTransactionData: MetaTransactionData[] = [
        {
          to: "0xcfa132e353cb4e398080b9700609bb008eceb125",
          data: deleteFlow,
          value: "0",
          operation: OperationType.Call
        }
      ];
      
      console.log(safeTransactionData, safeAddress);
      const safeSdk = await Safe.create({
        ethAdapter: ethAdapter1,
        safeAddress: safeAddress, //safe address here
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

      
  
      console.log(
        `Congrats - you've just stopped a money stream!
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
                    <th>Remove Subscription</th>
                    <th>See Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>Netflix</td>
                    <td>Child 1</td>
                    <td ><button  className="btn btn-sm md:btn-md rounded-[4px]" onClick={stopSubscription}>
                      Stop Subscription
                    </button></td>
                    <td>
                      <a href="https://app.superfluid.finance/stream/polygon/0x9c93cd8eec03e5f4936c42702311ee8d371cd7e3-0xab0340c559be41b2423b65a7f246444057bca0cf-0x1305f6b6df9dc47159d12eb7ac2804d4a33173c2-0.0">Subscription</a>
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>Google Play</td>
                    <td>Child 2</td>
                    <td ><button  className="btn btn-sm md:btn-md rounded-[4px]" onClick={stopSubscription}>
                      Stop Subscription
                    </button></td>
                    <td>
                    <a href="https://app.superfluid.finance/stream/polygon/0x9c93cd8eec03e5f4936c42702311ee8d371cd7e3-0xab0340c559be41b2423b65a7f246444057bca0cf-0x1305f6b6df9dc47159d12eb7ac2804d4a33173c2-0.0">Subscription</a>

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
