// pages/Contact.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Rocket, 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Globe, 
  Clock,
  Check
} from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formState);
    // Simulate a successful submission
    setIsSubmitted(true);
  };

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

      {/* Contact Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Our Team
            </h1>
            <p className="text-lg text-gray-600">
              Have questions about our platform? Looking for a demo? Our team is here to help you transform your talent strategy.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      required
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Demo">Request a Demo</option>
                      <option value="Sales Question">Sales Question</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white font-medium py-3 rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                  <p className="text-gray-600 mb-6">
                    Your message has been sent successfully. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100">Email</p>
                      <a href="mailto:info@talentsphere.ai" className="text-white hover:underline">
                        info@talentsphere.ai
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100">Phone</p>
                      <a href="tel:+18005551234" className="text-white hover:underline">
                        +1 (800) 555-1234
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100">Headquarters</p>
                      <p className="text-white">
                        123 Innovation Way<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100">Global Presence</p>
                      <p className="text-white">
                        North America, Europe, Asia-Pacific
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100">Business Hours</p>
                      <p className="text-white">
                        Monday - Friday: 9AM - 6PM EST
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {['linkedin', 'twitter', 'facebook', 'instagram'].map(platform => (
                      <a 
                        key={platform}
                        href={`#${platform}`}
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                      >
                        <span className="sr-only">{platform}</span>
                        <div className="w-5 h-5 bg-white/90 rounded-sm"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "How can I schedule a product demo?",
                  answer: "You can schedule a demo by filling out the contact form above and selecting 'Request a Demo' from the subject dropdown. One of our product specialists will reach out to you within 24 hours."
                },
                {
                  question: "What industries does TalentSphere serve?",
                  answer: "TalentSphere works with organizations across various industries including technology, healthcare, financial services, manufacturing, retail, and professional services. Our AI models can be tailored to specific industry requirements."
                },
                {
                  question: "Is TalentSphere suitable for small businesses?",
                  answer: "Absolutely! While we work with enterprise clients, we also offer scalable solutions for small and medium-sized businesses. Our platform is designed to grow with your organization."
                },
                {
                  question: "How long does implementation typically take?",
                  answer: "Implementation timelines vary based on your organization's size and requirements. A standard implementation typically takes 2-4 weeks, including integration with your existing HR systems, data migration, training, and customization."
                },
                {
                  question: "Do you offer ongoing support?",
                  answer: "Yes, we offer comprehensive support packages including 24/7 technical support, regular check-ins with a dedicated success manager, monthly performance reports, and quarterly strategy sessions to ensure you're maximizing value from our platform."
                },
                {
                  question: "How does TalentSphere handle data privacy and security?",
                  answer: "We take data security extremely seriously. TalentSphere is GDPR and CCPA compliant, utilizes end-to-end encryption, conducts regular third-party security audits, and maintains SOC 2 Type II certification to ensure your data is always protected."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Don't see your question here?</p>
              <a href="#contact-form" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ask Our Team
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 p-2 rounded-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TalentSphere</span>
              </div>
              <p className="text-gray-400 mb-6">
                Revolutionizing talent acquisition and management with AI-powered solutions.
              </p>
              <div className="flex space-x-4">
                {['linkedin', 'twitter', 'facebook', 'instagram'].map(platform => (
                  <a 
                    key={platform}
                    href={`#${platform}`}
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300"
                  >
                    <span className="sr-only">{platform}</span>
                    <div className="w-4 h-4 bg-white/90 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Use Cases', 'Integrations', 'API', 'Updates'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Press', 'Blog', 'Partners', 'Contact'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'Support', 'Webinars', 'Case Studies', 'Glossary', 'FAQ'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} TalentSphere, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;