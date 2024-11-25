import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserDetails, setNewUserDetails] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setTempUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery);

      const matchesPermissions =
        filterRole === "All" ||
        (Array.isArray(user.permissions) &&
          user.permissions.some(
            (permission) => permission.toLowerCase() === filterRole.toLowerCase()
          ));

      const matchesStatus =
        filterStatus === "All" || user.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesPermissions && matchesStatus;
    });

    setTempUsers(filteredUsers);
  }, [searchQuery, filterRole, filterStatus, users]);

  const handleAddUser = async () => {
    const { name, email } = newUserDetails;
  
    if (!name.trim() || !email.trim()) {
      alert("Username and email cannot be empty!");
      return;
    }
  
    try {
      // Fetch existing users
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) {
        throw new Error("Failed to fetch existing users");
      }
      const existingUsers = await response.json();
  
      // Check if email already exists
      const emailExists = existingUsers.some(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase()
      );
  
      if (emailExists) {
        alert("The user with this email id already exists!");
        return;
      }
  
      // Hash default password
      const defaultPassword = "support";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  
      // Create new user object
      const newUser = {
        id: `${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        status: "Active",
        role: "user",
        permissions: ["Read"],
      };
  
      // Add new user to the database
      const addUserResponse = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
  
      if (addUserResponse.ok) {
        const addedUser = await addUserResponse.json();
        setUsers([...users, addedUser]);
        setTempUsers([...tempUsers, addedUser]);
        setShowAddUserForm(false);
        setNewUserDetails({ name: "", email: "" });
        alert("User added successfully!");
      } else {
        throw new Error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user. Please try again.");
    }
  };
  

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedUsers = tempUsers.filter((user) => user.id.toString() !== id.toString());
        setUsers(updatedUsers);
        setTempUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateUser = async (id, updatedFields) => {
    const updatedUser = tempUsers.find((user) => user.id === id);
    const updatedUserData = { ...updatedUser, ...updatedFields };

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        setUsers(tempUsers.map((user) => (user.id === id ? updatedUserData : user)));
        setTempUsers(tempUsers.map((user) => (user.id === id ? updatedUserData : user)));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="flex flex-wrap space-x-4 mt-4">
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 shadow-md"
          onClick={() => setShowAddUserForm(true)}
        >
          Add User
        </button>
        <Link
          to="/make-admin"
          className="bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600 shadow-md"
        >
          Make Admin
        </Link>
      </div>

      {showAddUserForm && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUser();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name:</label>
              <input
                type="text"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={newUserDetails.name}
                onChange={(e) =>
                  setNewUserDetails({ ...newUserDetails, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email:</label>
              <input
                type="email"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={newUserDetails.email}
                onChange={(e) =>
                  setNewUserDetails({ ...newUserDetails, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-wrap space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 shadow-md"
              >
                Add User
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 shadow-md"
                onClick={() => setShowAddUserForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <div className="hidden sm:block">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-800 text-sm">
                <th className="border px-4 py-2">Index</th>
                <th className="border px-4 py-2">User ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Permissions</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tempUsers.map((user, index) => (
                <tr key={user.id} className="text-center bg-gray-50 hover:bg-gray-100">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <select
                      className="border border-gray-300 rounded px-2 py-1"
                      value={user.permissions?.[0] || ""}
                      onChange={(e) => {
                        const newPermission = e.target.value;
                        setTempUsers(
                          tempUsers.map((u) =>
                            u.id === user.id
                              ? { ...u, permissions: [newPermission] }
                              : u
                          )
                        );
                        updateUser(user.id, { permissions: [newPermission] });
                      }}
                    >
                      <option value="Read">Read</option>
                      <option value="Write">Write</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      className="border border-gray-300 rounded px-2 py-1"
                      value={user.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setTempUsers(
                          tempUsers.map((u) =>
                            u.id === user.id ? { ...u, status: newStatus } : u
                          )
                        );
                        updateUser(user.id, { status: newStatus });
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 shadow-md"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Responsive Cards */}
        <div className="sm:hidden space-y-4">
          {tempUsers.map((user, index) => (
            <div
              key={user.id}
              className="p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md"
            >
              <div className="text-sm font-semibold">Index: {index + 1}</div>
              <div className="text-sm">User ID: {user.id}</div>
              <div className="text-sm">Name: {user.name}</div>
              <div className="text-sm">Email: {user.email}</div>
              <div className="text-sm">Permissions: 
                <select
                  className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                  value={user.permissions?.[0] || ""}
                  onChange={(e) => {
                    const newPermission = e.target.value;
                    setTempUsers(
                      tempUsers.map((u) =>
                        u.id === user.id
                          ? { ...u, permissions: [newPermission] }
                          : u
                      )
                    );
                    updateUser(user.id, { permissions: [newPermission] });
                  }}
                >
                  <option value="Read">Read</option>
                  <option value="Write">Write</option>
                </select>
              </div>
              <div className="text-sm">Status: 
                <select
                  className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                  value={user.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setTempUsers(
                      tempUsers.map((u) =>
                        u.id === user.id ? { ...u, status: newStatus } : u
                      )
                    );
                    updateUser(user.id, { status: newStatus });
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 shadow-md"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

