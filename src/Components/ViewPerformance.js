import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  BarChart2, LineChart as LineChartIcon, BookOpen, User, AlertCircle, Clock, Award, ArrowLeft, PieChart as PieChartIcon, Loader2
} from 'lucide-react';

function ViewPerformance({ setViewPerformance, usn }) {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('score');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStudentPerformance = async () => {
      try {
        if (!usn) throw new Error('Student USN is required');

        const response = await axios.get(`http://localhost:8080/api/studentperformance/${usn}`);
        const data = response.data;

        if (!Array.isArray(data)) throw new Error('Invalid data format received from server');

        const processedData = data.map(item => {
          if (!item || typeof item !== 'object') {
            return {
              sub_name: 'Unknown',
              score: 0,
              timeInSeconds: 0,
              quiz_date: null,
              attempt_id: `unknown-${Math.random().toString(36).substring(7)}`,
              timetaken: '*NULL*'
            };
          }

          return {
            ...item,
            score: item.score == null ? 0 : Number(item.score),
            timeInSeconds: calculateTimeInSeconds(item.timetaken)
          };
        });

        setStudentData(processedData);
      } catch (err) {
        console.error(err);
        setError('Failed to load performance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentPerformance();
  }, [usn]);

  const calculateTimeInSeconds = (timeString) => {
    if (!timeString || timeString === '*NULL*') return 0;

    try {
      if (timeString.includes('m')) {
        const [minPart, secPart] = timeString.split('m');
        const minutes = parseInt(minPart) || 0;
        const seconds = parseInt(secPart?.replace('s', '')) || 0;
        return minutes * 60 + seconds;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  const completedAttempts = studentData.filter(item => item.score !== 0).length || 1;
  const averageScore = studentData.length > 0
    ? (studentData.reduce((sum, item) => sum + (item.score || 0), 0) / completedAttempts).toFixed(1)
    : 0;
  const highestScore = studentData.length > 0
    ? Math.max(...studentData.map(item => item.score || 0))
    : 0;
  const averageTime = studentData.length > 0
    ? (studentData.reduce((sum, item) => sum + (item.timeInSeconds || 0), 0) / completedAttempts).toFixed(0)
    : 0;

  // Process data to include attempt numbers for each subject
  const subjectAttempts = {};
  const processedChartData = studentData.map(item => {
    const subName = item.sub_name || 'Unknown';
    
    // Initialize or increment attempt counter for this subject
    if (!subjectAttempts[subName]) {
      subjectAttempts[subName] = 1;
    } else {
      subjectAttempts[subName]++;
    }
    
    const attemptNumber = subjectAttempts[subName];
    
    return {
      name: `${subName}-${attemptNumber}`, // Combined subject-attempt label
      subject: subName, // Original subject name
      attemptNum: attemptNumber, // Attempt number
      score: item.score || 0,
      timeInSeconds: item.timeInSeconds || 0,
      date: item.quiz_date
    };
  });

  // Generate colors based on subject and attempt
  const generateBarColors = () => {
    // Define distinct colors for each attempt (1st, 2nd, and 3rd attempts)
    const attemptColors = {
      1: '#4F46E5', // Deep blue for first attempts
      2: '#10B981', // Green for second attempts
      3: '#F59E0B'  // Amber/orange for third attempts
    };
    
    // For any attempt beyond 3, we'll use additional colors
    const extraAttemptColors = ['#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
    
    return processedChartData.map(item => {
      const attemptNum = item.attemptNum;
      
      if (attemptNum <= 3) {
        // Use our predefined colors for attempts 1-3
        return attemptColors[attemptNum];
      } else {
        // For attempts beyond 3, use colors from our extra list
        return extraAttemptColors[(attemptNum - 4) % extraAttemptColors.length];
      }
    });
  };
  
  const barColors = generateBarColors();

  // Data for pie chart - score distribution
  const scoreRanges = [
    { name: '0-30', value: 0, color: '#EF4444' },
    { name: '31-60', value: 0, color: '#F59E0B' },
    { name: '61-80', value: 0, color: '#10B981' },
    { name: '81-100', value: 0, color: '#3B82F6' }
  ];

  studentData.forEach(item => {
    const score = item.score || 0;
    if (score <= 30) scoreRanges[0].value++;
    else if (score <= 60) scoreRanges[1].value++;
    else if (score <= 80) scoreRanges[2].value++;
    else scoreRanges[3].value++;
  });

  const subjects = [...new Set(studentData.map(item => item.sub_name || 'Unknown'))];

  const handleReturn = () => {
    setViewPerformance(true);
  };

  const studentId = studentData.length > 0 && studentData[0] ? studentData[0].usn || 'N/A' : 'N/A';

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
              <p className="text-slate-600 font-medium">Loading student performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-500 flex items-center mb-4">
              <AlertCircle size={32} className="mr-2" />
              <h2 className="text-2xl font-semibold">Error</h2>
            </div>
            <p className="text-slate-600 mb-6 text-center">{error}</p>
            <button
              onClick={handleReturn}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (studentData.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-amber-500 flex items-center mb-4">
              <AlertCircle size={32} className="mr-2" />
              <h2 className="text-2xl font-semibold">No Data Found</h2>
            </div>
            <p className="text-slate-600 mb-6 text-center">No performance records available for this student.</p>
            <button
              onClick={handleReturn}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header with student info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Student Performance Dashboard</h1>
            <div className="flex items-center text-slate-500">
              <User size={16} className="mr-2" />
              <span className="font-medium mr-2">Student ID:</span>
              <span className="text-slate-700">{studentId}</span>
            </div>
          </div>
          
          <div className="flex mt-4 md:mt-0">
            <button
              onClick={handleReturn}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to AI
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="flex space-x-1 mb-6 overflow-x-auto p-1 bg-slate-100 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md transition duration-200 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-md transition duration-200 font-medium text-sm whitespace-nowrap ${
              activeTab === 'charts' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => setActiveTab('charts')}
          >
            Performance Charts
          </button>
          <button
            className={`px-4 py-2 rounded-md transition duration-200 font-medium text-sm whitespace-nowrap ${
              activeTab === 'details' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Subject Details
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm border border-indigo-100">
                <div className="flex items-center text-indigo-600 mb-2">
                  <BookOpen size={20} className="mr-2" />
                  <h3 className="font-semibold">Subjects Taken</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{subjects.length}</p>
                <p className="text-sm text-slate-500 mt-1">Total unique subjects</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex items-center text-blue-600 mb-2">
                  <Award size={20} className="mr-2" />
                  <h3 className="font-semibold">Average Score</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{averageScore}</p>
                <p className="text-sm text-slate-500 mt-1">Out of 100 points</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 shadow-sm border border-emerald-100">
                <div className="flex items-center text-emerald-600 mb-2">
                  <Clock size={20} className="mr-2" />
                  <h3 className="font-semibold">Average Time</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{averageTime}s</p>
                <p className="text-sm text-slate-500 mt-1">Seconds per attempt</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-sm border border-amber-100">
                <div className="flex items-center text-amber-600 mb-2">
                  <AlertCircle size={20} className="mr-2" />
                  <h3 className="font-semibold">Highest Score</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{highestScore}</p>
                <p className="text-sm text-slate-500 mt-1">Best performance</p>
              </div>
            </div>

            {/* Score distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-1">
                <div className="flex items-center mb-4">
                  <PieChartIcon size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-700">Score Distribution</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreRanges.filter(range => range.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {scoreRanges.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} attempts`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-2">
                <div className="flex items-center mb-4">
                  <BarChart2 size={20} className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-700">Subject Performance</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        formatter={(value, name, props) => {
                          return [`${value}`, name === "score" ? "Score" : "Time (seconds)"];
                        }}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar dataKey="score" name="Score">
                        {processedChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={barColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Performance Analytics</h2>
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 text-sm">Metric:</span>
                <select
                  className="bg-white border border-slate-300 rounded-md px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <option value="score">Score</option>
                  <option value="timeInSeconds">Time Taken</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <BarChart2 size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-700">Subject Comparison</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        formatter={(value, name, props) => {
                          return [`${value}`, name === "score" ? "Score" : "Time (seconds)"];
                        }}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar
                        dataKey={selectedMetric}
                        name={selectedMetric === 'score' ? 'Score' : 'Time (seconds)'}
                      >
                        {processedChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={barColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <LineChartIcon size={20} className="text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-700">Performance Trend</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        formatter={(value, name, props) => {
                          return [`${value}`, name === "score" ? "Score" : "Time (seconds)"];
                        }}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        name={selectedMetric === 'score' ? 'Score' : 'Time (seconds)'}
                        stroke={selectedMetric === 'score' ? '#4F46E5' : '#10B981'}
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Subject Performance Details</h2>
            
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Subject</th>
                    <th className="px-6 py-3 font-semibold">Attempt</th>
                    <th className="px-6 py-3 font-semibold">Score</th>
                    <th className="px-6 py-3 font-semibold">Time Taken</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedChartData.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{item.subject}</td>
                      <td className="px-6 py-4">{item.attemptNum}</td>
                      <td className="px-6 py-4">{item.score}</td>
                      <td className="px-6 py-4">{item.timeInSeconds} seconds</td>
                      <td className="px-6 py-4">{item.date || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.score >= 80 ? 'bg-green-100 text-green-800' :
                          item.score >= 60 ? 'bg-blue-100 text-blue-800' :
                          item.score >= 40 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.score >= 80 ? 'Excellent' :
                           item.score >= 60 ? 'Good' :
                           item.score >= 40 ? 'Average' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPerformance;