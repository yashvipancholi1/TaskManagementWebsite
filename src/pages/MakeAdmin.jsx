import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import bcrypt from "bcryptjs"; 

const MakeAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:3001/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Error fetching users:", error);
        alert("There was an error fetching users. Please check the API server.");
      });
  }, []);

  const handleUserSelect = (event) => {
    const userId = event.target.value;
    const user = users.find((user) => String(user.id) === userId); 
    setSelectedUser(user);
  };

  const handleConfirm = async () => {
    if (!newPassword || !securityQuestion || !securityAnswer) {
      alert("Please fill out all fields.");
      return;
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const updatedUser = {
      ...selectedUser,
      password: hashedPassword,
      securityQuestion,
      securityAnswer,
      role: "admin",
      permissions: ["Read", "Write"],
      status: "Active",
    };

    try {
      const response = await fetch(`http://localhost:3001/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert("User promoted to Admin successfully!");
        navigate("/admin");
      } else {
        alert("Failed to promote user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to promote user.");
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral p-6">
      <div className="bg-white p-8 rounded-2xl shadow-card w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-deepBlue mb-6 text-center">Make Admin</h1>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Select a User to Promote:</h3>
          <select
            onChange={handleUserSelect}
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none mt-2 text-gray-700"
            defaultValue="" 
          >
            <option value="" disabled>-- Select a User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">User Details</h3>
            <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {selectedUser.name}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="text-sm text-gray-600 mb-3"><strong>ID:</strong> {selectedUser.id}</p>

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-800">Set New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none mt-2 text-gray-700"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-800">Select Security Question:</label>
              <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none mt-2 text-gray-700"
              >
                <option value="">-- Select a Question --</option>
                <option value="your pet's name">Your pet's name</option>
                <option value="your favorite chocolate">Your favorite chocolate</option>
                <option value="a random word">A random word</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-800">Answer:</label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none mt-2 text-gray-700"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
