import React, { useState } from 'react';
import { Heart, CreditCard } from 'lucide-react';
import ParticleAnimation from './ParticleAnimation';

interface DonationButtonProps {
  onDonate: (amount: number) => void;
}

const DonationButton: React.FC<DonationButtonProps> = ({ onDonate }) => {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [showParticles, setShowParticles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const amounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = () => {
    setIsAnimating(true);
    setShowParticles(true);
    
    setTimeout(() => {
      onDonate(selectedAmount);
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <ParticleAnimation 
        trigger={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Faire un don
        </h3>
        <p className="text-gray-600">
          Votre générosité transforme des vies
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {amounts.map(amount => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold hover:scale-105 ${
              selectedAmount === amount
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-3">
          Montant personnalisé
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
          <input
            type="number"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(Number(e.target.value))}
            className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-semibold"
            min="1"
            placeholder="Entrez un montant"
          />
        </div>
      </div>

      <button
        onClick={handleDonate}
        disabled={isAnimating}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${
          isAnimating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
        }`}
      >
        {isAnimating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Traitement en cours...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Donner ${selectedAmount}</span>
          </>
        )}
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          🔒 Paiement sécurisé • 100% des fonds vont aux projets
        </p>
      </div>
    </div>
  );
};

export default DonationButton;