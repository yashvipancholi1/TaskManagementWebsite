import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "your pet's name",
    securityAnswer: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      // Fetch existing users
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) {
        throw new Error("Failed to fetch existing users");
      }
      const users = await response.json();
  
      // Check if email already exists
      const existingUser = users.find((user) => user.email === formData.email);
      if (existingUser) {
        alert("The User Email Id already exists, please Login");
        return;
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(formData.password, 10);
  
      // Create new user object
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
        role: "user",
        status: "Active",
        permissions: ["Read"],
      };
  
      // Save new user to the database
      const saveResponse = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
  
      if (saveResponse.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating your account. Please try again.");
    }
  };
  

  return (
    <form
      className="max-w-lg mx-auto p-6 bg-neutral shadow-card rounded-lg mt-10 space-y-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-semibold text-dark mb-4">Sign Up</h1>

      {/* Name input field */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Email input field */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Password input field */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Confirm Password input field */}
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className="w-full p-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Security Question dropdown */}
      <label className="block text-dark text-sm font-medium mb-2">
        Security Question
      </label>
      <select
        name="securityQuestion"
        value={formData.securityQuestion}
        onChange={handleChange}
        className="w-full p-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="your pet's name">Your pet's name</option>
        <option value="your favorite chocolate">Your favorite chocolate</option>
        <option value="a random word">A random word</option>
      </select>

      {/* Security Answer input field */}
      <input
        type="text"
        name="securityAnswer"
        placeholder="Security Answer"
        value={formData.securityAnswer}
        onChange={handleChange}
        required
        className="w-full p-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-2 bg-primary text-white font-medium rounded-md hover:bg-secondary transition-smooth"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
