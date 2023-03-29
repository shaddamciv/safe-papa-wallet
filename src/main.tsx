import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { App } from './App'
import { chains, client } from './wagmi'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Wizard from './components/Wizard'
import Dashboard from './components/Dashboard'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/wizard",
    element: <Wizard/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
