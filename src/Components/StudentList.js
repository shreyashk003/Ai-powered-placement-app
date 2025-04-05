import axios from "axios";
import { useEffect, useState } from "react";

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/getAllStudent");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students", error);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f0f8ff", padding: "20px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1E3A8A", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                📋 Student List
            </h2>
            
            <div style={{ width: "100%", maxWidth: "900px", overflow: "hidden", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    {/* Table Header */}
                    <thead>
                        <tr style={{ backgroundColor: "#1E3A8A", color: "white", textAlign: "left" }}>
                            <th style={{ padding: "12px", fontSize: "16px" }}>ID</th>
                            <th style={{ padding: "12px", fontSize: "16px" }}>USN</th>
                            <th style={{ padding: "12px", fontSize: "16px" }}>Name</th>
                            <th style={{ padding: "12px", fontSize: "16px" }}>Semester</th>
                            <th style={{ padding: "12px", fontSize: "16px" }}>Branch</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr
                                    key={student.id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "#f0f4ff" : "#ffffff",
                                        borderBottom: "1px solid #ddd",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dbeafe"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f0f4ff" : "#ffffff"}
                                >
                                    <td style={{ padding: "12px", color: "#374151", fontWeight: "500" }}>{student.id}</td>
                                    <td style={{ padding: "12px", color: "#374151" }}>{student.usn}</td>
                                    <td style={{ padding: "12px", color: "#1E40AF", fontWeight: "600" }}>{student.stdname}</td>
                                    <td style={{ padding: "12px", color: "#374151" }}>{student.sem}</td>
                                    <td style={{ padding: "12px", color: "#374151" }}>{student.branch}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#6B7280", fontSize: "18px" }}>
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
