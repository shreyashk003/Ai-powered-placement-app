import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AutoTypeComponent from './AutoTypeComponent';
import { 
  Brain, 
  Award, 
  BookOpen, 
  Activity, 
  AlertCircle, 
  Cpu, 
  Star, 
  Check,
  Monitor
} from 'lucide-react';

function AIPlacement({ name, stdname, loginName, sslcScore, pucScore, be1Score, be2Score, be3Score }) {
  // State variables
  const [typeStatus, setTypeStatus] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [predictionAccuracy, setPredictionAccuracy] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState('Result');
  const [attemptNo, setAttemptNo] = useState(1); // Default to attempt 1
  const [allScores, setAllScores] = useState([]);
  
  // Form fields with refs
  const [sslc, setSslc] = useState(sslcScore); 
  const sslc1 = useRef(null);
  
  const [puc, setPuc] = useState(pucScore); 
  const puc1 = useRef(null);
  
  const [be1, setBe1] = useState(be1Score); 
  const be11 = useRef(null);
  
  const [be2, setBe2] = useState(be2Score); 
  const be21 = useRef(null);
  
  const [be3, setBe3] = useState(be3Score); 
  const be31 = useRef(null);
  
  const [apti, setApti] = useState(0); 
  const apti1 = useRef(null);
  
  const [cskill, setCskill] = useState(0); 
  const cskill1 = useRef(null);
  
  const [dsa, setDsa] = useState(0); 
  const dsa1 = useRef(null);
  
  const [db, setDb] = useState(0); 
  const db1 = useRef(null);
  
  const [se, setSe] = useState(0); 
  const se1 = useRef(null);
  
  const [os, setOs] = useState(0); 
  const os1 = useRef(null);
  
  const [cn, setCn] = useState(0); 
  const cn1 = useRef(null);
  
  const [oopj, setOopj] = useState(0); 
  const oopj1 = useRef(null);

  // Checkbox states
  const [hackathon, setHackathon] = useState(true);
  const [codathon, setCodathon] = useState(false);
  const [startup, setStartup] = useState(false);
  const [internship, setInternship] = useState(false);
  const [orators, setOrators] = useState(false);
  const [projects, setProjects] = useState(false);

  const payload = {
    usn: loginName,
    attempt_no:attemptNo
  };


  const getFreshdata=(newAttempt)=>{
    const payload1={
      usn: loginName,
    attempt_no:newAttempt
    }
alert(newAttempt)
    axios.post("http://localhost:8080/api/getAllScores", payload1)
      .then(response => {
        setAllScores(response.data);
        // Initially load attempt 1 scores
        updateScoresForAttempt(response.data, newAttempt);
      })
      .catch(err => {
        console.log(err);
      });
  }
  // Fetch all scores initially
  useEffect(() => {
    axios.post("http://localhost:8080/api/getAllScores", payload)
      .then(response => {
        setAllScores(response.data);
        // Initially load attempt 1 scores
        updateScoresForAttempt(response.data, 1);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Function to update scores based on attempt number
  const updateScoresForAttempt = (scores, attempt) => {
    if (!scores || scores.length === 0) return;

    const aptiScore = scores.filter(score => score.sub_name === "Apti" && score.attempt_no === attempt);
    const progScore = scores.filter(score => score.sub_name === "Program-Skill" && score.attempt_no === attempt);
    const DSAScore = scores.filter(score => score.sub_name === "DSA" && score.attempt_no === attempt);
    const DBScore = scores.filter(score => score.sub_name === "DB" && score.attempt_no === attempt);
    const SEScore = scores.filter(score => score.sub_name === "SE" && score.attempt_no === attempt);
    const OSScore = scores.filter(score => score.sub_name === "OS" && score.attempt_no === attempt);
    const CNScore = scores.filter(score => score.sub_name === "CN" && score.attempt_no === attempt);
    const OOPJScore = scores.filter(score => score.sub_name === "OOPS" && score.attempt_no === attempt);

    // Only update if score exists for this attempt
    if (aptiScore && aptiScore.length > 0) setApti(aptiScore[0].score);
    if (progScore && progScore.length > 0) setCskill(progScore[0].score);
    if (DSAScore && DSAScore.length > 0) setDsa(DSAScore[0].score);
    if (DBScore && DBScore.length > 0) setDb(DBScore[0].score);
    if (SEScore && SEScore.length > 0) setSe(SEScore[0].score);
    if (OSScore && OSScore.length > 0) setOs(OSScore[0].score);
    if (CNScore && CNScore.length > 0) setCn(CNScore[0].score);
    if (OOPJScore && OOPJScore.length > 0) setOopj(OOPJScore[0].score);
  };

  // Handle attempt number change
  const handleAttemptChange = (newAttempt) => {
alert(newAttempt)
    setAttemptNo(newAttempt);
    updateScoresForAttempt(allScores, newAttempt);
    getFreshdata(newAttempt)
  };

  // Calculate star rating based on inputs
  const calculateRating = () => {
    const scores = [
      parseInt(apti), parseInt(cskill), 
      parseInt(dsa), parseInt(db), parseInt(se), 
      parseInt(os), parseInt(cn), parseInt(oopj)
    ];
    
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avgScore / 7);
  };

  // Handle form submission
  const evaluateResult = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let args = [
      sslc, puc, be1, be2, be3, apti, cskill, dsa, db, os, oopj, cn, se,
      hackathon ? 1 : 0, codathon ? 1 : 0, startup ? 1 : 0, 
      internship ? 1 : 0, orators ? 1 : 0, projects ? 1 : 0
    ];
    
    axios.post("http://localhost:8080/run-python", args)
      .then((response) => {
        const res = response.data;
        const result = res.slice(-2);
        const accuracy = res.slice(-8, -3);
        console.log(result);
        setOutcome(result);
        setPredictionAccuracy(accuracy);
        setPredictionResult(parseInt(result) === 1 ? 'Success' : 'Fail');
        setTypeStatus(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8 pb-4 border-b border-blue-200">
        <div className="bg-blue-600 p-3 rounded-full mr-4">
          <Brain className="text-white" size={32} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-blue-800">AI Placement Predictor</h1>
          <p className="text-blue-600">Analyze your placement potential using machine learning</p>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">USN</label>
            <input 
              type="text" 
              className="border border-gray-300 rounded px-3 py-2 w-32"
              defaultValue={loginName}
              readOnly
            />
            <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
            <input 
              type="text" 
              className="border border-gray-300 rounded px-3 py-2 w-32"
              defaultValue={stdname}
              readOnly
            />
          </div>
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img 
              src={require("../images/faculty.jpg")} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Attempt Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4 text-purple-700">
          <h2 className="text-lg font-semibold">Select Attempt Number</h2>
        </div>
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              id="attempt1"
              type="radio"
              name="attempt"
              checked={attemptNo === 1}
              onChange={() => handleAttemptChange(1)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="attempt1" className="ml-2 text-sm font-medium text-gray-700">Attempt 1</label>
          </div>
          <div className="flex items-center">
            <input
              id="attempt2"
              type="radio"
              name="attempt"
              checked={attemptNo === 2}
              onChange={() => handleAttemptChange(2)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="attempt2" className="ml-2 text-sm font-medium text-gray-700">Attempt 2</label>
          </div>
          <div className="flex items-center">
            <input
              id="attempt3"
              type="radio"
              name="attempt"
              checked={attemptNo === 3}
              onChange={() => handleAttemptChange(3)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="attempt3" className="ml-2 text-sm font-medium text-gray-700">Attempt 3</label>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Select an attempt number to view corresponding scores for that attempt
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Parameters Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4 text-blue-700">
            <BookOpen size={20} className="mr-2" />
            <h2 className="text-lg font-semibold">Academic Parameters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">SSLC Score (%)</label>
              <input 
                ref={sslc1}
                type="number" 
                value={sslc}
                onChange={(e) => setSslc(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">PUC-II Score (%)</label>
              <input 
                ref={puc1}
                type="number" 
                value={puc}
                onChange={(e) => setPuc(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">First Year Score (%)</label>
              <input 
                ref={be11}
                type="number" 
                value={be1}
                onChange={(e) => setBe1(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Second Year Score (%)</label>
              <input 
                ref={be21}
                type="number" 
                value={be2}
                onChange={(e) => setBe2(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Third Year Score (%)</label>
              <input 
                ref={be31}
                type="number" 
                value={be3}
                onChange={(e) => setBe3(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Skill Test Scores Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4 text-purple-700">
            <Award size={20} className="mr-2" />
            <h2 className="text-lg font-semibold">Skill Test Scores</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Aptitude Test (Max 40)</label>
              <input 
                ref={apti1}
                type="number" 
                value={apti}
                min="0" max="40"
                onChange={(e) => setApti(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Coding Skills (Max 30)</label>
              <input 
                ref={cskill1}
                type="number"
                min="0" max="30" 
                value={cskill}
                onChange={(e) => setCskill(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Star Rating</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={20} 
                      className={i < calculateRating() ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg mt-6">
              <div className="text-sm text-blue-700">
                Your skill assessment places you among the 
                <span className="font-bold"> {
                  calculateRating() === 5 ? "top 10%" :
                  calculateRating() === 4 ? "top 25%" :
                  calculateRating() === 3 ? "top 50%" :
                  calculateRating() === 2 ? "bottom 50%" : "bottom 25%"
                }</span> of candidates.
              </div>
            </div>
          </div>
        </div>

        {/* Subjects & Activities Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4 text-green-700">
            <Activity size={20} className="mr-2" />
            <h2 className="text-lg font-semibold">Subjects & Activities</h2>
          </div>
          
          {/* Subject scores */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">DSA (Max 25)</label>
              <input 
                ref={dsa1}
                type="number"
                min="0" max="25"
                value={dsa}
                onChange={(e) => setDsa(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">DBMS (Max 25)</label>
              <input 
                ref={db1}
                type="number"
                min="0" max="25"
                value={db}
                onChange={(e) => setDb(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">OS (Max 25)</label>
              <input 
                ref={os1}
                type="number"
                min="0" max="25"
                value={os}
                onChange={(e) => setOs(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">OOPS (Max 25)</label>
              <input 
                ref={oopj1}
                type="number"
                min="0" max="25"
                value={oopj}
                onChange={(e) => setOopj(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">CN (Max 25)</label>
              <input 
                ref={cn1}
                type="number"
                min="0" max="25"
                value={cn}
                onChange={(e) => setCn(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SE (Max 25)</label>
              <input 
                ref={se1}
                type="number"
                min="0" max="25"
                value={se}
                onChange={(e) => setSe(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Activities */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Extracurricular Activities</h3>
            
            <div className="flex items-center">
              <input 
                id="hackathon"
                type="checkbox" 
                checked={hackathon}
                onChange={() => setHackathon(!hackathon)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="hackathon" className="ml-2 text-sm text-gray-600">Hackathon Participation</label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="codathon"
                type="checkbox" 
                checked={codathon}
                onChange={() => setCodathon(!codathon)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="codathon" className="ml-2 text-sm text-gray-600">Codathon Participation</label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="startup"
                type="checkbox" 
                checked={startup}
                onChange={() => setStartup(!startup)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="startup" className="ml-2 text-sm text-gray-600">Startup Experience</label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="internship"
                type="checkbox" 
                checked={internship}
                onChange={() => setInternship(!internship)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="internship" className="ml-2 text-sm text-gray-600">Industry Internship</label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="orators"
                type="checkbox" 
                checked={orators}
                onChange={() => setOrators(!orators)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="orators" className="ml-2 text-sm text-gray-600">Orators Club</label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="projects"
                type="checkbox" 
                checked={projects}
                onChange={() => setProjects(!projects)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="projects" className="ml-2 text-sm text-gray-600">Project/Mini-project</label>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Section */}
      <div className="mt-8 flex flex-col items-center">
        <button 
          onClick={evaluateResult}
          disabled={isLoading}
          className={`flex items-center px-8 py-3 rounded-full text-white font-medium text-lg ${
            isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
          } transition shadow-lg`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Check size={20} className="mr-2" />
              Predict Placement
            </>
          )}
        </button>

        {typeStatus && (
          <div className={`mt-6 p-6 rounded-lg w-full max-w-lg text-center ${
            outcome === "1" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Prediction Result</h3>
            
            <div className={`text-3xl font-bold mb-4 ${
              outcome === "1" ? "text-green-600" : "text-red-600"
            }`}>
              {outcome === "1" ? "Placement Likely" : "Placement Unlikely"}
            </div>
            
            <div className="flex justify-center items-center mb-4">
              <div className="text-sm text-gray-600 mr-2">Confidence:</div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {predictionAccuracy}%
              </div>
            </div>
            
            <AutoTypeComponent typeStatus={typeStatus} outcome={outcome} name={name} />
          </div>
        )}
      </div>

      {/* Resources Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center text-purple-700 mb-3">
            <BookOpen size={18} className="mr-2" />
            <h3 className="font-medium">Recommended Books</h3>
          </div>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-blue-600"><a href="#">Data Structures & Algorithms</a></li>
            <li className="hover:text-blue-600"><a href="#">Database Management Systems</a></li>
            <li className="hover:text-blue-600"><a href="#">Operating System Concepts</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center text-brown mb-3">
            <Monitor size={18} className="mr-2 text-orange-700" />
            <h3 className="font-medium text-orange-700">Online Courses</h3>
          </div>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-blue-600"><a href="#">Advanced DSA Masterclass</a></li>
            <li className="hover:text-blue-600"><a href="#">System Design Interview Prep</a></li>
            <li className="hover:text-blue-600"><a href="#">Full Stack Development</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center text-blue-700 mb-3">
            <AlertCircle size={18} className="mr-2" />
            <h3 className="font-medium">Interview Questions</h3>
          </div>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-blue-600"><a href="https://www.interviewbit.com/oops-interview-questions/">OOPS Concepts</a></li>
            <li className="hover:text-blue-600"><a href="https://www.interviewbit.com/c-interview-questions/">C Programming</a></li>
            <li className="hover:text-blue-600"><a href="#">Data Structures</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center text-indigo-700 mb-3">
            <Cpu size={18} className="mr-2" />
            <h3 className="font-medium">Project Ideas</h3>
          </div>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-blue-600">AI-based Placement Assistant</li>
            <li className="hover:text-blue-600">E-Learning Platform</li>
            <li className="hover:text-blue-600">Student Performance Analytics</li>
          </ul>
        </div>
      </div>

      <Routes>
        <Route path="/AutoType" element={<AutoTypeComponent typeStatus={typeStatus} outcome={outcome} />} /> 
      </Routes>
    </div>
  );
}

export default AIPlacement;