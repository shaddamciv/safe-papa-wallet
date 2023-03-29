import { Address, useAccount, useSigner } from "wagmi";
import { prepareWriteContract, readContract } from "@wagmi/core";
import Safe, { SafeAccountConfig } from "@safe-global/safe-core-sdk";
import { ethers } from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { SafeFactory } from "@safe-global/safe-core-sdk";

import { polygon } from "wagmi/chains";
import {
  MetaTransactionData,
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { MetaTransactionOptions } from "@safe-global/account-abstraction-kit-poc";

export function FundVault() {
  const fundDeployerAddress = "0x188d356caf78bc6694aee5969fde99a9d612284f";
  // const comptroller = "0xDdEe6C75EADF626F44DDdbF3Fef78BA3CC2452E8";
  const comptroller = "0x68809257c2d0252899f6d472b3c64b70d7891498"; //Comptroller for papa wallet
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const { address } = useAccount();

  const {
    data: signer,
    isError,
    isLoading,
  } = useSigner({ chainId: polygon.id });
  const usdcABI = [{
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }]
  const comptrollerABI = [{
    inputs: [
      { internalType: "uint256", name: "_investmentAmount", type: "uint256" },
      {
        internalType: "uint256",
        name: "_minSharesQuantity",
        type: "uint256",
      },
    ],
    name: "buyShares",
    outputs: [
      { internalType: "uint256", name: "sharesReceived_", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  }];

 
  const fundVault = async (owner: string) => {
    // const config = await prepareWriteContract({
    //   address: comptroller,
    //   abi: comptrollerABI,
    //   functionName: "buyShares",
    //   args: [ethers.utils.parseUnits("0.0001",6), 1],
    // });

    console.log("Vault creating");
    const ethAdapter1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!,
    });

    // const safeTransactionData: SafeTransactionDataPartial = {
    //   to: fundDeployerAddress,
    //   value: "0",
    //   data: config.request.data!!,
    // };

    const gasLimit = '100000'
    const usdcInterface = new ethers.utils.Interface(usdcABI);
    const approveData = usdcInterface.encodeFunctionData("approve", [comptroller, ethers.utils.parseUnits("0.0001",6)]);
    //create comptroller interface
    const comptrollerInterface = new ethers.utils.Interface(comptrollerABI);
    const buySharesData = comptrollerInterface.encodeFunctionData("buyShares", [ethers.utils.parseUnits("0.0001",6), 1]);

    //print to console both the data to approve and the data to buy shares
    console.log(approveData);
    console.log(buySharesData);
const safeTransactionData: MetaTransactionData[] = [
  {
    to: usdcAddress,
    data: approveData,
    value: "0",
    operation: OperationType.Call
  },
  {
    to: comptroller,
    data: buySharesData,
    value: "0",
    operation: OperationType.Call
  }];
const options: MetaTransactionOptions = {
    gasLimit: ethers.BigNumber.from(gasLimit),
    isSponsored: false
}

    console.log(safeTransactionData);
    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter1,
      safeAddress: owner,
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
  };

 
  return (
    <div>
      <button className="btn btn-secondary max-w-[300px] w-full"
        onClick={() => fundVault("0x9c93cd8eec03e5f4936c42702311ee8d371cd7e3")}
      >
        Vault Fund Topup
      </button>
    </div>
  );
}
