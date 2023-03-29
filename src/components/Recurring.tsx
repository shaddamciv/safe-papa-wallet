import { configureChains, useAccount, usePrepareContractWrite, useProvider, useSigner } from 'wagmi'
import AccountAbstraction, {
  AccountAbstractionConfig,MetaTransactionData, 
} from '@safe-global/account-abstraction-kit-poc'
import { GelatoRelayAdapter, MetaTransactionOptions, RelayTransaction } from '@safe-global/relay-kit'
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import Safe, { SafeFactory } from '@safe-global/safe-core-sdk'
import { goerli } from 'wagmi/chains'

import { OperationType, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
const safeAddress  = "0x66504688fC4e1C103fD6ffb69fa61369b1F7b38f";
const storageAddress = "0xa537B479c4C3c226aB3D1d5Fb5368cCc89073Fe0";
const gasLimit = '100000'
const options: MetaTransactionOptions = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: true
}
const storageABI = [
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]; //just a sample contract created for testing

export function Recurring() {
  const { address } = useAccount();

  const providerSafe = useProvider( {chainId: goerli.id})
  const { data: signer, isError, isLoading } = useSigner( {chainId: goerli.id})


  const { config } = usePrepareContractWrite({
    address: storageAddress,
    abi: storageABI,
    functionName: "store",
  });

  const write = async () => {
    const ethAdapter1 = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!,
    });

    console.log("Button clicked");

    const safeTransactionData: SafeTransactionDataPartial = {
      to: storageAddress,
      value: "0",
      data: config.request.data!!,
    };

    console.log(safeTransactionData);
    const safeSdk = await Safe.create({ ethAdapter: ethAdapter1, safeAddress });

    const relayAdapter = new GelatoRelayAdapter("FyHwfW4w3qag8BnaSncbMbvYBY3cU9kameB8nUCCCYA_");
      
  
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
        chainId: goerli.id,
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
    //   goerli.id,
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
        className="btn btn-secondary max-w-[300px] w-full"
        disabled={!write}
        onClick={() => write?.()}
      >
        Setup Recurring Investments Via Gelato
      </button>
   
    </>
  );
}
