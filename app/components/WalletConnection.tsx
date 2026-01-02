'use client';

import React from 'react';
import { useWallet } from '../context/WalletContext';

const WalletConnection = () => {
  const { account, chainId, connectWallet, disconnectWallet, isConnected, error, isInitialized } = useWallet();

  // Función para formatear la dirección de la wallet
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Función para obtener el nombre de la red basado en el chainId
  const getNetworkName = (chainId: string | null) => {
    if (!chainId) return 'Unknown';

    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x3':
        return 'Ropsten Testnet';
      case '0x4':
        return 'Rinkeby Testnet';
      case '0x5':
        return 'Goerli Testnet';
      case '0x2a':
        return 'Kovan Testnet';
      case '0xaa36a7':
        return 'Sepolia Testnet';
      case '0x89':
        return 'Polygon Mainnet';
      case '0x13881':
        return 'Mumbai Testnet';
      default:
        return `Chain ID: ${parseInt(chainId, 16)}`;
    }
  };

  // Mostrar un mensaje de carga mientras se inicializa
  if (!isInitialized) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Company Wallet Connection
        </h2>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing MetaMask connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Company Wallet Connection
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isConnected ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <div className={`w-12 h-12 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            } flex items-center justify-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {isConnected
                ? `Connected: ${formatAddress(account)}`
                : 'Not connected to MetaMask'}
            </p>
            {isConnected && chainId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Network: {getNetworkName(chainId)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43.96 0 1.46.25 1.78.58.21.22.51.32.89.32.39 0 .69-.11.91-.32.33-.33.84-.58 1.81-.58 1.31 0 2.1 0.59 2.1 1.43 0 .73-.57 1.22-2.34 1.67-1.77.45-2.34.94-2.34 1.67 0 .84.79 1.43 2.1 1.43.96 0 1.46-.25 1.78-.58.21-.22.51-.32.89-.32.39 0 .69.11.91-.32.33.33.84.58 1.81.58 1.31 0 2.1-.59 2.1-1.43 0-.73-.57-1.22-2.34-1.67V7.06c1.77-.45 2.34-.94 2.34-1.67 0-.84-.79-1.43-2.1-1.43-.96 0-1.46.25-1.78.58-.21.22-.51.32-.89.32-.39 0-.69-.11-.91-.32-.33-.33-.84-.58-1.81-.58-1.31 0-2.1.59-2.1 1.43 0 .73.57 1.22 2.34 1.67v1.97c-1.77.45-2.34.94-2.34 1.67z" />
              </svg>
              Connect MetaMask
            </button>
          ) : (
            <button
              onClick={disconnectWallet}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">About this feature:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Connect your company wallet to manage employee salary delegations</li>
          <li>Securely delegate token access to employees as part of their compensation</li>
          <li>All transactions are recorded on the blockchain for transparency</li>
        </ul>
      </div>
    </div>
  );
};

export default WalletConnection;