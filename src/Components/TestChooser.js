import React, { useRef, useState } from "react";
import { Book, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import navigate
import Technical_subject_Skill from "./Technical_subject_Skill";
import Login from "./Login";

function TestChooser({ loginName, setTechnicalStatus }) {
    const [subname, setSubname] = useState("");
    const [selectedSubjectName, setSelectedSubjectName] = useState("Choose Subject");
    const selectedSubject = useRef(null);
    const navigate = useNavigate(); // Initialize navigate

    const subjectsList = {
        cs: [
            { display: "Programming Skill", code: "PS" },
            { display: "Computer Networks", code: "CN" },
            { display: "Operating System", code: "OS" },
            { display: "Database Management System", code: "DB" },
            { display: "Data-Structure and Algorithm", code: "DSA" },
            { display: "Object-Oriented Programming", code: "OOPS" },
            { display: "Software Engineering", code: "SE" }
        ],
        ec: [
            { display: "Programming Skill", code: "PS" },
            { display: "Electronic Circuits", code: "EC" },
            { display: "Micro Controllers", code: "MC" },
            { display: "Database Management System", code: "DB" },
            { display: "VLSI Design", code: "VD" },
            { display: "Object-Oriented Programming", code: "OOPS" },
            { display: "Operating System", code: "OS" }
        ],
        cv: [
            { display: "Basics of Civil Engineering", code: "CE" },
            { display: "Structural Engineering", code: "SE" },
            { display: "Strength of Materials", code: "SM" },
            { display: "CAED", code: "CAED" },
            { display: "Building Design", code: "BD" },
            { display: "Materials Management", code: "MM" },
            { display: "Building Materials", code: "BM" }
        ],
        me: [
            { display: "Basics of Mechanical Engineering", code: "ME" },
            { display: "Thermodynamics", code: "TD" },
            { display: "Theory of Machines", code: "TM" },
            { display: "CAED", code: "CAED" },
            { display: "Machine Design", code: "BD" },
            { display: "Fluid Mechanics", code: "MM" },
            { display: "Mechatronics", code: "BM" }
        ]
    };

    var stdBranch
    var subjects
    if(loginName.length===10){
     stdBranch = loginName.substring(5, 7); // Extracts the branch code
     subjects = subjectsList[stdBranch] || [];
    }
    const selectSubject = () => {
        const selectedValue = selectedSubject.current.value;
        const subject = subjects.find(sub => sub.display === selectedValue);

        if (subject) {
            setSubname(subject.code);
            setSelectedSubjectName(selectedValue);
        }
    };

    const handleTestSelection = () => {
        if (subname) {
            navigate("/program-skill"); // Navigate only after test selection
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                    <Book className="mx-auto text-blue-600 mb-4" size={80} />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Technical Assessment Portal
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Select a subject to begin your assessment
                    </p>
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ChevronDown className="text-gray-400" size={20} />
                    </div>
                    <select
                        ref={selectedSubject}
                        onChange={selectSubject}
                        defaultValue="Choose Subject"
                        className="
                            w-full pl-10 pr-4 py-2 
                            border border-gray-300 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            appearance-none text-gray-700
                        "
                    >
                        <option disabled>Choose Subject</option>
                        {subjects.map((subject, index) => (
                            <option key={index} value={subject.display}>
                                {subject.display}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <Check 
                            className={`${selectedSubjectName !== "Choose Subject" ? "text-green-500" : "text-transparent"}`} 
                            size={20} 
                        />
                    </div>
                </div>

                {selectedSubjectName === "Choose Subject" && (
                    <div className="text-center text-gray-500 text-sm italic">
                        Please select a subject to proceed
                    </div>
                )}

                {subname && (
                    <div className="mt-4 animate-fade-in">
                        <Technical_subject_Skill sub_name={subname} setTechnicalStatus={setTechnicalStatus} />
                    </div>
                )}

                
            </div>
        </div>
    );
}

export default TestChooser;
