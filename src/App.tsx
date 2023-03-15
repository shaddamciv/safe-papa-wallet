import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { InjectedConnector } from 'wagmi/connectors/injected'

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Link = styled.a`
  margin-top: 8px;
`

const SafeApp = (): React.ReactElement => {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { sdk, safe } = useSafeAppsSDK()

  const submitTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: safe.safeAddress,
            value: '0',
            data: '0x',
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  return (
    <>
      <Container>
        <Title size="sm">Wallet Address: {address}</Title>
        <Button size="lg" onClick={() => (isConnected ? disconnect() : connect())}>
          {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </Button>
      </Container>
      <Container>
        <Title size="md">Safe: {safe.safeAddress}</Title>

        <Button size="lg" color="primary" onClick={submitTx}>
          Click to send a test transaction
        </Button>

        <Link href="https://github.com/gnosis/safe-apps-sdk" target="_blank" rel="noreferrer">
          Documentation
        </Link>
      </Container>
    </>
  )
}

export default SafeApp
