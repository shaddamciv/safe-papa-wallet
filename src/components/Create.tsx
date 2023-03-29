import { Address, useAccount, useSigner } from "wagmi";
import { prepareWriteContract, readContract } from "@wagmi/core";
import Safe, { SafeAccountConfig } from "@safe-global/safe-core-sdk";
import { ethers } from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { SafeFactory } from "@safe-global/safe-core-sdk";

import { polygon } from "wagmi/chains";
import {
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateSafe(safeAddress: string, createVaultFlag: boolean) {
  const fundDeployerAddress = "0x188d356caf78bc6694aee5969fde99a9d612284f";
  const wmaticAddress = "0xfb6A5De9e90B8280da409635C7B2859948a15f71";
  const { address } = useAccount();
  //create a state variable for safeAddress 
  const [safe, setSafe] = useState<string>("");
  const [vault, setVault] = useState<string>("");
  useEffect(() => {
    console.log("Use effect triggered", safe)

    // storing input name
    if(safe!!.length>2)
      localStorage.setItem("safe", JSON.stringify(safe));
    if(vault!!.length>2)
      localStorage.setItem("vault", JSON.stringify(vault));
    console.log("Set safe vault address")


  }, [safe, vault]);
  const {
    data: signer,
    isError,
    isLoading,
  } = useSigner({ chainId: polygon.id });

  const fundDeployerABI = [
    {
      inputs: [
        { internalType: "address", name: "_dispatcher", type: "address" },
        {
          internalType: "address",
          name: "_gasRelayPaymasterFactory",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "caller",
          type: "address",
        },
      ],
      name: "BuySharesOnBehalfCallerDeregistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "caller",
          type: "address",
        },
      ],
      name: "BuySharesOnBehalfCallerRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "comptrollerLib",
          type: "address",
        },
      ],
      name: "ComptrollerLibSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "comptrollerProxy",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "denominationAsset",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesActionTimelock",
          type: "uint256",
        },
      ],
      name: "ComptrollerProxyDeployed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "nextDeactivateFeeManagerGasLimit",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "nextPayProtocolFeeGasLimit",
          type: "uint256",
        },
      ],
      name: "GasLimitsForDestructCallSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "vaultProxy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "comptrollerProxy",
          type: "address",
        },
      ],
      name: "MigrationRequestCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "vaultProxy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "comptrollerProxy",
          type: "address",
        },
      ],
      name: "NewFundCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "protocolFeeTracker",
          type: "address",
        },
      ],
      name: "ProtocolFeeTrackerSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "vaultProxy",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nextComptrollerProxy",
          type: "address",
        },
      ],
      name: "ReconfigurationRequestCancelled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "vaultProxy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "comptrollerProxy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "executableTimestamp",
          type: "uint256",
        },
      ],
      name: "ReconfigurationRequestCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "vaultProxy",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "prevComptrollerProxy",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nextComptrollerProxy",
          type: "address",
        },
      ],
      name: "ReconfigurationRequestExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "nextTimelock",
          type: "uint256",
        },
      ],
      name: "ReconfigurationTimelockSet",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "ReleaseIsLive", type: "event" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes4",
          name: "selector",
          type: "bytes4",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "dataHash",
          type: "bytes32",
        },
      ],
      name: "VaultCallDeregistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes4",
          name: "selector",
          type: "bytes4",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "dataHash",
          type: "bytes32",
        },
      ],
      name: "VaultCallRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "vaultLib",
          type: "address",
        },
      ],
      name: "VaultLibSet",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
        {
          internalType: "bool",
          name: "_bypassPrevReleaseFailure",
          type: "bool",
        },
      ],
      name: "cancelMigration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
      ],
      name: "cancelReconfiguration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
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
        {
          internalType: "bool",
          name: "_bypassPrevReleaseFailure",
          type: "bool",
        },
      ],
      name: "createMigrationRequest",
      outputs: [
        { internalType: "address", name: "comptrollerProxy_", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
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
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
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
      name: "createReconfigurationRequest",
      outputs: [
        { internalType: "address", name: "comptrollerProxy_", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_callers", type: "address[]" },
      ],
      name: "deregisterBuySharesOnBehalfCallers",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_contracts", type: "address[]" },
        { internalType: "bytes4[]", name: "_selectors", type: "bytes4[]" },
        { internalType: "bytes32[]", name: "_dataHashes", type: "bytes32[]" },
      ],
      name: "deregisterVaultCalls",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
        {
          internalType: "bool",
          name: "_bypassPrevReleaseFailure",
          type: "bool",
        },
      ],
      name: "executeMigration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
      ],
      name: "executeReconfiguration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getComptrollerLib",
      outputs: [
        { internalType: "address", name: "comptrollerLib_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getCreator",
      outputs: [{ internalType: "address", name: "creator_", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getDispatcher",
      outputs: [
        { internalType: "address", name: "dispatcher_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGasLimitsForDestructCall",
      outputs: [
        {
          internalType: "uint256",
          name: "deactivateFeeManagerGasLimit_",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "payProtocolFeeGasLimit_",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGasRelayPaymasterFactory",
      outputs: [
        {
          internalType: "address",
          name: "gasRelayPaymasterFactory_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGasRelayTrustedForwarder",
      outputs: [
        { internalType: "address", name: "trustedForwarder_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "owner_", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProtocolFeeTracker",
      outputs: [
        {
          internalType: "address",
          name: "protocolFeeTracker_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
      ],
      name: "getReconfigurationRequestForVaultProxy",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "nextComptrollerProxy",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "executableTimestamp",
              type: "uint256",
            },
          ],
          internalType: "struct FundDeployer.ReconfigurationRequest",
          name: "reconfigurationRequest_",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getReconfigurationTimelock",
      outputs: [
        {
          internalType: "uint256",
          name: "reconfigurationTimelock_",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getVaultLib",
      outputs: [
        { internalType: "address", name: "vaultLib_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
      ],
      name: "hasReconfigurationRequest",
      outputs: [
        {
          internalType: "bool",
          name: "hasReconfigurationRequest_",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
        {
          internalType: "address",
          name: "_nextComptrollerProxy",
          type: "address",
        },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "invokeMigrationInCancelHook",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "enum IMigrationHookHandler.MigrationOutHook",
          name: "_hook",
          type: "uint8",
        },
        { internalType: "address", name: "_vaultProxy", type: "address" },
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "invokeMigrationOutHook",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_who", type: "address" }],
      name: "isAllowedBuySharesOnBehalfCaller",
      outputs: [{ internalType: "bool", name: "isAllowed_", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_contract", type: "address" },
        { internalType: "bytes4", name: "_selector", type: "bytes4" },
        { internalType: "bytes32", name: "_dataHash", type: "bytes32" },
      ],
      name: "isAllowedVaultCall",
      outputs: [{ internalType: "bool", name: "isAllowed_", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_contract", type: "address" },
        { internalType: "bytes4", name: "_selector", type: "bytes4" },
        { internalType: "bytes32", name: "_dataHash", type: "bytes32" },
      ],
      name: "isRegisteredVaultCall",
      outputs: [{ internalType: "bool", name: "isRegistered_", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_callers", type: "address[]" },
      ],
      name: "registerBuySharesOnBehalfCallers",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_contracts", type: "address[]" },
        { internalType: "bytes4[]", name: "_selectors", type: "bytes4[]" },
        { internalType: "bytes32[]", name: "_dataHashes", type: "bytes32[]" },
      ],
      name: "registerVaultCalls",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "releaseIsLive",
      outputs: [{ internalType: "bool", name: "isLive_", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_comptrollerLib", type: "address" },
      ],
      name: "setComptrollerLib",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_nextDeactivateFeeManagerGasLimit",
          type: "uint32",
        },
        {
          internalType: "uint32",
          name: "_nextPayProtocolFeeGasLimit",
          type: "uint32",
        },
      ],
      name: "setGasLimitsForDestructCall",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_protocolFeeTracker",
          type: "address",
        },
      ],
      name: "setProtocolFeeTracker",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_nextTimelock", type: "uint256" },
      ],
      name: "setReconfigurationTimelock",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "setReleaseLive",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_vaultLib", type: "address" }],
      name: "setVaultLib",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  let navigate = useNavigate();

  const createSafe = async () => {
    console.log("Safe creating", safeAddress, createVaultFlag);
    if(safeAddress) {
      setSafe(safeAddress)
      console.log("Setting vault address")
      if(!createVaultFlag)
        await createVault(safeAddress);
      else{
        // Somewhere in your code, e.g. inside a handler:
        return navigate("/dashboard");
      }
       
    }
      
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!,
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const owners = [address!!];
    const threshold = 1;

    console.log("owners ", owners);

    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
      // ...
    };
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
    console.log(safeSdk);

    setSafe(safeSdk.getAddress())

    
    if(!createVaultFlag) {
      await createVault(safeSdk.getAddress());
      navigate("/dashboard");
    }
    else
       navigate("/dashboard");

  };

  const createVault = async (owner: string) => {
    console.log("Vault creating");
    const config = await prepareWriteContract({
      address: fundDeployerAddress,
      abi: fundDeployerABI,
      functionName: "createNewFund",
      args: [
        owner,
        "Papa Wallet",
        "P-"+(new Date().getTime().toString()),
        wmaticAddress,
        ethers.BigNumber.from(0),
        "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e1853502e2ea2b7c14c5e89169c63065f5a459ff0000000000000000000000003b6913a8ed4595919a6b4a9022208cede20194bd0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009c93cd8eec03e5f4936c42702311ee8d371cd7e300000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009c93cd8eec03e5f4936c42702311ee8d371cd7e3",
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
      <button onClick={createSafe}  className="mb-10 btn btn-wide gap-2" >Start Journey!</button>    
    </div>
  );
}
