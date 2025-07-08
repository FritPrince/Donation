import  { useState } from 'react';
import { Globe, TrendingUp, Users, Shield, Award } from 'lucide-react';
import Globe3D from './components/Globe3D';
import DonationButton from './components/DonationButton';
import CounterWithConfetti from './components/CounterWithConfetti';
import FundsMap from './components/FundsMap';
import ImpactStats from './components/ImpactStats';

function App() {
  const [totalDonations, setTotalDonations] = useState(87500);
  const [targetAmount] = useState(100000);
  const [, setShowCelebration] = useState(false);

  const donationLocations = [
    { lat: 40.7128, lng: -74.0060, amount: 5000, project: "Education NYC" },
    { lat: 34.0522, lng: -118.2437, amount: 3000, project: "Clean Water LA" },
    { lat: 51.5074, lng: -0.1278, amount: 7500, project: "Housing London" },
    { lat: -33.8688, lng: 151.2093, amount: 4200, project: "Environment Sydney" },
    { lat: 35.6762, lng: 139.6503, amount: 6300, project: "Disaster Relief Tokyo" }
  ];

  const fundsDistribution = [
    { region: "Éducation", amount: 35000, color: "#3B82F6", position: { x: -2, y: 0, z: 1 } },
    { region: "Santé", amount: 28000, color: "#EF4444", position: { x: 0, y: 0, z: 1 } },
    { region: "Environnement", amount: 24500, color: "#10B981", position: { x: 2, y: 0, z: 1 } },
    { region: "Infrastructure", amount: 15000, color: "#F59E0B", position: { x: -1, y: 0, z: -1 } },
    { region: "Urgence", amount: 12000, color: "#8B5CF6", position: { x: 1, y: 0, z: -1 } }
  ];

  const impactStats = {
    peopleHelped: 12450,
    treesPlanted: 8930,
    waterProvided: 156000,
    homesBuilt: 45
  };

  const handleDonate = (amount: number) => {
    setTotalDonations(prev => prev + amount);
  };

  const handleTargetReached = () => {
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">DonationTracker</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#impact" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Impact</a>
              <a href="#donate" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Donner</a>
              <a href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Statistiques</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">À propos</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Shield className="w-4 h-4" />
              <span>Transparence totale • Impact mesurable</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              Visualisez l'impact de
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}vos dons
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
              Suivez en temps réel comment vos contributions transforment des vies à travers le monde avec une transparence totale
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                Commencer à donner
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-8 py-4 font-semibold transition-colors duration-200">
                Voir l'impact →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">12,450+</h3>
              <p className="text-gray-600">Personnes aidées</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600">Fonds directement alloués</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5 étoiles</h3>
              <p className="text-gray-600">Note de transparence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section id="impact" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Impact Mondial</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez notre globe interactif pour voir où vos dons créent un impact réel
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                {donationLocations.map((location, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{location.project}</h4>
                      <p className="text-sm text-gray-600">Impact: ${location.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-green-600 font-semibold">
                      ${location.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <Globe3D donations={donationLocations} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-20 bg-gray-50 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Objectif de Financement</h2>
            <p className="text-xl text-gray-600">Ensemble, nous approchons de notre objectif</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <CounterWithConfetti 
              current={totalDonations} 
              target={targetAmount} 
              onTargetReached={handleTargetReached}
            />
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Faire un Don</h2>
            <p className="text-xl text-gray-600">Chaque contribution compte pour créer un impact durable</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <DonationButton onDonate={handleDonate} />
          </div>
        </div>
      </section>

      {/* 3D Funds Visualization */}
      <section className="py-20 bg-gray-50 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Répartition des Fonds</h2>
            <p className="text-xl text-gray-600">Visualisation transparente de l'allocation des dons</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <FundsMap distributions={fundsDistribution} />
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {fundsDistribution.map((dist, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-3"
                    style={{ backgroundColor: dist.color }}
                  />
                  <div className="font-semibold text-gray-900 text-sm">{dist.region}</div>
                  <div className="text-gray-600 text-sm">${dist.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="stats" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Impact Réalisé</h2>
            <p className="text-xl text-gray-600">Résultats concrets de vos contributions</p>
          </div>
          
          <ImpactStats stats={impactStats} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de donateurs qui transforment le monde, un don à la fois
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
              Commencer maintenant
            </button>
            <button className="text-white border border-white/30 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-200">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">DonationTracker</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Plateforme de dons transparente qui vous permet de suivre l'impact réel de vos contributions à travers le monde.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Projets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Transparence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rapports</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 DonationTracker. Tous droits réservés. Plateforme certifiée pour la transparence des dons.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;