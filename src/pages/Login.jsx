import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { AuthContext } from "../App";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(null);
  const [email, setEmail] = useState("");
  const [securityData, setSecurityData] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState({ password: "", confirmPassword: "" });
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth?.isAuthenticated) {
      setAuth(storedAuth);
      navigate(storedAuth.role === "admin" ? "/admin" : "/");
    }
  }, [setAuth, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();
      const user = users.find((u) => u.email === formData.email);

      if (user && (await bcrypt.compare(formData.password, user.password))) {
        if (user.status === "Inactive") {
          alert("Your account is inactive. Contact admin.");
          return;
        }

        const authData = {
          isAuthenticated: true,
          role: user.role.toLowerCase(),
          name: user.name,
          status: user.status,
          permissions: user.permissions || [],
        };

        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
        navigate(user.role === "admin" ? "/admin" : "/");
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();
      const user = users.find((u) => u.email === email);

      if (user) {
        setSecurityData({
          question: user.securityQuestion,
          answer: user.securityAnswer,
          userId: user.id,
        });
        setForgotPasswordStep("security");
      } else {
        alert("Email not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCheckSecurityAnswer = () => {
    if (securityAnswer === securityData.answer) {
      setForgotPasswordStep("reset");
    } else {
      alert("Incorrect answer.");
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword.password !== newPassword.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword.password, 10);
      const response = await fetch(`http://localhost:3001/users/${securityData.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: hashedPassword }),
      });

      if (response.ok) {
        alert("Password reset successfully.");
        setForgotPasswordStep(null);
      } else {
        alert("Error resetting password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-neutral shadow-card rounded-lg mt-18">
      <h1 className="text-2xl font-semibold text-dark mb-6">Login</h1>
      {forgotPasswordStep === null ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white font-medium rounded-md hover:bg-lightBlue transition-smooth"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full text-primary hover:text-lightBlue text-sm underline"
            onClick={() => setForgotPasswordStep("email")}
          >
            Forgot Password?
          </button>
        </form>
      ) : forgotPasswordStep === "email" ? (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-dark">Recover Account</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleForgotPassword}
            className="w-full py-2 bg-primary text-white font-medium rounded-md hover:bg-lightBlue transition-smooth"
          >
            Recover Account
          </button>
        </div>
      ) : forgotPasswordStep === "security" ? (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-dark">Security Question</h2>
          <div className="text-sm text-gray-600">
            <strong>Email:</strong> {email}
          </div>
          <p className="text-dark">{securityData.question}</p>
          <input
            type="text"
            placeholder="Answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleCheckSecurityAnswer}
            className="w-full py-2 bg-primary text-white font-medium rounded-md hover:bg-lightBlue transition-smooth"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-dark">Create New Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword.password}
            onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Re-enter New Password"
            value={newPassword.confirmPassword}
            onChange={(e) => setNewPassword({ ...newPassword, confirmPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handlePasswordReset}
            className="w-full py-2 bg-primary text-white font-medium rounded-md hover:bg-lightBlue transition-smooth"
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
