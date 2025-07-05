import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const categoryAccent = {
  'Indoor Plants': 'border-emerald-400',
  'Succulents': 'border-orange-400',
  'Flowering Plants': 'border-pink-400',
  'Herbs': 'border-green-400',
  'Tropical Plants': 'border-yellow-400',
  'Air Plants': 'border-cyan-400',
};

const PlantShowcase = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [quotesVisible, setQuotesVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100); // slight delay for effect
    setTimeout(() => setCategoriesVisible(true), 300);
    setTimeout(() => setQuotesVisible(true), 600);
  }, []);

  const plantQuotes = [
    {
      quote: "The love of gardening is a seed once sown that never dies.",
      author: "Gertrude Jekyll",
      image: "🌱"
    },
    {
      quote: "To plant a garden is to believe in tomorrow.",
      author: "Audrey Hepburn",
      image: "🌸"
    },
    {
      quote: "The glory of gardening: hands in the dirt, head in the sun, heart with nature.",
      author: "Alfred Austin",
      image: "🌿"
    },
    {
      quote: "Gardening is the art that uses flowers and plants as paint, and the soil and sky as canvas.",
      author: "Elizabeth Murray",
      image: "🌺"
    },
    {
      quote: "Plants are the young of the world, vessels of health and vigor.",
      author: "Ralph Waldo Emerson",
      image: "🌳"
    }
  ];

  const plantCategories = [
    {
      name: "Indoor Plants",
      description: "Perfect for home and office spaces",
      icon: "🏠",
      color: "from-emerald-600 to-teal-600",
      bgColor: "from-emerald-900/20 to-teal-900/20",
      more: "Indoor plants purify air and add a touch of nature to your living space. Popular choices include pothos, snake plant, and peace lily."
    },
    {
      name: "Succulents",
      description: "Low maintenance, high beauty",
      icon: "🌵",
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-900/20 to-red-900/20",
      more: "Succulents store water in their leaves, making them drought-tolerant and easy to care for. Great for beginners!"
    },
    {
      name: "Flowering Plants",
      description: "Add color and fragrance to your space",
      icon: "🌹",
      color: "from-pink-600 to-purple-600",
      bgColor: "from-pink-900/20 to-purple-900/20",
      more: "Flowering plants like roses, orchids, and hibiscus bring vibrant colors and pleasant scents to your home or garden."
    },
    {
      name: "Herbs",
      description: "Fresh flavors for your kitchen",
      icon: "🌿",
      color: "from-green-600 to-emerald-600",
      bgColor: "from-green-900/20 to-emerald-900/20",
      more: "Herbs such as basil, mint, and rosemary are easy to grow and perfect for cooking. Enjoy fresh flavors year-round!"
    },
    {
      name: "Tropical Plants",
      description: "Exotic beauty for your home",
      icon: "🌴",
      color: "from-yellow-600 to-orange-600",
      bgColor: "from-yellow-900/20 to-orange-900/20",
      more: "Tropical plants thrive in warm, humid environments. Try monstera, bird of paradise, or calathea for a lush look."
    },
    {
      name: "Air Plants",
      description: "Unique plants that need no soil",
      icon: "☁️",
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-900/20 to-cyan-900/20",
      more: "Air plants absorb moisture and nutrients from the air. Display them in creative ways—no soil required!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-emerald-600 text-white px-4 py-2 rounded z-50">Skip to main content</a>
      <div id="main-content" role="main">
        <section role="region" aria-labelledby="hero-heading">
          {/* Hero Section */}
          <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/30">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🌱</div>
            <div className="absolute top-40 right-20 text-4xl opacity-20 animate-pulse">🌸</div>
            <div className="absolute bottom-20 left-1/4 text-5xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}>🌿</div>
            <div className="absolute bottom-40 right-1/3 text-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}>🌺</div>

            <div className="relative w-full max-w-7xl px-2 sm:px-4 lg:px-8 max-w-full">
              <div className="text-center">
                <h1
                  id="hero-heading"
                  className={`text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-loose px-2 break-words transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  Discover the
                  <span className={`block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent break-words pt-1 pb-4 transition-all duration-700 delay-150 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Magic of Plants
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  "Plants are the young of the world, vessels of health and vigor."
                  <span className="block text-sm sm:text-lg mt-2 text-gray-400">- Ralph Waldo Emerson</span>
                </p>
                <p className="text-sm sm:text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                  Explore the beauty and diversity of nature's most amazing creations. 
                  Each plant tells a story of growth, resilience, and life.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center w-full">
                  <Link
                    to="/plants"
                    aria-label="Explore all plants"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Explore Plants
                  </Link>
                  <Link
                    to="/dashboard"
                    aria-label="Go back to dashboard"
                    className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shadow hover:shadow-xl"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section role="region" aria-labelledby="categories-heading" className="py-10 sm:py-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 id="categories-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Plant Categories
              </h2>
              <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Discover different types of plants and find the perfect ones for your space
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {plantCategories.map((category, index) => (
                <div
                  key={index}
                  tabIndex={0}
                  className={`bg-gradient-to-br ${category.bgColor} p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl hover:scale-105 hover:bg-opacity-90 transition-all duration-300 transform group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
                    transition-all duration-700 ${categoriesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-center">
                    <div className={`text-4xl sm:text-6xl mb-4 group-hover:animate-bounce group-active:animate-pulse transition-transform duration-300 flex justify-center`}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-3">{category.name}</h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-6">{category.description}</p>
                    <button
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shadow-lg hover:shadow-xl`}
                      onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                      aria-label={expandedCategory === index ? `Hide details about ${category.name}` : `Learn more about ${category.name}`}
                      aria-expanded={expandedCategory === index}
                      aria-controls={`category-details-${index}`}
                    >
                      {expandedCategory === index ? 'Hide' : 'Learn More'}
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-300 ${expandedCategory === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      id={`category-details-${index}`}
                      className={`transition-all duration-300 overflow-hidden ${expandedCategory === index ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                      aria-live="polite"
                    >
                      {expandedCategory === index && (
                        <div className={`flex items-start bg-gradient-to-br from-white/10 to-black/30 backdrop-blur border-l-4 ${categoryAccent[category.name]} shadow-xl rounded-xl p-3 sm:p-4 mt-2`}> 
                          <div className="flex-1 text-left">
                            <div className="text-base sm:text-lg font-bold text-white mb-1">{category.name}</div>
                            <div className="text-gray-200 text-xs sm:text-sm">{category.more}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section role="region" aria-labelledby="quotes-heading" className="py-10 sm:py-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 id="quotes-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Words of Wisdom
              </h2>
              <p className="text-base sm:text-xl text-gray-400">
                Inspiring quotes about the beauty of plants and gardening
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {plantQuotes.map((quote, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 sm:p-8 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl hover:scale-105 hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1
                    transition-all duration-700 ${quotesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl mb-4" aria-hidden="true">{quote.image}</div>
                    <blockquote className="text-base sm:text-lg text-gray-300 mb-4 italic">
                      "{quote.quote}"
                    </blockquote>
                    <cite className="text-emerald-400 font-semibold text-sm sm:text-base">— {quote.author}</cite>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section role="region" aria-labelledby="tips-heading" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Essential Care Tips
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Basic principles for keeping your plants healthy and thriving
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-2xl border border-blue-700/30 text-center">
                <div className="text-4xl mb-4">💧</div>
                <h3 className="text-xl font-bold text-white mb-2">Watering</h3>
                <p className="text-gray-400">Water when soil feels dry to the touch</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6 rounded-2xl border border-yellow-700/30 text-center">
                <div className="text-4xl mb-4">☀️</div>
                <h3 className="text-xl font-bold text-white mb-2">Light</h3>
                <p className="text-gray-400">Provide appropriate light for each plant type</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-2xl border border-green-700/30 text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-white mb-2">Soil</h3>
                <p className="text-gray-400">Use well-draining, nutrient-rich soil</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-2xl border border-purple-700/30 text-center">
                <div className="text-4xl mb-4">🌡️</div>
                <h3 className="text-xl font-bold text-white mb-2">Temperature</h3>
                <p className="text-gray-400">Maintain consistent, appropriate temperatures</p>
              </div>
            </div>
          </div>
        </section>
        <section role="region" aria-labelledby="cta-heading" className="py-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Plant Journey?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of plant lovers who are already growing their green paradise
            </p>
            <Link
              to="/plants/add"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
            >
              Add Your First Plant
            </Link>
          </div>
        </section>
      </div>
      <footer className="bg-black/50 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl mb-4">🌱 AI Plant Platform</div>
            <p className="text-gray-400 mb-6">
              "The glory of gardening: hands in the dirt, head in the sun, heart with nature."
            </p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <span>© 2024 AI Plant Platform</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlantShowcase; 