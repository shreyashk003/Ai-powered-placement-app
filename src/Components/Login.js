import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, Shield, ChevronDown, Key, UserCircle, Settings, LogIn } from "lucide-react";

const Login = ({sem,setSem, setRole, setUsername, setloginName, setusn, setstdName, setSSLCScore, setPucScore, setBe1Score, setBe2Score, setBe3Score }) => {
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

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            
            const data = await response.json();

            if (data && data.length > 0) {
                const userData = data[0];

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("role", userData.role);
                localStorage.setItem("uname", userData.stdname || userData.username);

                setRole(userData.role);
                setusn(userData.usn || "");
                setUsername(userData.stdname || userData.username);
                setloginName(userData.username);
                setstdName(userData.stdname)
                setSSLCScore(userData.sslcscore);
                setPucScore(userData.pucscore)
                setBe1Score(userData.be1Score)
                setBe2Score(userData.be2Score)
                setBe3Score(userData.be3Score)
                alert(userData.sem)
                setSem(userData.sem)
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

    // Role options with icons
    const roleOptions = [
        { value: "Student", label: "Student", icon: <UserCircle size={20} />, color: "text-emerald-500" },
        { value: "Faculty", label: "Faculty", icon: <User size={20} />, color: "text-amber-500" },
        { value: "Admin", label: "Admin", icon: <Settings size={20} />, color: "text-purple-500" }
    ];

    const getRoleIcon = () => {
        const selectedRole = roleOptions.find(option => option.value === user.role);
        return selectedRole ? <div className={selectedRole.color}>{selectedRole.icon}</div> : null;
    };

    const getRoleColor = () => {
        switch (user.role) {
            case "Student": return "from-emerald-500 to-teal-600";
            case "Faculty": return "from-amber-500 to-orange-600"; 
            case "Admin": return "from-purple-500 to-indigo-600";
            default: return "from-emerald-500 to-teal-600";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
  <div className="w-full max-w-3xl overflow-hidden">
    <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl">
      {/* Left column with illustration */}
      <div className={`bg-gradient-to-b ${getRoleColor()} p-10 text-white md:w-2/5 flex flex-col justify-between relative rounded-l-2xl`}>
        <div className="z-10">
          <h1 className="text-2xl font-bold mb-2">Education Portal</h1>
          <div className="h-1 w-10 bg-white mb-6"></div>
          <p className="font-medium">Welcome back!</p>
          <p className="opacity-80 text-sm mt-2">Sign in to continue to your dashboard</p>
        </div>

        <div className="z-10 mt-10">
          <div className="flex items-center">
            <Shield size={24} className="mr-2" />
            <p className="text-sm">Protected by advanced encryption</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 -ml-16 -mb-16"></div>
      </div>

      {/* Right column with form */}
      <div className="bg-white p-10 md:w-3/5 rounded-r-2xl">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
          <p className="text-slate-500 text-sm mt-1">Please enter your credentials to continue</p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 ${
              message.includes("Error") || message.includes("Invalid")
                ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                : "bg-green-50 text-green-700 border-l-4 border-green-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-xs uppercase tracking-wide font-semibold text-slate-500 mb-1">
              I am a
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">{getRoleIcon()}</div>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full appearance-none pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all cursor-pointer shadow-sm"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs uppercase tracking-wide font-semibold text-slate-500 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={20} />
              </div>
              <input
                id="username"
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-xs uppercase tracking-wide font-semibold text-slate-500">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Key size={20} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${getRoleColor()} hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500`
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-px w-12 bg-slate-200"></div>
            <span className="px-2 text-xs text-slate-400 uppercase tracking-wide">Secure System</span>
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">© {new Date().getFullYear()} Education Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</div>
    )
};

export default Login;