import Image from "next/image";
import WalletConnection from './components/WalletConnection';
import TokenDelegation from './components/TokenDelegation';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-6xl flex flex-col items-center justify-between py-8">
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="flex items-center mb-6 md:mb-0">
            <Image
              className="dark:invert mr-4"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              My Salary App
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center md:text-right">
            Secure salary management with MetaMask
          </p>
        </div>

        <div className="w-full flex flex-col gap-12">
          <div className="w-full flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                Company Wallet Connection
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                Connect your company wallet to securely delegate token access to employees as part of their compensation.
              </p>
              <div className="w-full max-w-md">
                <WalletConnection />
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Connect Wallet</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Connect your company's MetaMask wallet to the platform
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Configure Delegations</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Set up token delegations for your employees as part of their salary
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Manage Access</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Control and monitor token access permissions for each employee
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg mt-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
                <p className="text-blue-100">
                  All salary delegations are recorded on the blockchain for complete transparency and security.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Employee Token Delegation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-2xl">
              Authorize periodic token transfers to your employees' wallets as part of their salary compensation.
            </p>
            <div className="w-full">
              <TokenDelegation />
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} My Salary App. Secure salary management with MetaMask.</p>
        </footer>
      </main>
    </div>
  );
}
