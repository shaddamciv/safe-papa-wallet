# PAPA wallet
Create a portfolio manager using gnosis safe and enzyme finance for families. Utilize Stripe to top up, superfluid to manage subscriptions and gelato to setup recurring deposits into enzyme.

Create an email for your kid, and then we will link it with the safe auth kit, so that your children can in future claim the deposits, you made.

They can also request you to pay for subscriptions via superfluid.

## Status
- [x] Frontend wireframes
- [x] Frontend routing
- [x] Stripe Reload - [https://mumbai.polygonscan.com/tx/0xa2a7238dc5d42c5b0a770a89e8dcb2fcd3b46afebd268d6b2ccc3838ba4833f4]
- [x] Gelato Automation
- [x] Safe Core SDK
- [x] Enzyme Vault Creation
- [x] Enzyme Vault Deposits
- [x] Get the latest enzyme safe/data (there is a graphql api) and show on Dashboard
- [x] Superfluid Subscriptions
- [ ] Recovery using auth module - In Progress
- [ ] Use stripe to pay for your kids requests for subscriptions
- [ ] Enzyme Vault Withdrawals
- [ ] Safe Module Guardian Account Recovery
- [ ] Principal Amount Recovery Module
- [x] Ideal Flow on Production -> Create Safe, Deposit into Vault, Setup Recurring Deposits, [Add Superfluid subscriptions]
- [ ] Ideal Flow for inheritor to exit -> Create a recovery module for children to use the address that they used and then recover if time > defined, setup a recovery contract & tests