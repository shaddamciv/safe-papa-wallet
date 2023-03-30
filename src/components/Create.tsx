import { Address, useAccount, useSigner } from "wagmi";
import { prepareWriteContract, readContract } from "@wagmi/core";
import Safe, { SafeAccountConfig } from "@safe-global/safe-core-sdk";
import { ethers } from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { SafeFactory } from "@safe-global/safe-core-sdk";
import { useStorageState } from 'react-use-storage-state'

import { polygon } from "wagmi/chains";
import {
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { useNavigate } from "react-router-dom";

export function CreateSafe({data}: {data: any}) {
  const fundDeployerAddress = "0x188d356caf78bc6694aee5969fde99a9d612284f";
  const wmaticAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const { address } = useAccount();
  //create a state variable for safeAddress 
  const [safe, setSafe] = useStorageState(
    'safe',
    ""
  );
  const [vault, setVault] = useStorageState(
    'vault',
    "0x68809257c2d0252899f6d472b3c64b70d7891498"
  );
  // useEffect(() => {
  //   console.log("Use effect triggered", safe)

  //   // storing input name
  //   if(safe!!.length>2)
  //     localStorage.setItem("safe", JSON.stringify(safe));
  //   if(vault!!.length>2)
  //     localStorage.setItem("vault", JSON.stringify(vault));
  //   console.log("Set safe vault address")


  // }, [safe, vault]);
  const {
    data: signer,
    isError,
    isLoading,
  } = useSigner({ chainId: polygon.id });

  const fundDeployerABI = [{
    inputs: [
      { internalType: "address", name: "_fundOwner", type: "address" },
      { internalType: "string", name: "_fundName", type: "string" },
      { internalType: "string", name: "_fundSymbol", type: "string" },
      {
        internalType: "address",
        name: "_denominationAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_sharesActionTimelock",
        type: "uint256",
      },
      { internalType: "bytes", name: "_feeManagerConfigData", type: "bytes" },
      {
        internalType: "bytes",
        name: "_policyManagerConfigData",
        type: "bytes",
      },
    ],
    name: "createNewFund",
    outputs: [
      { internalType: "address", name: "comptrollerProxy_", type: "address" },
      { internalType: "address", name: "vaultProxy_", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  }];
  let navigate = useNavigate();

  const createSafe = async () => {
     if(data.safeAddress) {
      setSafe(data.safeAddress)
      if(data.createVaultFlag){
        await createVault(data.safeAddress);
        navigate("/dashboard");
      }
      else{
        await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec
        navigate("/dashboard");
      }
    }
    else{  
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer!!,
      });
      const safeFactory = await SafeFactory.create({ ethAdapter });
      const owners = [address!!];
      const threshold = 1;
      const safeAccountConfig: SafeAccountConfig = {
        owners,
        threshold,
      };
      const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
      setSafe(safeSdk.getAddress())
    
      if(data.createVaultFlag) {
        await createVault(safeSdk.getAddress());
        navigate("/dashboard");
      }
      else
        navigate("/dashboard");
    }
  };

  const createVault = async (owner: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec

    console.log("Vault creating",owner, "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e1853502e2ea2b7c14c5e89169c63065f5a459ff0000000000000000000000003b6913a8ed4595919a6b4a9022208cede20194bd0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000"+owner.slice(2)+"0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000"+owner.slice(2));
    const config = await prepareWriteContract({
      address: fundDeployerAddress,
      abi: fundDeployerABI,
      functionName: "createNewFund",
      args: [
        owner,
        "Papa Wallet",
        "P-",//+(Math.random()*1000),
        wmaticAddress,
        ethers.BigNumber.from(0),
        "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e1853502e2ea2b7c14c5e89169c63065f5a459ff0000000000000000000000003b6913a8ed4595919a6b4a9022208cede20194bd0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000"+owner.slice(2)+"0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000"+owner.slice(2),
      ],
    });
    const ethAdapter1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!,
    });

    const safeTransactionData: SafeTransactionDataPartial = {
      to: fundDeployerAddress,
      value: "0",
      data: config.request.data!!,
    };


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
    let receipt = await executeTxResponse.transactionResponse?.wait();
    console.log("Vault created");
    // need to figure out how to get the actual comptroller address here from this receipt
    setVault(receipt!!.toString());
  };
  return (
    <div>
      <button onClick={createSafe}  className="mb-10 btn btn-wide gap-2 rounded-[4px]" >Start Journey!</button>    
    </div>
  );
}
