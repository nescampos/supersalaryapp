'use client';

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  requestPeriodicTransferPermission,
  isAccountUpgraded,
  createTransferCalldata
} from '../services/tokenDelegationService';

const TokenDelegation = () => {
  const { account, isConnected } = useWallet();
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('86400'); // 1 día en segundos
  const [duration, setDuration] = useState('604800'); // 1 semana en segundos
  const [isDelegating, setIsDelegating] = useState(false);
  const [delegationResult, setDelegationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelegation = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!employeeAddress || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    setIsDelegating(true);
    setError(null);

    try {
      // Verificar si la cuenta está actualizada a Smart Account
      const isUpgraded = await isAccountUpgraded(account!);
      if (!isUpgraded) {
        throw new Error('Your account needs to be upgraded to a Smart Account to use this feature. Please update your MetaMask to the latest version.');
      }

      // Solicitar permisos de transferencia periódica
      const permissions = await requestPeriodicTransferPermission(
        employeeAddress,
        amount,
        parseInt(period),
        parseInt(duration)
      );

      setDelegationResult({
        success: true,
        message: `Successfully delegated ${amount} USDC to ${employeeAddress} every ${parseInt(period)/86400} days for ${parseInt(duration)/86400} days`,
        permissions: permissions
      });
    } catch (err: any) {
      console.error('Delegation error:', err);
      setError(err.message || 'Failed to delegate tokens. Please make sure you have MetaMask Flask installed and your account is upgraded to a Smart Account.');
    } finally {
      setIsDelegating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        USDC Delegation for Employees
      </h2>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How it works:</h3>
        <ul className="text-blue-700 dark:text-blue-300 text-sm list-disc pl-5 space-y-1">
          <li>Authorize the app to send USDC to your employees on your behalf</li>
          <li>Set the amount, frequency, and duration of the transfers</li>
          <li>All transfers are recorded on Base Sepolia for transparency</li>
          <li>You maintain full control and can revoke permissions anytime</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {delegationResult && delegationResult.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          <p>{delegationResult.message}</p>
          <p className="text-xs mt-1">Permissions granted successfully</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Employee Wallet Address
          </label>
          <input
            type="text"
            value={employeeAddress}
            onChange={(e) => setEmployeeAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount per Period (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Period (seconds)
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="3600">1 Hour</option>
              <option value="86400">1 Day</option>
              <option value="604800">1 Week</option>
              <option value="2592000">1 Month (30 days)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (seconds)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="604800">1 Week</option>
            <option value="2592000">1 Month</option>
            <option value="7776000">3 Months</option>
            <option value="15552000">6 Months</option>
            <option value="31104000">1 Year</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleDelegation}
            disabled={isDelegating || !isConnected}
            className={`w-full py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
              isDelegating || !isConnected
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isDelegating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Delegate USDC'
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-medium mb-2">Important Information:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>You retain full control over your USDC and can revoke permissions anytime</li>
          <li>All delegations are recorded on Base Sepolia for transparency</li>
          <li>Only authorize amounts you're comfortable with being transferred</li>
          <li>Make sure the employee address is correct before confirming</li>
          <li>You need MetaMask Flask 13.5.0+ and a Smart Account to use this feature</li>
          <li>Using USDC on Base Sepolia network (chainId: 84532)</li>
        </ul>
      </div>
    </div>
  );
};

export default TokenDelegation;