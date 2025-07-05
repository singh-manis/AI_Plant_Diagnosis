import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Animated Plant SVG with gentle sway
const PlantHeroSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 drop-shadow-xl animate-plant-sway">
    <ellipse cx="60" cy="100" rx="38" ry="10" fill="#A7F3D0" fillOpacity="0.4" />
    <path d="M60 100C60 80 80 70 100 60C80 60 60 80 60 100Z" fill="#6EE7B7" />
    <path d="M60 100C60 80 40 70 20 60C40 60 60 80 60 100Z" fill="#34D399" />
    <path d="M60 100C60 80 70 50 90 30C70 40 60 80 60 100Z" fill="#059669" />
    <path d="M60 100C60 80 50 50 30 30C50 40 60 80 60 100Z" fill="#10B981" />
    <circle cx="60" cy="60" r="18" fill="#FDE68A" stroke="#F59E42" strokeWidth="3" />
    <circle cx="60" cy="60" r="10" fill="#F59E42" />
  </svg>
);

// Floating plant emojis for background
const floatingPlants = [
  { emoji: '🌱', size: 40, left: '10%', top: '20%', delay: '0s' },
  { emoji: '🌸', size: 32, left: '80%', top: '30%', delay: '1s' },
  { emoji: '🌿', size: 36, left: '20%', top: '70%', delay: '2s' },
  { emoji: '🌺', size: 28, left: '70%', top: '80%', delay: '0.5s' },
  { emoji: '🍃', size: 30, left: '50%', top: '10%', delay: '1.5s' },
  { emoji: '🌻', size: 34, left: '60%', top: '60%', delay: '2.5s' },
];

const LandingPage = () => {
  const { user } = useAuth() || {};

  // Fade-in on scroll for features/stats
  useEffect(() => {
    const fadeEls = document.querySelectorAll('.fadein-on-scroll');
    const onScroll = () => {
      fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add('opacity-100', 'translate-y-0');
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-lime-200 via-green-200 to-emerald-300">
        {/* Subtle plant pattern */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-30 z-0">
          <svg width="100%" height="100%" className="absolute inset-0" style={{minHeight:'100vh'}}>
            <defs>
              <pattern id="plantdots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#6EE7B7" />
                <circle cx="50" cy="50" r="1.5" fill="#A7F3D0" />
                <rect x="30" y="30" width="4" height="4" rx="2" fill="#FDE68A" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#plantdots)" />
          </svg>
        </div>
        {/* Floating plant emojis */}
        {floatingPlants.map((p, i) => (
          <span
            key={i}
            className="pointer-events-none select-none absolute animate-float-plant"
            style={{
              left: p.left,
              top: p.top,
              fontSize: p.size,
              animationDelay: p.delay,
              opacity: 0.18,
              zIndex: 1
            }}
          >{p.emoji}</span>
        ))}
        {/* Plant SVG Illustration */}
        <div className="relative z-10 pt-16 pb-8 flex flex-col items-center justify-center">
          <PlantHeroSVG />
          <div className="text-center">
            {user && (
              <div className="text-lg text-green-700 mb-2 animate-fade-in">Welcome back, <span className="font-bold text-yellow-500">{user.name || user.email || 'Gardener'}</span>!</div>
            )}
            <h1 className="text-5xl md:text-7xl font-extrabold text-emerald-900 mb-4 leading-tight drop-shadow-xl animate-gradient-text">
              Discover the
              <span className="block font-extrabold animate-gradient-text-glow">Magic of Plants</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-800 mb-6 max-w-3xl mx-auto leading-relaxed">
              "The love of gardening is a seed once sown that never dies."
              <span className="block text-lg mt-2 text-emerald-600">- Gertrude Jekyll</span>
            </p>
            <p className="text-lg text-emerald-900 mb-10 max-w-2xl mx-auto">
              Transform your space into a thriving garden with AI-powered plant care,
              smart reminders, and expert guidance. Your plants deserve the best care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                aria-label="Start Growing Today"
                className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 animate-fade-in animate-pulse-cta"
              >
                <span className="inline-block mr-2 animate-bounce">🌱</span> Start Growing Today
              </Link>
              <Link
                to="/login"
                aria-label="Sign In"
                className="border-2 border-emerald-700 text-emerald-900 hover:bg-emerald-100 hover:text-emerald-800 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-fade-in"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        {/* SVG Wave Transition */}
        <div className="w-full overflow-hidden leading-none -mb-1" style={{height:'60px'}}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 0h1440v30c-120 20-360 40-720 40S120 50 0 30V0z" fill="#18181b" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-zinc-900 fadein-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-100 mb-4">
              Everything Your Plants Need
            </h2>
            <p className="text-xl text-emerald-300 max-w-3xl mx-auto">
              From AI-powered identification to smart care reminders, we've got your garden covered
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards - add more color and icons */}
            <div className="bg-white/90 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mb-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">AI Plant Assistant</h3>
              <p className="text-emerald-700 mb-4">
                Get instant plant identification, disease detection, and personalized care advice powered by advanced AI.
              </p>
              <div className="flex items-center text-emerald-500 font-semibold">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mb-8">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Smart Reminders</h3>
              <p className="text-emerald-700 mb-4">
                Never forget to water, fertilize, or care for your plants with intelligent scheduling and notifications.
              </p>
              <div className="flex items-center text-emerald-500 font-semibold">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mb-8">
              <div className="text-4xl mb-4">🌤️</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Weather Smart</h3>
              <p className="text-emerald-700 mb-4">
                Get local weather updates and care recommendations tailored to your climate and conditions.
              </p>
              <div className="flex items-center text-emerald-500 font-semibold">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mb-8">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Plant Diary</h3>
              <p className="text-emerald-700 mb-4">
                Track your gardening journey with detailed notes, photos, and progress updates for each plant.
              </p>
              <div className="flex items-center text-emerald-500 font-semibold">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mb-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Grow Together</h3>
              <p className="text-emerald-700 mb-4">
                Connect with fellow gardeners, share tips, and celebrate your growing achievements together.
              </p>
              <div className="flex items-center text-emerald-500 font-semibold">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mb-8">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Expert Care</h3>
              <p className="text-emerald-700 mb-4">
                Access comprehensive care guides, troubleshooting tips, and expert advice for every plant type.
              </p>
              <div className="flex items-center text-emerald-500 font-semibold">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-green-400 to-emerald-400 fadein-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-900 mb-2">10,000+</div>
              <div className="text-emerald-800">Happy Gardeners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-900 mb-2">50,000+</div>
              <div className="text-emerald-800">Plants Cared For</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-900 mb-2">99%</div>
              <div className="text-emerald-800">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-zinc-900 fadein-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-100 mb-6">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-xl text-emerald-300 mb-8">
            Join thousands of gardeners who are already growing their green paradise with AI-powered care.
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 animate-pulse-cta"
          >
            <span className="inline-block mr-2 animate-bounce">🌱</span> Get Started
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes plant-sway {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.04); }
        }
        .animate-plant-sway { animation: plant-sway 3.5s ease-in-out infinite; }
        @keyframes float-plant {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-float-plant { animation: float-plant 6s ease-in-out infinite; }
        @keyframes gradient-text {
          0% { color: #fde68a; }
          50% { color: #f59e42; }
          100% { color: #fde68a; }
        }
        .animate-gradient-text-glow {
          animation: gradient-text 2.5s ease-in-out infinite alternate;
          text-shadow: 0 0 32px #fde68a, 0 0 8px #f59e42;
        }
        .animate-gradient-text {
          animation: gradient-text 2.5s ease-in-out infinite alternate;
        }
        @keyframes pulse-cta {
          0%, 100% { box-shadow: 0 0 0 0 #fde68a44; }
          50% { box-shadow: 0 0 0 12px #fde68a22; }
        }
        .animate-pulse-cta:hover, .animate-pulse-cta:focus {
          animation: pulse-cta 1.2s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(.4,0,.6,1) both; }
      `}</style>
    </div>
  );
};

export default LandingPage; 