# My Salary App

My Salary App is a decentralized application (dApp) that allows companies to securely and automatically delegate periodic token transfers (specifically USDC) to their employees' wallets as part of their salary compensation. The application uses MetaMask Smart Accounts Kit technology to enable automated transactions with advanced permissions.

## Features

- **Secure MetaMask connection**: The application connects to the company's wallet through MetaMask.
- **Smart Accounts**: Support for upgrading regular accounts to Smart Accounts for advanced features.
- **Token delegation**: Companies can delegate permissions to transfer USDC to employees periodically.
- **Flexible configuration**: Companies can configure the amount, frequency, and duration of transfers.
- **Blockchain transparency**: All transactions are recorded on the blockchain for transparency.
- **Base Sepolia network**: The application operates on the Base Sepolia network (chainId 84532).
- **USDC token**: Default use of USDC as the token for salary delegations.

## Requirements

- MetaMask Flask (version 13.5.0 or higher)
- Modern web browser
- User account with sufficient funds on Base Sepolia

## How to use the application

### 1. Initial setup

1. Make sure you have the MetaMask Flask extension installed in your browser
2. Open the application in your browser (by default at http://localhost:3000)
3. Connect your company wallet using the "Connect MetaMask" button

### 2. Upgrade to Smart Account (if needed)

1. After connecting your wallet, verify if it's already a Smart Account
2. If not, click "Check Status" to confirm
3. If your account is not a Smart Account, click "Upgrade to Smart Account"
4. Follow the instructions in MetaMask to complete the upgrade
5. Wait for the transaction to be confirmed

### 3. Configure token delegation

1. Navigate to the "USDC Delegation for Employees" section
2. Enter the employee's wallet address in "Employee Wallet Address"
3. Specify the amount of USDC to transfer in "Amount per Period (USDC)"
4. Select the transfer frequency in "Period (seconds)"
5. Select the total duration of the permission in "Duration (seconds)"
6. Click "Delegate USDC" to start the process

### 4. Permission management

- You can revoke permissions at any time through the MetaMask interface
- The application does not have direct access to your funds, only acts with granted permissions
- All permissions have an expiration date as configured

## Technology used

- **Next.js 16.1.1**: React framework for modern web applications
- **React 19.2.3**: Library for user interfaces
- **TypeScript**: Programming language with static typing
- **MetaMask SDK**: Integration with MetaMask extension
- **MetaMask Smart Accounts Kit**: Advanced Smart Account features
- **Viem**: TypeScript library for EVM interactions
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## Development

### Installation

```bash
npm install
```

### Running in development mode

```bash
npm run dev
```

The application will run at [http://localhost:3000](http://localhost:3000)

### Building

```bash
npm run build
```

### Starting in production mode

```bash
npm start
```

## Security

- The application does not store private keys or user funds
- All transactions are performed with explicit permissions granted by the user
- Smart Accounts allow automated transactions with security controls
- Transfers are limited by amount, frequency, and duration as configured

## Limitations

- Requires MetaMask Flask for Smart Account features
- Currently operates only on Base Sepolia (test network)
- Default token is USDC on Base Sepolia
- Advanced features require the account to be a Smart Account

## Contributions

Contributions are welcome. Please open an issue or pull request in the repository.

## License

This project is licensed under the terms of the LICENSE (add specific details if applicable).