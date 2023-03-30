import { configureChains, useAccount, usePrepareContractWrite, useProvider, useSigner } from 'wagmi'
import AccountAbstraction, {
  AccountAbstractionConfig, 
} from '@safe-global/account-abstraction-kit-poc'
import { GelatoRelayAdapter, MetaTransactionOptions, RelayTransaction } from '@safe-global/relay-kit'
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import Safe, { SafeFactory } from '@safe-global/safe-core-sdk'
import { polygon } from 'wagmi/chains'

import { MetaTransactionData, OperationType, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import useStorageState from 'react-use-storage-state'

const storageAddress = "0xa537B479c4C3c226aB3D1d5Fb5368cCc89073Fe0";
const comptroller = "0x68809257c2d0252899f6d472b3c64b70d7891498"; //Comptroller for papa wallet
const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const gasLimit = '100000'
const options: MetaTransactionOptions = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: true
}
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

export function Recurring() {
  const { address } = useAccount();
  const providerSafe = useProvider( {chainId: polygon.id})
  const { data: signer, isError, isLoading } = useSigner( {chainId: polygon.id})
  const [safeAddress, setSafeAddress] = useStorageState('safe', "")


  const write = async () => {
    const ethAdapter1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!,
    });

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
        value:  "0",
        operation: OperationType.Call
      }];

    console.log(safeTransactionData,safeAddress);
    const safeSdk = await Safe.create({ ethAdapter: ethAdapter1, safeAddress });

    const relayAdapter = new GelatoRelayAdapter(import.meta.env.VITE_GELATO_API_KEY!);
      
  
    const safeBalance = await safeSdk.getBalance();
    // console.log({
    //   minSafeBalance: ethers.utils.formatEther(relayFee.toString()),
    // });
    console.log({
      safeBalance: ethers.utils.formatEther(safeBalance.toString()),
    });
    
    // 1 Balance
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })

    const signedSafeTx = await safeSdk.signTransaction(safeTransaction)
      
      const encodedTx = safeSdk.getContractManager().safeContract.encode('execTransaction', [
        signedSafeTx.data.to,
        signedSafeTx.data.value,
        signedSafeTx.data.data,
        signedSafeTx.data.operation,
        signedSafeTx.data.safeTxGas,
        signedSafeTx.data.baseGas,
        signedSafeTx.data.gasPrice,
        signedSafeTx.data.gasToken,
        signedSafeTx.data.refundReceiver,
        signedSafeTx.encodedSignatures()
      ])

      const relayTransaction: RelayTransaction = {
        target: safeAddress,
        encodedTransaction: encodedTx,
        chainId: polygon.id,
        options
      }
      const response = await relayAdapter.relayTransaction(relayTransaction)

      console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
  
      // SyncFEE
    // const txConfig = {
    //   TO: storageAddress,
    //   DATA: config.request.data!!,
    //   VALUE: ethers.BigNumber.from("0"),
    //   // Options:
    //   GAS_LIMIT: ethers.BigNumber.from("53321"),
    //   GAS_TOKEN: ethers.constants.AddressZero,
    // };

    // const relayFee = await relayAdapter.getEstimateFee(
    //   polygon.id,
    //   txConfig.GAS_LIMIT,
    //   txConfig.GAS_TOKEN
    // )

 
    // const safeTransaction: MetaTransactionData = {
    //   to: txConfig.TO,
    //   data: txConfig.DATA,
    //   value: txConfig.VALUE,
    //   operation: OperationType.Call,
    // };
    // const options: MetaTransactionOptions = {
    //   gasLimit: txConfig.GAS_LIMIT,
    //   gasToken: txConfig.GAS_TOKEN,
    // };
    // const safeAccountAbstraction = new AccountAbstraction(signer!!);
    // const sdkConfig: AccountAbstractionConfig = {
    //   relayAdapter,
    // };
    // await safeAccountAbstraction.init(sdkConfig);

    // const response = await safeAccountAbstraction.relayTransaction(
    //   safeTransaction,
    //   options
    // );
    // console.log({ GelatoTaskId: response });
  };

  return (
    <>
      <button
        className="btn btn-secondary max-w-[300px] w-full rounded-[4px]"
        disabled={!write}
        onClick={() => write?.()}
      >
        Gasless Vault Fund Topup
      </button>
   
    </>
  );
}
