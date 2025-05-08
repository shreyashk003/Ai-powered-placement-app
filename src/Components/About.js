// pages/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Rocket } from 'lucide-react';

const About = () => {
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

      {/* About Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About TalentSphere</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl text-gray-700 mb-8">
                TalentSphere is revolutionizing how organizations discover, assess, and develop talent with our innovative AI-powered platform.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                At TalentSphere, we believe that matching the right talent with the right opportunity is the key to organizational success. Our mission is to transform talent acquisition and management through cutting-edge artificial intelligence, providing organizations with the tools they need to build high-performing teams while creating meaningful career opportunities for professionals around the world.
              </p>
              
              <h2>Our Story</h2>
              <p>
                Founded in 2020 by a team of HR technology experts and data scientists, TalentSphere was born from a simple observation: traditional hiring methods were failing both employers and candidates. With backgrounds spanning human resources, artificial intelligence, and workforce analytics, our founders set out to create a platform that would fundamentally change how organizations approach talent management.
              </p>
              <p>
                Since then, we've grown to serve over 500 enterprise clients globally, processing millions of talent profiles and achieving industry-leading match rates of 95%.
              </p>
              
              <h2>Our Technology</h2>
              <p>
                TalentSphere's proprietary AI algorithms evaluate skills, cultural fit, and potential with unmatched accuracy. Our platform goes beyond basic keyword matching to understand the nuanced relationships between skills, experience, and job requirements. By analyzing thousands of data points for each potential match, we're able to predict success with remarkable precision.
              </p>
              
              <h2>Our Values</h2>
              <ul>
                <li><strong>Innovation:</strong> We continuously push the boundaries of what's possible in talent technology</li>
                <li><strong>Fairness:</strong> We design our algorithms to eliminate bias and create equal opportunities</li>
                <li><strong>Transparency:</strong> We believe in explainable AI that users can understand and trust</li>
                <li><strong>Impact:</strong> We measure our success by the tangible results we deliver for our clients</li>
                <li><strong>Privacy:</strong> We maintain the highest standards for data security and privacy protection</li>
              </ul>
              
              <h2>Leadership Team</h2>
              <p>
                Our diverse leadership team brings decades of combined experience in HR technology, data science, and enterprise software. United by a passion for transforming how organizations build teams, they guide our company's strategic direction and foster a culture of innovation.
              </p>
              
              <div className="mt-12 text-center">
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300"
                >
                  Get in Touch With Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;