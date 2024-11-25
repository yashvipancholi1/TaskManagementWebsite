import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Taskapp from "./TaskList/Taskapp";
import MakeAdmin from "./pages/MakeAdmin";
import { useState, createContext, useContext, useEffect } from "react";

export const AuthContext = createContext();

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    name: null,
    status: null,
    permissions: [],
  });

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth?.isAuthenticated) {
      setAuth(storedAuth);
    }
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth({
      isAuthenticated: false,
      role: null,
      name: null,
      status: null,
      permissions: [],
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div className="App h-screen flex flex-col bg-paleBlue">
        {/* Navigation Bar */}
        <nav className="p-4 bg-white shadow-nav flex justify-center items-center space-x-8">
          <Link
            to="/"
            className="text-lg font-semibold text-lightBlue hover:text-deepBlue hover:underline transition duration-200"
          >
            Home
          </Link>
          {!auth.isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-lg font-semibold text-lightBlue hover:text-deepBlue hover:underline transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-lg font-semibold text-orange hover:text-deepBlue hover:underline transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
          {auth.isAuthenticated && (
            <>
              {auth.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-lg font-semibold text-lightBlue hover:text-deepBlue hover:underline transition duration-200"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/tasks"
                className="text-lg font-semibold text-lightBlue hover:text-deepBlue hover:underline transition duration-200"
              >
                Task List
              </Link>
              <button
                onClick={logout}
                className="text-lg font-semibold text-orange hover:text-danger hover:scale-105 transition duration-200"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center bg-paleBlue">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute role="user">
                  <Taskapp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/make-admin"
              element={
                <ProtectedRoute role="admin">
                  <MakeAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="p-4 bg-white shadow-nav text-center text-sm text-lightBlue">
          &copy; {new Date().getFullYear()} Your App. All rights reserved.
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

// Home Page Component
const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    // Fetch user and task data from db.json
    const fetchData = async () => {
      try {
        const usersResponse = await fetch("http://localhost:3001/users");
        const tasksResponse = await fetch("http://localhost:3001/tasks");
        const usersData = await usersResponse.json();
        const tasksData = await tasksResponse.json();

        setTotalUsers(usersData.length);
        setTotalTasks(tasksData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-center px-6">
      {auth.isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold text-deepBlue drop-shadow-lg">
            {auth.role === "admin"
              ? `Welcome, Admin ${auth.name}`
              : `Welcome, ${auth.name}`}
          </h1>
          {/* Dashboard Overview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-card p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-deepBlue">
                Total Users
              </h2>
              <p className="text-4xl font-bold text-orange">{totalUsers}</p>
            </div>
            <div className="bg-white shadow-card p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-deepBlue">
                Total Tasks
              </h2>
              <p className="text-4xl font-bold text-orange">{totalTasks}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-5xl font-extrabold text-orange animate-bounce">
            Welcome to the App
          </h1>
          <p className="mt-6 text-lg text-lightBlue">
            Please login or sign up to continue.
          </p>
        </>
      )}
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin" && auth.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (auth.status !== "Active") {
    return (
      <div className="text-center text-orange font-semibold">
        Your account is not active. Please contact support.
      </div>
    );
  }

  return children;
};

export default App;
