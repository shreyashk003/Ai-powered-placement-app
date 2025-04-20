import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AddStudent from "./Components/AddStudent";
import StudentList from "./Components/StudentList";
import AptitudeQuiz from "./Components/AptitudeQuiz";
import TestChooser from "./Components/TestChooser";
import TechnicalSubjectSkill from "./Components/Technical_subject_Skill";
import ProgramSkill from "./Components/ProgramSkill";
import Login from "./Components/Login";
import PlacementPlatformHomepage from "./Components/PlacementPlatformHomepage";
import AIPlacement from "./Components/AIPlacement";
import AddQuestion from "./Components/AddQuestion";
import UnifiedDashboard from "./Components/UnifiedDashboard";

const App = () => {
    const [role, setRole] = useState(null);
    const [aptiStatus, setAptiStatus] = useState(false);
    const[technicalStatus,setTechnicalStatus]=useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [loginName, setloginName] = useState("");
    const [usn,setusn]=useState("");
    const [programStatus, setProgramStatus] = useState(false);
    const[stdname,setstdName]=useState("")
    const[sslcScore,setSSLCScore]=useState(0);
    const[pucScore,setPucScore]=useState(0);
    const[be1Score,setBe1Score]=useState(0);
    const[be2Score,setBe2Score]=useState(0);
    const[be3Score,setBe3Score]=useState(0);


    useEffect(() => {
        if (!role) return;
    
        if (role === "Student") {
            if (!aptiStatus) {
                navigate("/Uni-dashboard");

                //navigate("/aptitude-quiz");
            } else if (!technicalStatus) {
                navigate("/Uni-dashboard");
            } else if (!programStatus) {
                navigate("/program-skill");
            } else {
                navigate("/ai-placement");


            }
        } else if (role === "Faculty") {
            navigate("/add-questions")
           // navigate("/add-student");
           
        } else if (role === "Admin") {
            navigate("/student-list");
        }
    }, [role, aptiStatus, technicalStatus, programStatus, navigate]);
    
    

    return (
        <Routes>

            <Route path="/" element={<Login setusn={setusn} setRole={setRole} setUsername={setUsername} setloginName={setloginName} setstdName={setstdName} setPucScore={setPucScore}
            setBe2Score={setBe2Score} setBe3Score={setBe3Score} setBe1Score={setBe1Score} setSSLCScore={setSSLCScore}/>} />

            {role === "Student" && (
                <>
                    <Route path="/aptitude-quiz" element={<AptitudeQuiz usn={usn} setUsername={setUsername} setAptiStatus={setAptiStatus} stdname={stdname} />} />
                    <Route path="/Uni-dashboard" element={<UnifiedDashboard loginName={loginName} setTechnicalStatus={setTechnicalStatus} stdname={stdname} usn={usn} />} />
                    <Route path="/program-skill" element={<ProgramSkill setProgramStatus={setProgramStatus} usn={usn} />} />
                    <Route path="/ai-placement" element={<AIPlacement stdname={stdname} loginName={loginName } 
                    sslcScore={sslcScore} pucScore={pucScore} be1Score={be1Score} be2Score={be2Score} be3Score={be3Score}></AIPlacement>} />

                    <Route path="*" element={<Navigate to={aptiStatus ? "/test-chooser" : "/aptitude-quiz"} />} />
                </>
                
            )}

            {role === "Faculty" && (
                <>
                    <Route path="/add-student" element={<AddStudent />} />
                    <Route path="/add-questions" element={<AddQuestion></AddQuestion>} />
                    <Route path="/student-list" element={<StudentList />} />
                    <Route path="*" element={<Navigate to="/add-student" />} />
                </>
            )}

            {role === "Admin" && (
                <>
                    <Route path="/student-list" element={<StudentList />} />
                </>
            )}

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
