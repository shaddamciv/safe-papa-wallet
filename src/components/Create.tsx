import { Address, useAccount, useEnsName, useSigner } from "wagmi";
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

export function CreateSafe() {
  const fundDeployerAddress = "0x188d356caf78bc6694aee5969fde99a9d612284f";
  const comptroller = "0xDdEe6C75EADF626F44DDdbF3Fef78BA3CC2452E8";
  const wmaticAddress = "0xfb6A5De9e90B8280da409635C7B2859948a15f71";
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const {
    data: signer,
    isError,
    isLoading,
  } = useSigner({ chainId: polygon.id });
  const comptrollerABI = [
    {
      inputs: [
        { internalType: "address", name: "_dispatcher", type: "address" },
        {
          internalType: "address",
          name: "_protocolFeeReserve",
          type: "address",
        },
        { internalType: "address", name: "_fundDeployer", type: "address" },
        { internalType: "address", name: "_valueInterpreter", type: "address" },
        {
          internalType: "address",
          name: "_externalPositionManager",
          type: "address",
        },
        { internalType: "address", name: "_feeManager", type: "address" },
        {
          internalType: "address",
          name: "_integrationManager",
          type: "address",
        },
        { internalType: "address", name: "_policyManager", type: "address" },
        {
          internalType: "address",
          name: "_gasRelayPaymasterFactory",
          type: "address",
        },
        { internalType: "address", name: "_mlnToken", type: "address" },
        { internalType: "address", name: "_wethToken", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "autoProtocolFeeSharesBuyback",
          type: "bool",
        },
      ],
      name: "AutoProtocolFeeSharesBuybackSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes",
          name: "failureReturnData",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "buybackValueInMln",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "gav",
          type: "uint256",
        },
      ],
      name: "BuyBackMaxProtocolFeeSharesFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "DeactivateFeeManagerFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "gasRelayPaymaster",
          type: "address",
        },
      ],
      name: "GasRelayPaymasterSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesDue",
          type: "uint256",
        },
      ],
      name: "MigratedSharesDuePaid",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "PayProtocolFeeDuringDestructFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes",
          name: "failureReturnData",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "address",
          name: "redeemer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesAmount",
          type: "uint256",
        },
      ],
      name: "PreRedeemSharesHookFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "RedeemSharesInKindCalcGavFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "investmentAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesIssued",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesReceived",
          type: "uint256",
        },
      ],
      name: "SharesBought",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "redeemer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "receivedAssets",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "receivedAssetAmounts",
          type: "uint256[]",
        },
      ],
      name: "SharesRedeemed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "vaultProxy",
          type: "address",
        },
      ],
      name: "VaultProxySet",
      type: "event",
    },
    {
      inputs: [{ internalType: "bool", name: "_isMigration", type: "bool" }],
      name: "activate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_sharesAmount", type: "uint256" },
      ],
      name: "buyBackProtocolFeeShares",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
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
    },
    {
      inputs: [
        { internalType: "address", name: "_buyer", type: "address" },
        { internalType: "uint256", name: "_investmentAmount", type: "uint256" },
        {
          internalType: "uint256",
          name: "_minSharesQuantity",
          type: "uint256",
        },
      ],
      name: "buySharesOnBehalf",
      outputs: [
        { internalType: "uint256", name: "sharesReceived_", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "calcGav",
      outputs: [{ internalType: "uint256", name: "gav_", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "calcGrossShareValue",
      outputs: [
        { internalType: "uint256", name: "grossShareValue_", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_extension", type: "address" },
        { internalType: "uint256", name: "_actionId", type: "uint256" },
        { internalType: "bytes", name: "_callArgs", type: "bytes" },
      ],
      name: "callOnExtension",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "deployGasRelayPaymaster",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "depositToGasRelayPaymaster",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_deactivateFeeManagerGasLimit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_payProtocolFeeGasLimit",
          type: "uint256",
        },
      ],
      name: "destructActivated",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "destructUnactivated",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "doesAutoProtocolFeeSharesBuyback",
      outputs: [
        { internalType: "bool", name: "doesAutoBuyback_", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getDenominationAsset",
      outputs: [
        {
          internalType: "address",
          name: "denominationAsset_",
          type: "address",
        },
      ],
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
      name: "getExternalPositionManager",
      outputs: [
        {
          internalType: "address",
          name: "externalPositionManager_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getFeeManager",
      outputs: [
        { internalType: "address", name: "feeManager_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getFundDeployer",
      outputs: [
        { internalType: "address", name: "fundDeployer_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGasRelayPaymaster",
      outputs: [
        {
          internalType: "address",
          name: "gasRelayPaymaster_",
          type: "address",
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
      name: "getIntegrationManager",
      outputs: [
        {
          internalType: "address",
          name: "integrationManager_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_who", type: "address" }],
      name: "getLastSharesBoughtTimestampForAccount",
      outputs: [
        {
          internalType: "uint256",
          name: "lastSharesBoughtTimestamp_",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMlnToken",
      outputs: [
        { internalType: "address", name: "mlnToken_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPolicyManager",
      outputs: [
        { internalType: "address", name: "policyManager_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProtocolFeeReserve",
      outputs: [
        {
          internalType: "address",
          name: "protocolFeeReserve_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSharesActionTimelock",
      outputs: [
        {
          internalType: "uint256",
          name: "sharesActionTimelock_",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getValueInterpreter",
      outputs: [
        { internalType: "address", name: "valueInterpreter_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getVaultProxy",
      outputs: [
        { internalType: "address", name: "vaultProxy_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getWethToken",
      outputs: [
        { internalType: "address", name: "wethToken_", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
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
      ],
      name: "init",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "enum IVault.VaultAction",
          name: "_action",
          type: "uint8",
        },
        { internalType: "bytes", name: "_actionData", type: "bytes" },
      ],
      name: "permissionedVaultAction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_sender", type: "address" },
        { internalType: "address", name: "_recipient", type: "address" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "preTransferSharesHook",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_sender", type: "address" }],
      name: "preTransferSharesHookFreelyTransferable",
      outputs: [],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
      name: "pullWethForGasRelayer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_recipient", type: "address" },
        { internalType: "uint256", name: "_sharesQuantity", type: "uint256" },
        { internalType: "address[]", name: "_payoutAssets", type: "address[]" },
        {
          internalType: "uint256[]",
          name: "_payoutAssetPercentages",
          type: "uint256[]",
        },
      ],
      name: "redeemSharesForSpecificAssets",
      outputs: [
        {
          internalType: "uint256[]",
          name: "payoutAmounts_",
          type: "uint256[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_recipient", type: "address" },
        { internalType: "uint256", name: "_sharesQuantity", type: "uint256" },
        {
          internalType: "address[]",
          name: "_additionalAssets",
          type: "address[]",
        },
        { internalType: "address[]", name: "_assetsToSkip", type: "address[]" },
      ],
      name: "redeemSharesInKind",
      outputs: [
        { internalType: "address[]", name: "payoutAssets_", type: "address[]" },
        {
          internalType: "uint256[]",
          name: "payoutAmounts_",
          type: "uint256[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_nextAutoProtocolFeeSharesBuyback",
          type: "bool",
        },
      ],
      name: "setAutoProtocolFeeSharesBuyback",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_nextGasRelayPaymaster",
          type: "address",
        },
      ],
      name: "setGasRelayPaymaster",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultProxy", type: "address" },
      ],
      name: "setVaultProxy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "shutdownGasRelayPaymaster",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_contract", type: "address" },
        { internalType: "bytes4", name: "_selector", type: "bytes4" },
        { internalType: "bytes", name: "_encodedArgs", type: "bytes" },
      ],
      name: "vaultCallOnContract",
      outputs: [{ internalType: "bytes", name: "returnData_", type: "bytes" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
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

  const createSafe = async () => {
    console.log("Safe creating");
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!,
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const owners = [address];
    const threshold = 1;

    console.log("owners ", owners);

    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
      // ...
    };
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
    console.log(safeSdk);

    //once the safe is created, we should try and create the new enzyme fund as well
    //Then save it in localStorage
    await createVault(safeSdk.getAddress());
  };

  const fundVault = async (owner: string) => {
    const config = await prepareWriteContract({
      address: comptroller,
      abi: comptrollerABI,
      functionName: "buyShares",
      args: [ethers.utils.parseEther("0.01"), ethers.utils.parseEther("1")],
    });

    console.log("Vault creating");
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
    await executeTxResponse.transactionResponse?.wait();
  };

  const createVault = async (owner: string) => {
    console.log("Vault creating");
    const config = await prepareWriteContract({
      address: fundDeployerAddress,
      abi: fundDeployerABI,
      functionName: "createNewFund",
      args: [
        owner,
        "Papa",
        "PW1",
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
    await executeTxResponse.transactionResponse?.wait();
  };
  return (
    <div>
      <button onClick={createSafe}>Create new safe</button>
      <button
        onClick={() =>
          createVault("0x9c93cd8eec03e5f4936c42702311ee8d371cd7e3")
        }
      >
        Create new vault
      </button>
      <button
        onClick={() => fundVault("0x9c93cd8eec03e5f4936c42702311ee8d371cd7e3")}
      >
        Fund your vault
      </button>
    </div>
  );
}
