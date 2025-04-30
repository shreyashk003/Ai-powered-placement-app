import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Code, Brain, ChevronRight, ExternalLink, Search, Book, Video, Download, Monitor, Menu, X, Grid, List, Filter, Clock, TrendingUp, Bookmark, ArrowUp } from 'lucide-react';

// Main dashboard component
export default function CSEDashboard() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch categories from the backend
        const response = await axios.get('/api/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setActiveCategory(response.data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
    
    // Scroll event listener for "back to top" button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
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

  // Fetch subjects when active category changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!activeCategory) return;
      
      try {
        setLoading(true);
        // Fetch subjects from the backend based on the active category
        const response = await axios.get(`/api/subjects?categoryId=${activeCategory.id}`);
        setSubjects(response.data);
        
        if (response.data.length > 0) {
          setActiveSubject(response.data[0]);
        } else {
          setActiveSubject(null);
          setResources([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load subjects. Please try again later.');
        setLoading(false);
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, [activeCategory]);

  // Fetch resources when active subject changes
  useEffect(() => {
    const fetchResources = async () => {
      if (!activeSubject) return;
      
      try {
        setLoading(true);
        // Fetch resources from the backend based on the active subject
        const response = await axios.get(`/api/resources?subjectId=${activeSubject.id}`);
        setResources(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
        setLoading(false);
        console.error('Error fetching resources:', err);
      }
    };

    fetchResources();
  }, [activeSubject]);

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

  // Filter resources based on search query and active filter
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'notes') return matchesSearch && resource.type === 'notes';
    if (activeFilter === 'videos') return matchesSearch && resource.type === 'video';
    if (activeFilter === 'recent') return matchesSearch && (new Date(resource.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    if (activeFilter === 'bookmarked') return matchesSearch && bookmarkedResources.includes(resource.id);
    if (activeFilter === 'popular') return matchesSearch && resource.popularity > 70;
    
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

  // Resource card component
  const ResourceCard = ({ resource }) => {
    const isBookmarked = bookmarkedResources.includes(resource.id);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div className="p-4">
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
              <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1 mr-2">
                {resource.difficulty}
              </span>
              <button 
                onClick={() => toggleBookmark(resource.id)}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
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
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {resource.type === 'notes' ? 'View Notes' : 'Watch Video'}
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Resource list item component for list view
  const ResourceListItem = ({ resource }) => {
    const isBookmarked = bookmarkedResources.includes(resource.id);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg mb-3 p-3">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-8 md:mr-4 flex justify-center mb-2 md:mb-0">
            {resource.type === 'notes' ? (
              <Book className="text-blue-600" size={20} />
            ) : (
              <Video className="text-red-600" size={20} />
            )}
          </div>
          <div className="md:flex-1">
            <h3 className="font-semibold text-lg">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-1 line-clamp-1">{resource.description}</p>
            <div className="text-xs text-gray-500">
              {new Date(resource.date).toLocaleDateString()} • {resource.author}
            </div>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1 mr-2">
              {resource.difficulty}
            </span>
            <button 
              onClick={() => toggleBookmark(resource.id)}
              className="text-gray-400 hover:text-yellow-500 transition-colors mr-2"
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {resource.type === 'notes' ? 'View' : 'Watch'}
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Loading placeholder component
  const LoadingPlaceholder = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Monitor size={28} />
              <h1 className="text-2xl font-bold ml-2">CSE Learning Hub</h1>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 container mx-auto px-4 py-6">
        {/* Sidebar - Category and Subject Navigation */}
        <aside className={`md:w-64 md:flex-shrink-0 bg-white rounded-lg shadow-md p-4 md:mr-6 overflow-y-auto ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <nav>
              <ul>
                {categories.map(category => (
                  <li key={category.id} className="mb-2">
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`flex items-center w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeCategory?.id === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.icon || <BookOpen size={20} />}
                      <span className="ml-2">{category.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Subjects</h2>
            <nav>
              <ul>
                {subjects.map(subject => (
                  <li key={subject.id} className="mb-1">
                    <button
                      onClick={() => setActiveSubject(subject)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeSubject?.id === subject.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{subject.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2">
                          {subject.count}
                        </span>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 mt-6 md:mt-0">
          {/* Breadcrumb and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeCategory?.name}: {activeSubject?.name}
              </h2>
              <div className="text-sm text-gray-500 flex items-center mt-1">
                <span>{activeCategory?.name}</span>
                <ChevronRight size={14} className="mx-1" />
                <span>{activeSubject?.name}</span>
              </div>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Controls - Resource Filters, View Mode, and Sort */}
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === 'all' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Resources
              </button>
              <button 
                onClick={() => setActiveFilter('notes')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === 'notes' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Notes
              </button>
              <button 
                onClick={() => setActiveFilter('videos')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === 'videos' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Videos
              </button>
              <button 
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === 'recent' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recent
              </button>
              <button 
                onClick={() => setActiveFilter('bookmarked')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === 'bookmarked' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bookmarked
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
              
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title">Title A-Z</option>
                </select>
                <Filter size={16} className="absolute left-2.5 top-2.5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Resources Display (Grid or List) */}
          {loading ? (
            viewMode === 'grid' ? <LoadingPlaceholder /> : <LoadingPlaceholderList />
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          ) : sortedResources.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No results matching "${searchQuery}". Try different keywords.` 
                  : "There are no resources available for this subject yet."}
              </p>
            </div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedResources.map(resource => (
                  <ResourceListItem key={resource.id} resource={resource} />
                ))}
              </div>
            )
          )}
          
          {/* Results summary */}
          {!loading && !error && sortedResources.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {sortedResources.length} results
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-white text-lg flex items-center">
                <Monitor size={20} className="mr-2" />
                CSE Learning Hub
              </h3>
              <p className="text-sm mt-1">Your complete resource for CSE studies</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Help</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 text-center text-sm">
            © {new Date().getFullYear()} CSE Learning Hub. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Back to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}