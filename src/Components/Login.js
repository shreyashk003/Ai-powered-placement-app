import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react";

const Login = ({ setRole, setUsername, setloginName, setusn , setstdName }) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        role: "Student", // default role
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            let endpoint = "";

            switch (user.role) {
                case "Student":
                    endpoint = "http://localhost:8080/api/StudentLogin";
                    break;
                case "Faculty":
                    endpoint = "http://localhost:8080/api/FacultyLogin";
                    break;
                case "Admin":
                    endpoint = "http://localhost:8080/api/AdminLogin";
                    break;
                default:
                    setMessage("Invalid role selected.");
                    setIsLoading(false);
                    return;
            }

            const response = await axios.post(endpoint, user, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data && response.data.length > 0) {
                const userData = response.data[0];

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("role", userData.role);
                localStorage.setItem("uname", userData.stdname || userData.username);

                setRole(userData.role);
                setusn(userData.usn || "");
                setUsername(userData.stdname || userData.username);
                setloginName(userData.username);
                setstdName(userData.stdname)

                setMessage("Login Successful!");
            } else {
                setMessage("Invalid credentials! Please try again.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error logging in! Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-blue-600 text-white p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <Shield size={48} strokeWidth={1.5} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">Welcome Back</h2>
                    <p className="text-blue-100 mt-2">Sign in to continue to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {message && (
                        <div
                            className={`p-3 rounded-lg text-center ${
                                message.includes("Error") || message.includes("Invalid")
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Username */}
                        <div className="relative">
                            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your username"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 text-white font-bold rounded-lg transition duration-300 ${
                            isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        }`}
                    >
                        {isLoading ? "Logging in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
