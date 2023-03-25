import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()

  return (
    <div>
      {address}
    </div>
  )
}
