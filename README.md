Role-Based Access Control (RBAC) Task Management System
A secure and dynamic Role-Based Access Control (RBAC) system designed for efficient Task Management. This project provides an intuitive Admin Dashboard for managing users, roles, and permissions, ensuring users can only access and modify data based on their assigned roles and permissions.

📘 Project Overview
This system implements a Task Management Platform with role-based access and permissions, featuring:

User Authentication:

Secure Sign-Up and Login functionality.
Users can access the platform based on their Active/Inactive status.
Task List Access:

Users with Read permission can view the Task List but cannot modify it.
Users with Write permission can view and make changes to the Task List.
Admin Dashboard:

Administrators have access to a comprehensive dashboard for:
Viewing all registered users.
Managing user roles, permissions, and statuses (Active/Inactive).
Adding or removing users from the system.
Modifying permissions dynamically.
Role Management:

Define and edit roles.
Assign or revoke permissions (e.g., Read, Write) for each role.
Mock API with JSON Server:

Simulated backend for handling CRUD operations on:
Users: Add, edit, delete, and assign roles.
Tasks: Manage task-related operations.
Enables realistic server responses to validate frontend functionality.
✨ Features
🧑‍💼 User Management
View and manage a list of users, including their roles, permissions, and statuses.
Add, edit, or delete users as needed.
Dynamically assign roles (e.g., Admin, Editor, Viewer) and permissions (Read/Write).
🛡️ Role Management
Define roles with specific permissions.
Update roles to include:
Read: View-only access.
Write: Permission to edit tasks.
🔒 Dynamic Permissions
Securely assign and modify permissions for roles.
Tailor access control based on user roles.
⚙️ Admin Dashboard
Manage users, roles, and permissions from a dedicated admin panel.
Add or remove users dynamically.
🗃️ Task List Access
Users with appropriate permissions can:
Read: View tasks.
Write: Edit tasks.
📂 Project Structure
VRVSecurityRBACtask/
├── node_modules/
├── public/
├── server/
│   ├── db.json             # Mock API data for users and tasks
│   ├── package.json        # Server dependencies and scripts
├── src/
│   ├── assets/             # Static assets (e.g., images, icons)
│   ├── contexts/           # Context API for state management
│   ├── pages/              # Core pages of the application
│   │   ├── AdminPage.jsx   # Admin Dashboard
│   │   ├── Document.jsx    # Placeholder page
│   │   ├── Login.jsx       # Login page
│   │   ├── MakeAdmin.jsx   # Role and Permission Assignment
│   │   ├── SearchBar.jsx   # Search functionality
│   │   ├── SignUp.jsx      # User registration
│   ├── TaskList/           # Task management components
│   │   ├── TaskApp.jsx     # Main TaskList component
│   │   ├── TaskForm.jsx    # Task editing form
│   │   ├── TaskList.jsx    # List of tasks
│   ├── App.jsx             # Main App component
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles
│   ├── main.jsx            # Application entry point
├── .gitignore
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # Tailwind/PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration


🚀 Setup and Installation
Follow these steps to set up and run the project:

Clone the Repository:

bash
Copy code
git clone https://github.com/yashvipancholi1/TaskManagementWebsite.git
cd VRVSecurityRBACTask
Install Dependencies: For the frontend:

bash
Copy code
npm install
For the server:

bash
Copy code
cd server
npm install
Start the Mock API Server: Run the JSON Server on port 3001:

bash
Copy code
npm run start:server
Run the Development Server: Start the Vite development server:

bash
Copy code
npm run dev
Open your browser and navigate to:

plaintext
Copy code
http://localhost:5173
🛠 Dependencies
Frontend (from package.json):
react: ^18.3.1
react-dom: ^18.3.1
react-router-dom: ^7.0.1
tailwindcss: ^3.4.15
vite: ^5.4.10
Backend (from server/package.json):
json-server: ^1.0.0-beta.3
💡 Usage
Sign Up/Log In:

Users can sign up and log in to the platform.
Access to features depends on their role and permission.
Task Management:

Users with Read permission can only view tasks.
Users with Write permission can view and modify tasks.
Admin Panel:

Administrators can manage users, roles, and permissions through the Admin Dashboard.
Mock API:

Simulates backend CRUD operations on users and tasks via JSON Server.
🧩 Contribution
Contributions are welcome! Feel free to fork the repository, open an issue, or submit a pull request. 😊

📝 License
This project is licensed under the MIT License. See the LICENSE file for more details.

