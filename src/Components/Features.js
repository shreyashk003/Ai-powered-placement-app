// pages/Features.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Rocket, Shield, Globe, TrendingUp, Target, Clock, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-10 h-10 text-indigo-600" />,
      title: "AI-Powered Assessment",
      description: "Our proprietary algorithms evaluate skills, cultural fit, and potential with 95% accuracy",
      color: "bg-indigo-50/80",
      borderColor: "border-indigo-200"
    },
    {
      icon: <Globe className="w-10 h-10 text-violet-600" />,
      title: "Global Talent Mapping",
      description: "Access talent pools across 120+ countries with real-time matching to your requirements",
      color: "bg-violet-50/80",
      borderColor: "border-violet-200"
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-fuchsia-600" />,
      title: "Performance Analytics",
      description: "Track, analyze, and optimize workforce performance with AI-driven insights",
      color: "bg-fuchsia-50/80",
      borderColor: "border-fuchsia-200"
    },
    {
      icon: <Target className="w-10 h-10 text-blue-600" />,
      title: "Precision Matching",
      description: "Our AI matches candidates to roles with 3x more accuracy than traditional methods",
      color: "bg-blue-50/80",
      borderColor: "border-blue-200"
    },
    {
      icon: <Clock className="w-10 h-10 text-emerald-600" />,
      title: "Time Optimization",
      description: "Reduce hiring time by 60% with automated screening and intelligent workflows",
      color: "bg-emerald-50/80",
      borderColor: "border-emerald-200"
    },
    {
      icon: <Zap className="w-10 h-10 text-amber-600" />,
      title: "Skill Gap Analysis",
      description: "Identify development opportunities and create personalized training paths",
      color: "bg-amber-50/80",
      borderColor: "border-amber-200"
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar - Simplified version */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg py-3">
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
            
            <div className="hidden md:block">
              <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                <Home size={20} className="inline mr-1" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Features Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium mb-4">
              Platform Capabilities
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features That Transform Talent Management
            </h1>
            <p className="text-lg text-gray-600">
              Our comprehensive suite of AI-powered tools helps you identify, develop, and retain top talent with unprecedented precision.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Why Our Features Make a Difference</h2>
            <p>
              TalentSphere's feature set is designed to address the complex challenges of modern talent acquisition and management. Unlike traditional solutions that rely on keyword matching and manual processes, our AI-powered platform provides deeper insights, faster results, and better outcomes.
            </p>
            
            <h3>Enterprise-Grade AI Technology</h3>
            <p>
              Our platform leverages advanced machine learning algorithms trained on millions of successful placements to understand the nuanced relationships between skills, experience, and job requirements. This allows us to predict candidate success with remarkable precision.
            </p>
            
            <h3>Seamless Integration</h3>
            <p>
              TalentSphere integrates with your existing HR tech stack, including ATS, HRIS, and performance management systems, creating a unified talent ecosystem that eliminates silos and provides comprehensive insights.
            </p>

            <div className="mt-12 text-center">
              <Link 
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;