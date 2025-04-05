import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Contact, 
  Info, 
  Star, 
  Rocket, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  Shield,
  Globe,
  TrendingUp,
  BookOpen
} from 'lucide-react';

const PlacementPlatformHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Feature Cards Data
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-purple-600" />,
      title: "AI-Powered Assessment",
      description: "Advanced algorithms to evaluate talent potential",
      color: "bg-purple-50"
    },
    {
      icon: <Globe className="w-12 h-12 text-green-600" />,
      title: "Global Talent Mapping",
      description: "Connecting talents across international markets",
      color: "bg-green-50"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: "Performance Optimization",
      description: "Data-driven strategies for workforce excellence",
      color: "bg-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Responsive Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Rocket className="w-10 h-10 text-purple-600" />
            <span className="text-2xl font-bold text-indigo-800">AI-Powered Placement Platform</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {['Home', 'About', 'Features', 'Contact'].map((item) => (
              <a key={item} href="#" className="flex items-center text-indigo-700 hover:text-purple-600 transition">
                {item === 'Home' && <Home className="mr-2" size={20} />}
                {item === 'About' && <Info className="mr-2" size={20} />}
                {item === 'Features' && <BookOpen className="mr-2" size={20} />}
                {item === 'Contact' && <Contact className="mr-2" size={20} />}
                {item}
              </a>
            ))}
            {/* Auth Buttons */}
            <div className="flex space-x-3">
              <button className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition">
                <LogIn className="mr-2" size={20} />
                Login
              </button>
              <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                <UserPlus className="mr-2" size={20} />
                Register
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-indigo-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {['Home', 'About', 'Features', 'Contact'].map((item) => (
                <a key={item} href="#" className="block py-2 text-indigo-700 hover:bg-purple-50 rounded">
                  {item}
                </a>
              ))}
              <div className="space-y-2 pt-2 border-t">
                <button className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-600">
                  Login
                </button>
                <button className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600">
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="pt-24 container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
            AI-Powered Talent Intelligence
          </div>
          <h1 className="text-5xl font-bold text-indigo-900 leading-tight">
            Transform Talent Management with Intelligent AI
          </h1>
          <p className="text-xl text-indigo-700 opacity-80">
            Leverage cutting-edge AI to unlock workforce potential, optimize performance, and make data-driven talent decisions.
          </p>
          <div className="flex space-x-4">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition shadow-lg">
              Get Started
            </button>
            <button className="bg-white text-indigo-700 px-8 py-3 rounded-full border border-purple-200 hover:bg-purple-50 transition">
              Learn More
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <img 
            src="/api/placeholder/600/400" 
            alt="AI Placement Training Platform" 
            className="w-full rounded-xl shadow-2xl"
          />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white/60 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-indigo-900 mb-12">
            Our Platform Capabilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${feature.color} p-6 rounded-xl text-center hover:shadow-xl transition transform hover:-translate-y-2`}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-indigo-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-indigo-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colorful Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Transforming Talent Landscape
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "95%", label: "Placement Success" },
              { number: "250K", label: "Talents Assessed" },
              { number: "500+", label: "Global Clients" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/20 p-6 rounded-xl hover:bg-white/30 transition"
              >
                <h3 className="text-5xl font-bold mb-2">{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Rocket className="w-10 h-10 text-purple-400" />
              <h4 className="text-2xl font-bold">AI-Powered Placement Platform</h4>
            </div>
            <p className="opacity-80">
              Revolutionizing talent management through intelligent AI solutions.
            </p>
          </div>
          {[
            { 
              title: "Quick Links", 
              links: ["Home", "About", "Features", "Contact"] 
            },
            { 
              title: "Solutions", 
              links: ["AI Assessment", "Talent Mapping", "Performance"] 
            },
            { 
              title: "Resources", 
              links: ["Blog", "Whitepaper", "Case Studies"] 
            }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="text-xl font-semibold mb-4">{section.title}</h4>
              <nav className="space-y-2">
                {section.links.map((link) => (
                  <a 
                    key={link} 
                    href="#" 
                    className="block text-white/70 hover:text-white transition"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="container mx-auto px-4 mt-8 pt-4 border-t border-white/10 text-center">
          <p className="opacity-70">
            © 2024 AI-Powered Placement Training and Assessment Platform. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlacementPlatformHomepage;