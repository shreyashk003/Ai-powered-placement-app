// pages/Solutions.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Rocket, Briefcase, Building, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';

const Solutions = () => {
  const solutions = [
    {
      icon: <Briefcase className="w-12 h-12 text-indigo-600" />,
      title: "Enterprise",
      description: "Comprehensive talent solutions for large organizations with complex hiring needs and global workforce requirements.",
      benefits: [
        "Custom AI models tailored to your industry",
        "Enterprise-grade security and compliance",
        "Dedicated success team and implementation support",
        "Advanced analytics and reporting dashboard"
      ],
      ctaText: "Enterprise Solutions"
    },
    {
      icon: <Building className="w-12 h-12 text-violet-600" />,
      title: "Mid-Market",
      description: "Scalable talent acquisition and management tools designed to help growing companies build exceptional teams.",
      benefits: [
        "Fast implementation with minimal IT resources",
        "Customizable workflows and assessment criteria",
        "Integration with popular HRIS and ATS systems",
        "Predictive analytics for workforce planning"
      ],
      ctaText: "Mid-Market Solutions"
    },
    {
      title: "Staffing Agencies",
      description: "AI-powered tools to help staffing professionals match candidates to opportunities with unprecedented precision.",
      benefits: [
        "Accelerated candidate sourcing and screening",
        "Skill gap identification and development tracking",
        "Client-specific talent pool management",
        "Performance-based candidate ranking"
      ],
      ctaText: "Agency Solutions"
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-emerald-600" />,
      title: "Educational Institutions",
      description: "Connect students and alumni with career opportunities that match their skills, interests, and potential.",
      benefits: [
        "Student skill assessment and career guidance",
        "Employer partnership management",
        "Alumni career tracking and engagement",
        "Curriculum alignment with market demands"
      ],
      ctaText: "Education Solutions"
    }
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

      {/* Solutions Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium mb-4">
              Tailored Approaches
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Solutions Designed for Your Unique Challenges
            </h1>
            <p className="text-lg text-gray-600">
              TalentSphere offers specialized solutions tailored to different organization types and sizes, ensuring you get exactly what you need to succeed.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl inline-block">
                    {solution.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                
                <div className="space-y-3 mb-8">
                  {solution.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/contact"
                  className="flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-all duration-300 group-hover:underline"
                >
                  <span>Explore {solution.ctaText}</span>
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>

          {/* Industry Solutions */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Industry-Specific Solutions</h2>
            
            <div className="grid gap-6">
              {[
                "Technology & Software",
                "Healthcare & Life Sciences",
                "Financial Services",
                "Manufacturing & Industrial",
                "Retail & Consumer Goods",
                "Professional Services"
              ].map((industry, index) => (
                <Link 
                  key={index}
                  to="/contact"
                  className="flex items-center justify-between px-6 py-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-all duration-300 group border border-gray-100"
                >
                  <span className="font-medium text-gray-900">{industry}</span>
                  <ArrowRight size={20} className="text-indigo-600 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300"
              >
                Speak with a Solutions Specialist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;