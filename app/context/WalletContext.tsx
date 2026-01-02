'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';

interface WalletContextType {
  account: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  error: string | null;
  isInitialized: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [ethereum, setEthereum] = useState<any>(null);

  // Inicializar MetaMask SDK solo en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const init = async () => {
        try {
          const MMSDK = new MetaMaskSDK({
            dappMetadata: {
              name: "My Salary App",
              url: window.location.href,
            },
            // Opciones adicionales según sea necesario
            preferDesktop: false,
            shouldShimWeb3: true,
          });

          // Esperar a que el SDK esté listo
          await MMSDK.init();

          const provider = MMSDK.getProvider();
          setEthereum(provider);
          setIsInitialized(true);

          // Manejar eventos de conexión/desconexión
          if (provider) {
            const handleAccountsChanged = (accounts: string[]) => {
              if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsConnected(true);
                setError(null);
              } else {
                setAccount(null);
                setIsConnected(false);
              }
            };

            const handleChainChanged = (chainId: string) => {
              setChainId(chainId);
            };

            const handleConnect = () => {
              console.log('Connected to MetaMask');
            };

            const handleDisconnect = (error: any) => {
              console.log('Disconnected from MetaMask', error);
              setAccount(null);
              setIsConnected(false);
            };

            // Event listeners
            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);
            provider.on('connect', handleConnect);
            provider.on('disconnect', handleDisconnect);

            // Verificar si ya hay una cuenta conectada
            const checkExistingConnection = async () => {
              try {
                if (provider && provider.selectedAddress) {
                  setAccount(provider.selectedAddress);
                  setIsConnected(true);
                  setChainId(provider.chainId);
                }
              } catch (err) {
                console.error('Error checking existing connection:', err);
              }
            };

            checkExistingConnection();

            // Cleanup
            return () => {
              if (provider) {
                provider.removeListener('accountsChanged', handleAccountsChanged);
                provider.removeListener('chainChanged', handleChainChanged);
                provider.removeListener('connect', handleConnect);
                provider.removeListener('disconnect', handleDisconnect);
              }
            };
          }
        } catch (err) {
          console.error('Error initializing MetaMask SDK:', err);
          setError('Failed to initialize MetaMask SDK');
          setIsInitialized(false);
        }
      };

      init();
    }
  }, []);

  const connectWallet = async () => {
    try {
      setError(null);
      if (!ethereum) {
        setError('MetaMask is not available');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);

        // Obtener el chainId actual
        const currentChainId = await ethereum.request({
          method: 'eth_chainId',
        }) as string;
        setChainId(currentChainId);
      }
    } catch (err: any) {
      console.error('Error connecting to wallet:', err);
      setError(err.message || 'Failed to connect to wallet');
      setIsConnected(false);
    }
  };

  const disconnectWallet = () => {
    if (ethereum) {
      // No hay un método directo de desconexión, así que simplemente reiniciamos el estado
      setAccount(null);
      setChainId(null);
      setIsConnected(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        connectWallet,
        disconnectWallet,
        isConnected,
        error,
        isInitialized,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};