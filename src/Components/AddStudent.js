import axios from "axios";
import { useState } from "react";

const AddStudent = () => {
    const [student, setStudent] = useState({
        usn: "",
        stdname: "",
        sem: "",
        branch: ""
    });

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            usn: student.usn,
            stdname: student.stdname,
            sem: parseInt(student.sem), // Ensure sem is an integer
            branch: student.branch
        };

        try {
            const response = await axios.post("http://localhost:8080/api/saveStudent", payload, {
                headers: { "Content-Type": "application/json" }
            });

            alert("Student added successfully!");
            console.log(response.data);
            setStudent({ usn: "", stdname: "", sem: "", branch: "" }); // Reset form
        } catch (error) {
            console.error("Error adding student", error);
            alert("Failed to add student");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-blue-50 py-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">➕ Add Student</h2>

            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <label className="block font-medium text-gray-700 mb-1">USN:</label>
                <input 
                    type="text" 
                    name="usn" 
                    value={student.usn} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <label className="block font-medium text-gray-700 mb-1">Name:</label>
                <input 
                    type="text" 
                    name="stdname" 
                    value={student.stdname} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <label className="block font-medium text-gray-700 mb-1">Semester:</label>
                <input 
                    type="number" 
                    name="sem" 
                    value={student.sem} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <label className="block font-medium text-gray-700 mb-1">Branch:</label>
                <input 
                    type="text" 
                    name="branch" 
                    value={student.branch} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <button 
                    type="submit" 
                    className="w-full py-2 bg-blue-900 text-white font-bold rounded-lg transition duration-300 hover:bg-blue-700"
                >
                    Add Student
                </button>
            </form>
        </div>
    );
};

export default AddStudent;
