import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, Code, Brain, ChevronRight, ExternalLink, Search, 
  Book, Video, Download, Monitor, Menu, X, Grid, List, 
  Filter, Clock, TrendingUp, Bookmark, ArrowUp, ChevronDown, Lightbulb, 
  Database, Network, Code2, Layers, FileCode, Server, Eye
} from 'lucide-react';

// Main dashboard component
export default function CSEDashboard() {
  // State management
  const [activeSection, setActiveSection] = useState('technical');
  const [activeTechnicalSubject, setActiveTechnicalSubject] = useState('os');
  const [showTechnicalDropdown, setShowTechnicalDropdown] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('newest');
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fileLoading, setFileLoading] = useState({});
  
  // Define the sections and technical subjects
  const sections = [
    { id: 'technical', name: 'Technical Subjects', icon: <Server size={20} /> },
    { id: 'aptitude', name: 'Aptitude', icon: <Brain size={20} /> },
    { id: 'programming', name: 'Programming Skills', icon: <Code size={20} /> }
  ];
  
  const technicalSubjects = [
    { id: 'os', name: 'Operating Systems', icon: <Server size={18} /> },
    { id: 'db', name: 'Database Management', icon: <Database size={18} /> },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: <Code2 size={18} /> },
    { id: 'cn', name: 'Computer Networks', icon: <Network size={18} /> },
    { id: 'oops', name: 'Object-Oriented Programming', icon: <Layers size={18} /> },
    { id: 'se', name: 'Software Engineering', icon: <FileCode size={18} /> }
  ];

  // Fetch resources from backend API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/resources';
        
        if (activeSection === 'technical') {
          endpoint += `?subject=${activeTechnicalSubject}`;
        } else {
          endpoint += `?section=${activeSection}`;
        }
        
        const response = await axios.get(endpoint);
        
        // Process the resources to add resource URLs
        const processedResources = await Promise.all(
          response.data.map(async (resource) => {
            return resource;
          })
        );
        
        setResources(processedResources);
        setLoading(false);
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
        setLoading(false);
        console.error('Error fetching resources:', err);
      }
    };

    fetchResources();
  }, [activeSection, activeTechnicalSubject]);

  // Scroll event listener for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Load bookmarked resources from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedResources');
    if (savedBookmarks) {
      setBookmarkedResources(JSON.parse(savedBookmarks));
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bookmarkedResources', JSON.stringify(bookmarkedResources));
  }, [bookmarkedResources]);

  // Toggle bookmark for a resource
  const toggleBookmark = (resourceId) => {
    if (bookmarkedResources.includes(resourceId)) {
      setBookmarkedResources(bookmarkedResources.filter(id => id !== resourceId));
    } else {
      setBookmarkedResources([...bookmarkedResources, resourceId]);
    }
  };

  // Download PDF handler
  const handleDownloadPDF = async (resource) => {
    try {
      setFileLoading(prev => ({ ...prev, [resource.id]: true }));
      
      // Get the PDF file URL
      const response = await axios.get(`/api/resources/${resource.id}/download`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resource.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Update download count on the server
      await axios.post(`/api/resources/${resource.id}/track-download`);
      
      // Update local resource with incremented download count
      setResources(resources.map(res => 
        res.id === resource.id 
          ? { ...res, downloadCount: (res.downloadCount || 0) + 1 } 
          : res
      ));
      
      setFileLoading(prev => ({ ...prev, [resource.id]: false }));
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setFileLoading(prev => ({ ...prev, [resource.id]: false }));
      alert('Failed to download the PDF. Please try again later.');
    }
  };

  // Handle video streaming
  const handleViewVideo = async (resource) => {
    try {
      setFileLoading(prev => ({ ...prev, [resource.id]: true }));
      
      // Get the video streaming URL
      const response = await axios.get(`/api/resources/${resource.id}/stream`);
      
      // Open the video in a new tab or handle it as needed
      if (response.data && response.data.streamUrl) {
        window.open(response.data.streamUrl, '_blank');
        
        // Track video view on the server
        await axios.post(`/api/resources/${resource.id}/track-view`);
        
        // Update local popularity
        setResources(resources.map(res => 
          res.id === resource.id 
            ? { ...res, popularity: Math.min(100, (res.popularity || 0) + 1) } 
            : res
        ));
      } else {
        throw new Error('Invalid stream URL');
      }
      
      setFileLoading(prev => ({ ...prev, [resource.id]: false }));
    } catch (error) {
      console.error('Error accessing video stream:', error);
      setFileLoading(prev => ({ ...prev, [resource.id]: false }));
      alert('Failed to access the video. Please try again later.');
    }
  };

  // Filter resources based on search query and active filter
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'notes') return matchesSearch && resource.type === 'notes';
    if (activeFilter === 'videos') return matchesSearch && resource.type === 'video';
    if (activeFilter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && (new Date(resource.date) > oneWeekAgo);
    }
    if (activeFilter === 'bookmarked') return matchesSearch && bookmarkedResources.includes(resource.id);
    if (activeFilter === 'popular') return matchesSearch && resource.popularity > 85;
    
    return matchesSearch;
  });

  // Sort resources based on selected order
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOrder === 'popular') {
      return b.popularity - a.popularity;
    } else if (sortOrder === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Resource card component for grid view
  const ResourceCard = ({ resource }) => {
    const isBookmarked = bookmarkedResources.includes(resource.id);
    const isLoading = fileLoading[resource.id];
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100 hover:border-indigo-200 group">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {resource.type === 'notes' ? (
                <Book className="text-blue-600" size={20} />
              ) : (
                <Video className="text-red-600" size={20} />
              )}
              <span className="ml-2 text-sm font-medium text-gray-500 capitalize">{resource.type}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-xs rounded-full px-2 py-1 mr-2 ${
                resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                resource.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {resource.difficulty}
              </span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(resource.id);
                }}
                className={`transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-indigo-700 transition-colors">{resource.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <span className="flex items-center mr-3">
              {resource.type === 'notes' ? (
                <>
                  <Download size={14} className="mr-1" />
                  {resource.downloadCount} downloads
                </>
              ) : (
                <>
                  <Clock size={14} className="mr-1" />
                  {resource.duration}
                </>
              )}
            </span>
            <span className="flex items-center">
              <TrendingUp size={14} className="mr-1" />
              {resource.popularity}% popularity
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {new Date(resource.date).toLocaleDateString()} • {resource.author}
            </span>
            <button
              onClick={() => {
                if (resource.type === 'notes') {
                  handleDownloadPDF(resource);
                } else {
                  handleViewVideo(resource);
                }
              }}
              disabled={isLoading}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors disabled:text-blue-300 disabled:cursor-wait"
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-1">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : resource.type === 'notes' ? (
                <>
                  <Download size={16} className="mr-1" />
                  Download PDF
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-1" />
                  Stream Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Resource list item component for list view
  const ResourceListItem = ({ resource }) => {
    const isBookmarked = bookmarkedResources.includes(resource.id);
    const isLoading = fileLoading[resource.id];
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg mb-3 p-4 border border-gray-100 hover:border-indigo-200 group">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-8 md:mr-4 flex justify-center mb-2 md:mb-0">
            {resource.type === 'notes' ? (
              <Book className="text-blue-600" size={20} />
            ) : (
              <Video className="text-red-600" size={20} />
            )}
          </div>
          <div className="md:flex-1">
            <h3 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-1 line-clamp-1">{resource.description}</p>
            <div className="text-xs text-gray-500">
              {new Date(resource.date).toLocaleDateString()} • {resource.author}
            </div>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <span className={`text-xs rounded-full px-2 py-1 mr-2 ${
              resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
              resource.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {resource.difficulty}
            </span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleBookmark(resource.id);
              }}
              className={`transition-colors mr-3 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => {
                if (resource.type === 'notes') {
                  handleDownloadPDF(resource);
                } else {
                  handleViewVideo(resource);
                }
              }}
              disabled={isLoading}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors disabled:text-blue-300 disabled:cursor-wait"
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-1">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : resource.type === 'notes' ? (
                <>
                  <Download size={16} className="mr-1" />
                  Download PDF
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-1" />
                  Stream Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading placeholder component for grid view
  const LoadingPlaceholder = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-md p-5">
          <div className="animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading placeholder for list view
  const LoadingPlaceholderList = () => (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <div className="animate-pulse flex items-center">
            <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <BookOpen size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">No resources found</h3>
      <p className="text-gray-500 max-w-md mb-6">
        We couldn't find any resources matching your current filters. Try adjusting your search or filters.
      </p>
      <button
        onClick={() => {
          setSearchQuery('');
          setActiveFilter('all');
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <X size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">Something went wrong</h3>
      <p className="text-gray-500 max-w-md mb-6">
        {error || "We couldn't load the resources. Please try again later."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Refresh page
      </button>
    </div>
  );

  // Get active section name and icon for display
  const getActiveDisplay = () => {
    if (activeSection === 'technical') {
      const subject = technicalSubjects.find(s => s.id === activeTechnicalSubject);
      return {
        name: subject ? subject.name : 'Technical Subjects',
        icon: subject ? subject.icon : <Server size={24} />
      };
    }
    
    const section = sections.find(s => s.id === activeSection);
    return {
      name: section ? section.name : '',
      icon: section ? section.icon : null
    };
  };

  const activeDisplay = getActiveDisplay();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Monitor size={28} className="text-indigo-200" />
              <h1 className="text-2xl font-bold ml-2">CSE Learning Hub</h1>
            </div>
            <button 
              className="md:hidden p-2 rounded-md hover:bg-indigo-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 container mx-auto px-4 py-6">
        {/* Sidebar */}
        <aside className={`md:w-64 md:flex-shrink-0 bg-white rounded-lg shadow-md p-4 md:mr-6 overflow-y-auto transition-all md:sticky md:top-20 md:h-[calc(100vh-5rem)] ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Learning Resources</h2>
            <nav>
              <ul className="space-y-1">
                {sections.map(section => (
                  <li key={section.id}>
                    {section.id === 'technical' ? (
                      <div>
                        <button
                          onClick={() => {
                            setActiveSection('technical');
                            setShowTechnicalDropdown(!showTechnicalDropdown);
                          }}
                          className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md transition-colors ${
                            activeSection === 'technical'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            {section.icon}
                            <span className="ml-2">{section.name}</span>
                          </div>
                          <ChevronDown 
                            size={16} 
                            className={`transform transition-transform ${showTechnicalDropdown ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        
                        {/* Technical subjects dropdown */}
                        {showTechnicalDropdown && (
                          <ul className="pl-8 mt-1 space-y-1">
                            {technicalSubjects.map(subject => (
                              <li key={subject.id}>
                                <button
                                  onClick={() => {
                                    setActiveSection('technical');
                                    setActiveTechnicalSubject(subject.id);
                                  }}
                                  className={`flex items-center w-full text-left px-3 py-2 rounded-md transition-colors ${
                                    activeSection === 'technical' && activeTechnicalSubject === subject.id
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {subject.icon}
                                  <span className="ml-2">{subject.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveSection(section.id);
                          setShowTechnicalDropdown(false);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeSection === section.id
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {section.icon}
                        <span className="ml-2">{section.name}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center text-indigo-700 mb-2">
              <Lightbulb size={18} />
              <h3 className="font-medium ml-2">Quick Tips</h3>
            </div>
            <p className="text-xs text-gray-600">Use the filters to quickly find resources tailored to your learning needs. Bookmark important materials for easy access later.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 mt-6 md:mt-0">
          {/* Hero section with breadcrumb and search */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="mb-4 md:mb-0">
                <div className="text-sm text-indigo-600 flex items-center">
                  <span>Resources</span>
                  <ChevronRight size={14} className="mx-1" />
                  <span className="capitalize">{activeSection}</span>
                  {activeSection === 'technical' && (
                    <>
                      <ChevronRight size={14} className="mx-1" />
                      <span className="capitalize">{activeTechnicalSubject}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center mt-1">
                  <span className="mr-2">{activeDisplay.icon}</span>
                  {activeDisplay.name}
                </h2>
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Controls - Resource Filters, View Mode, and Sort */}
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center">All</span>
              </button>
              <button 
                onClick={() => setActiveFilter('notes')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'notes' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center">
                  <Book size={14} className="mr-1" />
                  Notes
                </span>
              </button>
              <button 
                onClick={() => setActiveFilter('videos')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'videos' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center">
                  <Video size={14} className="mr-1" />
                  Videos
                </span>
              </button>
              <button 
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'recent' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  Recent
                </span>
              </button>
              <button 
                onClick={() => setActiveFilter('bookmarked')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'bookmarked' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center">
                  <Bookmark size={14} className="mr-1" />
                  Bookmarked
                </span>
              </button>
              <button 
                onClick={() => setActiveFilter('popular')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'popular' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center">
                  <TrendingUp size={14} className="mr-1" />
                  Popular
                </span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title">Title A-Z</option>
                </select>
                <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results metrics */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{sortedResources.length}</span> results
              {activeFilter !== 'all' && <span> (filtered by <span className="font-medium capitalize">{activeFilter}</span>)</span>}
            </p>
            {sortedResources.length > 0 && searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Resource Grid/List */}
          {loading ? (
            viewMode === 'grid' ? <LoadingPlaceholder /> : <LoadingPlaceholderList />
          ) : error ? (
            <ErrorState />
          ) : sortedResources.length === 0 ? (
            <EmptyState />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
              {sortedResources.map(resource => (
                viewMode === 'grid' ? (
                  <ResourceCard key={resource.id} resource={resource} />
                ) : (
                  <ResourceListItem key={resource.id} resource={resource} />
                )
              ))}
            </div>
          )}

          {/* Scroll to top button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-2 shadow-lg transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </button>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Monitor size={24} className="text-indigo-400" />
                <span className="ml-2 text-lg font-semibold">CSE Learning Hub</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Your one-stop resource for Computer Science learning</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CSE Learning Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}