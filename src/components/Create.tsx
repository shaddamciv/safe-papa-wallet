import { useAccount, useEnsName, useSigner } from 'wagmi'
import Safe, { SafeAccountConfig } from '@safe-global/safe-core-sdk'
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import { SafeFactory } from '@safe-global/safe-core-sdk'
import { goerli } from 'wagmi/chains'
export function CreateSafe() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: signer, isError, isLoading } = useSigner( {chainId: goerli.id})

  const createSafe = (async () => {

    console.log("Safe creating")
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer!!
    })

    const safeFactory = await SafeFactory.create({ ethAdapter })

    const owners = [address]
    const threshold = 1

    console.log("owners ",owners)

    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
      // ...
    }

    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })
    console.log(safeSdk)
  });

  return (
    <div>
      <button onClick={createSafe}>Create new safe</button>
    </div>
  )
}
