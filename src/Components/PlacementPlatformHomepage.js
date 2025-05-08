import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  BookOpen,
  CheckCircle,
  Play,
  ArrowRight,
  Zap,
  Target,
  Award,
  Clock,
  PieChart,
  Heart,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
  Sparkles
} from 'lucide-react';

const PlacementPlatformHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Shield className="w-10 h-10 text-indigo-600" />,
      title: 'AI-Powered Assessment',
      description: 'Our proprietary algorithms evaluate skills, cultural fit, and potential with 95% accuracy',
      color: 'bg-indigo-50/80',
      borderColor: 'border-indigo-200'
    },
    {
      icon: <Globe className="w-10 h-10 text-violet-600" />,
      title: 'Global Talent Mapping',
      description: 'Access talent pools across 120+ countries with real-time matching to your requirements',
      color: 'bg-violet-50/80',
      borderColor: 'border-violet-200'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-fuchsia-600" />,
      title: 'Performance Analytics',
      description: 'Track, analyze, and optimize workforce performance with AI-driven insights',
      color: 'bg-fuchsia-50/80',
      borderColor: 'border-fuchsia-200'
    },
    {
      icon: <Target className="w-10 h-10 text-blue-600" />,
      title: 'Precision Matching',
      description: 'Our AI matches candidates to roles with 3x more accuracy than traditional methods',
      color: 'bg-blue-50/80',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Clock className="w-10 h-10 text-emerald-600" />,
      title: 'Time Optimization',
      description: 'Reduce hiring time by 60% with automated screening and intelligent workflows',
      color: 'bg-emerald-50/80',
      borderColor: 'border-emerald-200'
    },
    {
      icon: <Zap className="w-10 h-10 text-amber-600" />,
      title: 'Skill Gap Analysis',
      description: 'Identify development opportunities and create personalized training paths',
      color: 'bg-amber-50/80',
      borderColor: 'border-amber-200'
    },
  ];

  const benefits = [
    { icon: <CheckCircle className="text-emerald-600" />, text: "Reduce hiring costs by up to 40%" },
    { icon: <CheckCircle className="text-emerald-600" />, text: "Improve retention rates by 35%" },
    { icon: <CheckCircle className="text-emerald-600" />, text: "Eliminate bias in the hiring process" },
    { icon: <CheckCircle className="text-emerald-600" />, text: "Access global talent pools instantly" },
    { icon: <CheckCircle className="text-emerald-600" />, text: "Onboard new hires 50% faster" },
    { icon: <CheckCircle className="text-emerald-600" />, text: "Scale your team efficiently" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-2 rounded-lg shadow-md">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">TalentSphere</span>
                  <p className="text-xs text-gray-600 hidden md:block tracking-wider">AI-Powered Placement Platform</p>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Home', icon: <Home size={18} />, path: '/' },
                { name: 'About', icon: <Info size={18} />, path: '/about' },
                { name: 'Features', icon: <BookOpen size={18} />, path: '/features' },
                { name: 'Solutions', icon: <Target size={18} />, path: '/solutions' },
                { name: 'Contact', icon: <Contact size={18} />, path: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center text-gray-700 hover:text-indigo-600 font-medium text-sm transition-all duration-300 group"
                >
                  <span className="mr-2 transform group-hover:scale-110 transition-all duration-300">{item.icon}</span>
                  <span className="relative overflow-hidden">
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-gray-700 hover:text-indigo-600 transition-all duration-300 px-5 py-2 flex items-center border border-transparent hover:border-indigo-200 rounded-lg"
              >
                <LogIn size={16} className="mr-2" />
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700 px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
              >
                <UserPlus size={16} className="mr-2" />
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-xl rounded-b-2xl mt-2 max-h-[80vh] overflow-y-auto border border-gray-100">
            <div className="px-4 py-4 space-y-3">
              {[
                { name: 'Home', icon: <Home size={18} />, path: '/' },
                { name: 'About', icon: <Info size={18} />, path: '/about' },
                { name: 'Features', icon: <BookOpen size={18} />, path: '/features' },
                { name: 'Solutions', icon: <Target size={18} />, path: '/solutions' },
                { name: 'Contact', icon: <Contact size={18} />, path: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full font-medium text-indigo-600 border border-indigo-200 py-3 rounded-lg hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center"
                >
                  <LogIn size={16} className="mr-2" />
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="w-full font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <UserPlus size={16} className="mr-2" />
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 z-0"></div>
        <div className="absolute right-0 top-0 h-full w-3/4 opacity-40 pointer-events-none">
          <div className="w-full h-full bg-indigo-100 rounded-bl-full"></div>
        </div>
        <div className="absolute left-20 top-64 w-24 h-24 bg-purple-300 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute right-40 bottom-20 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/2 bottom-32 w-20 h-20 bg-indigo-300 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full shadow-sm">
                <Sparkles size={16} className="mr-2 animate-pulse" />
                <span className="font-medium tracking-wide">AI-Powered Talent Intelligence</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                <span className="block">Transform Your</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">
                  Talent Ecosystem
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Harness the power of AI to revolutionize how you discover, assess, and develop talent. Our platform delivers data-driven insights to build high-performing teams.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-violet-500/30 rounded-3xl blur-xl transform -rotate-6 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-l from-indigo-500/20 via-purple-500/20 to-violet-500/20 rounded-3xl blur-xl transform rotate-3 animate-pulse animation-delay-2000"></div>
              <div className="relative w-full h-96 lg:h-full">
                {/* Image with styled container */}
                <div className="bg-white rounded-3xl shadow-2xl w-full h-full overflow-hidden border border-gray-100">
                  <img
                    src="../images/Home.jpg"
                    alt="AI Talent Platform Dashboard"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>

                {/* Badge 1 - Bottom Right */}
                <div className="absolute -bottom-5 -right-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white px-5 py-2 rounded-xl shadow-lg z-10">
                  <span className="font-semibold text-sm">AI-Powered</span>
                </div>

                {/* Badge 2 - Top Left */}
                <div className="absolute -top-5 -left-5 bg-white text-indigo-600 px-4 py-2 rounded-xl shadow-lg z-10 flex items-center">
                  <Star className="w-4 h-4 mr-1 text-amber-500" />
                  <span className="font-semibold text-sm">95% Match Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      

      {/* Features Section - Enhanced with hover effects */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
              <Star size={16} className="mr-2" />
              <span className="font-medium tracking-wide">Platform Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionize Talent Management with AI
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive suite of tools helps you identify, develop, and retain top talent with unprecedented precision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${feature.borderColor} group`}
              >
                <div className="mb-6 transition-transform duration-300 transform group-hover:scale-110">
                  <div className="bg-white p-3 rounded-xl shadow-sm inline-block">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6">
                  <Link to="/features" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 group-hover:underline transition-all duration-300">
                    <span>Learn more</span>
                    <ChevronRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/features"
              className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-all duration-300"
            >
              <span>View All Features</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section - Improved with animated number counters */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-700 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-700 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/10">
              <Zap size={16} className="mr-2" />
              <span className="font-medium tracking-wide">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Talent Strategy in 3 Steps</h2>
            <p className="text-lg text-indigo-100">
              Our AI-driven platform simplifies talent management from start to finish.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10">
            {[
              {
                number: "01",
                title: "Define Your Needs",
                description: "Input your requirements and our AI will create a comprehensive talent profile",
                icon: <Target className="w-8 h-8" />
              },
              {
                number: "02",
                title: "AI-Powered Matching",
                description: "Our algorithms identify and evaluate the best candidates from our global talent pool",
                icon: <Zap className="w-8 h-8" />
              },
              {
                number: "03",
                title: "Optimize & Scale",
                description: "Continuously improve with data-driven insights and performance analytics",
                icon: <PieChart className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 relative hover:bg-white/15 transition-all duration-300 group">
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400 rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="text-7xl font-bold opacity-20 absolute right-6 top-6 group-hover:opacity-30 transition-opacity duration-300 font-serif">{step.number}</div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-3 mt-4">{step.title}</h3>
                  <p className="text-indigo-100">{step.description}</p>
                  <div className="mt-8">
                    <Link to="/solutions" className="text-white bg-white/20 hover:bg-white/30 transition-all duration-300 px-5 py-2 rounded-lg flex items-center group-hover:translate-x-1 transition-transform inline-flex">
                      <span>Learn more</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced with interactive elements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-violet-500/20 rounded-3xl blur-lg"></div>
                <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src="/api/placeholder/600/500"
                    alt="Platform Benefits"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg max-w-xs animate-float">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <PieChart className="text-emerald-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Performance increase</p>
                      <p className="text-lg font-bold text-gray-900">+147%</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 bg-white p-4 rounded-xl shadow-lg animate-float animation-delay-1000">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                      <Clock className="text-amber-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Time saved</p>
                      <p className="text-lg font-bold text-gray-900">60%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
                <Award size={16} className="mr-2" />
                <span className="font-medium tracking-wide">Business Impact</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Workforce ROI
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered talent platform delivers measurable results, helping organizations build high-performing teams faster while reducing costs.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300 group">
                    <div className="mt-1 transform group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                    <p className="text-gray-700">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Improved with animated counters */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact By The Numbers</h2>
            <p className="text-lg text-indigo-100">
              Transforming talent acquisition and management across industries
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Enterprise Clients", icon: <Users className="w-8 h-8" /> },
              { number: "3.5M+", label: "Talent Profiles", icon: <MessageCircle className="w-8 h-8" /> },
              { number: "95%", label: "Placement Accuracy", icon: <Target className="w-8 h-8" /> },
              { number: "40%", label: "Cost Reduction", icon: <Zap className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-white/20 rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                <p className="text-indigo-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
              <Heart size={16} className="mr-2" />
              <span className="font-medium tracking-wide">Client Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600">
              Hear how TalentSphere has transformed talent acquisition and management for leading organizations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "TalentSphere has revolutionized our hiring process. We've reduced time-to-hire by 65% while improving the quality of our candidates.",
                name: "Sarah Johnson",
                title: "Chief HR Officer, TechGlobal Inc.",
                image: "/api/placeholder/100/100"
              },
              {
                quote: "The AI-powered matching capability has transformed how we build teams. Our retention rates have improved by 40% since implementation.",
                name: "Michael Chen",
                title: "VP of Talent, Innovate Solutions",
                image: "/api/placeholder/100/100"
              },
              {
                quote: "As a rapidly scaling startup, we needed a solution that could grow with us. TalentSphere has been the perfect partner in our journey.",
                name: "Priya Sharma",
                title: "Founder & CEO, NextGen Software",
                image: "/api/placeholder/100/100"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/case-studies"
              className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-all duration-300"
            >
              <span>View All Case Studies</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Talent Strategy?
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Join 500+ leading companies using TalentSphere to build exceptional teams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-indigo-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                <span>Request a Demo</span>
                <ExternalLink size={18} className="ml-2" />
              </button>
              <button className="px-8 py-4 text-white bg-white/20 backdrop-blur-sm border border-white/30 font-medium rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                <span>Contact Sales</span>
                <Phone size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-2 rounded-lg shadow-md">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">TalentSphere</span>
                </div>
              </Link>
              <p className="text-gray-400 mb-6">
                Revolutionizing talent acquisition and management with AI-powered solutions that help companies build exceptional teams.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'linkedin', 'instagram'].map(platform => (
                  <a 
                    key={platform}
                    href={`#${platform}`}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300"
                  >
                    <span className="sr-only">{platform}</span>
                    <div className="w-5 h-5 bg-white/70 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Partners', 'News', 'Contact'].map(item => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Solutions', 'Pricing', 'Case Studies', 'Documentation'].map(item => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'API Docs', 'Community', 'Resources', 'Blog'].map(item => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} TalentSphere. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlacementPlatformHomepage;