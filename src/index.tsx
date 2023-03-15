import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { theme, Loader, Title } from '@gnosis.pm/safe-react-components'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

import GlobalStyle from './GlobalStyle'
import App from './App'

import './index.scss'

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <WagmiConfig client={client}>
        <SafeProvider
        loader={
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
        >
          <App />
        </SafeProvider>
      </WagmiConfig>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
