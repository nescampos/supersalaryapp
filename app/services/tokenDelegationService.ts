'use client';

import { createWalletClient, custom } from 'viem';
import { erc7715ProviderActions } from '@metamask/smart-accounts-kit/actions';
import { createPublicClient, http, Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { toMetaMaskSmartAccount, Implementation } from '@metamask/smart-accounts-kit';
import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import { getSmartAccountsEnvironment } from '@metamask/smart-accounts-kit';

// Definición de Base Sepolia como una cadena personalizada
export const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://sepolia.basescan.org',
    },
  },
};

// Cliente de wallet para solicitar permisos
export const getWalletClient = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return createWalletClient({
      transport: custom(window.ethereum),
    }).extend(erc7715ProviderActions());
  }
  throw new Error('Ethereum provider not available');
};

// Cliente público para interactuar con la blockchain
export const getPublicClient = () => {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
};

// Verificar si la cuenta está actualizada a Smart Account
export const isAccountUpgraded = async (address: string) => {
  const publicClient = getPublicClient();
  
  const code = await publicClient.getCode({
    address: address as `0x${string}`,
  });

  if (code) {
    const delegatorAddress = `0x${code.substring(8)}`;
    const statelessDelegatorAddress = getSmartAccountsEnvironment(baseSepolia.id)
      .implementations
      .EIP7702StatelessDeleGatorImpl;

    return delegatorAddress.toLowerCase() === statelessDelegatorAddress.toLowerCase();
  }
  
  return false;
};

// Crear cuenta de sesión para la delegación
export const createSessionAccount = async () => {
  // En una implementación real, esta clave privada debería estar protegida
  // y posiblemente generada dinámicamente para cada sesión
  const privateKey = process.env.NEXT_PUBLIC_SESSION_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Clave privada de ejemplo para desarrollo
  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const sessionAccount = await toMetaMaskSmartAccount({
    client: getPublicClient(),
    implementation: Implementation.Hybrid,
    deployParams: [account.address, [], [], []],
    deploySalt: "0x",
    signer: { account },
  });

  return sessionAccount;
};

// Solicitar permisos de transferencia periódica
export const requestPeriodicTransferPermission = async (
  employeeAddress: string,
  amount: string,
  periodDuration: number,
  duration: number
) => {
  const walletClient = getWalletClient();
  const sessionAccount = await createSessionAccount();
  
  // Convertir la cantidad a formato Wei con 6 decimales (para USDC)
  const periodAmount = parseUnits(amount, 6);
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expiry = currentTime + duration;

  try {
    const grantedPermissions = await walletClient.requestExecutionPermissions([{
      chainId: baseSepolia.id,
      expiry,
      signer: {
        type: "account",
        data: {
          address: sessionAccount.address,
        },
      },
      permission: {
        type: "erc20-token-periodic",
        data: {
          tokenAddress: '0x036cbd53842c5426634e7929541ec2318f3dcf7e' as `0x${string}`, // USDC en Base Sepolia
          periodAmount,
          periodDuration,
          justification: `Permission to transfer ${amount} USDC to ${employeeAddress} every ${periodDuration/86400} days`,
        },
      },
      isAdjustmentAllowed: true,
    }]);

    return grantedPermissions;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    throw error;
  }
};

// Configurar calldata para la transferencia de tokens
export const createTransferCalldata = (recipient: string, amount: string) => {
  // Convertir la cantidad a formato Wei con 6 decimales (para USDC)
  const parsedAmount = parseUnits(amount, 6);
  
  return encodeFunctionData({
    abi: erc20Abi,
    args: [recipient as `0x${string}`, parsedAmount],
    functionName: 'transfer',
  });
};

// Función para convertir la cuenta a Smart Account
export const upgradeToSmartAccount = async (signerAddress: string) => {
  const walletClient = getWalletClient();
  const publicClient = getPublicClient();

  try {
    // Crear la Smart Account con el signer actual
    const smartAccount = await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Stateless7702,
      address: signerAddress as `0x${string}`, // Address of the upgraded EOA
      signer: { walletClient },
    });

    return {
      success: true,
      smartAccountAddress: smartAccount.address,
      message: 'Smart Account created successfully'
    };
  } catch (error) {
    console.error('Error upgrading to Smart Account:', error);
    throw error;
  }
};