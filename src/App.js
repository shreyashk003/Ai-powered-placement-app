import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AddStudent from "./Components/AddStudent";
import Dashboard from "./Components/Dashboard";
import StudentList from "./Components/StudentList";
import AptitudeQuiz from "./Components/AptitudeQuiz";
import TestChooser from "./Components/TestChooser";
import TechnicalSubjectSkill from "./Components/Technical_subject_Skill";
import ProgramSkill from "./Components/ProgramSkill";
import Login from "./Components/Login";
import PlacementPlatformHomepage from "./Components/PlacementPlatformHomepage";
import AIPlacement from "./Components/AIPlacement";

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


    useEffect(() => {
        if (!role) return;
    
        if (role === "Student") {
            if (!aptiStatus) {
                navigate("/aptitude-quiz");
            } else if (!technicalStatus) {
                navigate("/dashboard");
            } else if (!programStatus) {
                navigate("/program-skill");
            } else {
                navigate("/ai-placement");
            }
        } else if (role === "Faculty") {
            alert("Iamhere")
            navigate("/add-student");
        } else if (role === "Admin") {
            navigate("/student-list");
        }
    }, [role, aptiStatus, technicalStatus, programStatus, navigate]);
    
    

    return (
        <Routes>

            <Route path="/" element={<Login setusn={setusn} setRole={setRole} setUsername={setUsername} setloginName={setloginName} setstdName={setstdName} />} />

            {role === "Student" && (
                <>
                    <Route path="/aptitude-quiz" element={<AptitudeQuiz usn={usn} setUsername={setUsername} setAptiStatus={setAptiStatus} stdname={stdname} />} />
                    <Route path="/dashboard" element={<Dashboard loginName={loginName} setTechnicalStatus={setTechnicalStatus} stdname={stdname} />} />
                    <Route path="/program-skill" element={<ProgramSkill setProgramStatus={setProgramStatus} />} />
                    <Route path="/ai-placement" element={<AIPlacement stdname={stdname} loginName={loginName}></AIPlacement>} />

                    <Route path="*" element={<Navigate to={aptiStatus ? "/test-chooser" : "/aptitude-quiz"} />} />
                </>
                
            )}

            {role === "Faculty" && (
                <>
                    <Route path="/add-student" element={<AddStudent />} />
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
