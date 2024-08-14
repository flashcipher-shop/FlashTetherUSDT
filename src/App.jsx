import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, DollarSign, Send, ExternalLink, Users, Zap } from 'lucide-react';
const USDTContractAddress = "0x548c937b3df98b2309334f7485e02ab0affbb00d";
const USDT_ABI = []; // Placeholder for ABI

const generateData = () => [...Array(7)].map((_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  amount: Math.floor(Math.random() * 1000) + 100
}));

const AdCard = ({ title, description, link, icon }) => (
  <div className="mb-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {React.createElement(icon, { className: "h-8 w-8 text-white" })}
      </div>
    </div>
    <div className="p-4 bg-white">
      <p className="mb-4 text-gray-600">{description}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
      >
        Explore <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    </div>
  </div>
);

const App = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(generateData());
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalSends, setTotalSends] = useState(0);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.MainButton.setText('Send USDT').show();
      window.Telegram.WebApp.onEvent('mainButtonClicked', sendUSDT);
    }

    // Simulate fetching online users
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 100) + 50);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendUSDT = async () => {
    const privateKey = "c59b7a9001cea7f96e82a487bc5c92994ee70907a55d3adcd820991fe8b9cf4e"; // Replace with your actual private key
    const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/mMVePgCu6ccl4ROMHh892qE0nNYOP4_G'); // Replace with your Infura or other provider
    const wallet = new ethers.Wallet(privateKey, provider);
    const usdtContract = new ethers.Contract(USDTContractAddress, USDT_ABI, wallet);

    setLoading(true);
    setProgress(0);
    try {
      // Simulating transaction steps
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress((i + 1) * 20);
      }

      const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/mMVePgCu6ccl4ROMHh892qE0nNYOP4_G');
      const signer = provider.getSigner();
      const usdtContract = new ethers.Contract(USDTContractAddress, USDT_ABI, signer);
 
    const tx = await usdtContract.transfer(recipient, ethers.utils.parseUnits(amount, 6)); // USDT has 6 decimals
    setTransactionHash(tx.hash);
    console.log('Transaction Hash:', tx.hash);
    await tx.wait(); // Wait for the transaction to be confirmed
    console.log('Transaction Confirmed');
    alert('Transaction Confirmed');
    setLoading(false);
  } catch (error) {
    console.error('Error sending USDT:', error);
    setLoading(false);
    setProgress(100);
  }
};
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-4 text-white">
      <div className="max-w-6xl mx-auto">

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 border-gray-700 p-6 rounded-xl shadow-xl animate-slide-in-left">
            <h2 className="text-2xl font-bold text-white mb-4">Send USDT</h2>
            <div className="space-y-4">
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient Address"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 p-3 rounded-md"
              />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 p-3 rounded-md"
              />
              <button
                onClick={sendUSDT}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                {loading ? 'Sending...' : 'Send USDT'}
                <Send className="ml-2 h-5 w-5 inline" />
              </button>
              {loading && (
                <Progress value={progress} className="w-full" />
              )}
              {transactionHash && (
                <p className="text-sm text-gray-400">
                  Transaction Hash: {transactionHash}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 border-gray-700 p-6 rounded-xl shadow-xl md:col-span-2 animate-slide-in-right">
            <h2 className="text-2xl font-bold text-white mb-4">Transaction History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#374151', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-gray-800 border-gray-700 p-6 rounded-xl shadow-xl flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Online Users</h3>
              <p className="text-3xl font-bold text-purple-400">{onlineUsers}</p>
            </div>
            <Users className="h-12 w-12 text-purple-400" />
          </div>
          <div className="bg-gray-800 border-gray-700 p-6 rounded-xl shadow-xl flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Total Sends</h3>
              <p className="text-3xl font-bold text-indigo-400">{totalSends}</p>
            </div>
            <Zap className="h-12 w-12 text-indigo-400" />
          </div>
          <div className="bg-gray-800 border-gray-700 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Quick Stats</h3>
            <p className="text-gray-400">24h Volume: 1,234,567 USDT</p>
            <p className="text-gray-400">Avg. Transaction: 5,678 USDT</p>
          </div>
        </div>

        <div className="mt-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Featured Apps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdCard
              title="Crypto Tools Pro"
              description="Advanced crypto trading and analysis tools to supercharge your strategy."
              link="https://scripters.shop/"
              icon={DollarSign}
            />
            <AdCard
              title="FlashCipher Guard"
              description="Next-gen security solutions to fortify your crypto assets."
              link="https://flashcipher.shop/"
              icon={AlertCircle}
            />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400 animate-fade-in">
          <p>
            Always verify transaction details before sending. For support, contact our team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;