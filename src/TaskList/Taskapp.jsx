import React, { useState, useContext, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { AuthContext } from "../App";

const Taskapp = () => {
  const { auth } = useContext(AuthContext);

  const hasWritePermission = auth.permissions.includes("Write");
  const hasReadPermission = auth.permissions.includes("Read");

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  if (!auth.status || auth.status !== "Active") {
    return <p className="text-center text-danger mt-10 font-medium">Access denied: Your account is not active.</p>;
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3001/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSaveTask = async (task) => {
    if (!hasWritePermission) return;

    const newTask = { ...task, id: Date.now() };

    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!hasWritePermission) return;

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task) => {
    if (!hasWritePermission) return;
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const toggleTaskForm = () => {
    if (isFormVisible) {
      setIsFormVisible(false);
      setEditingTask(null);
    } else {
      setIsFormVisible(true);
      setEditingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral p-6 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-card rounded-xl p-8">
        <h1 className="text-4xl font-bold text-dark mb-8 text-center">Task List</h1>

        {hasWritePermission && isFormVisible && (
          <TaskForm onSave={handleSaveTask} editingTask={editingTask} />
        )}

        {hasWritePermission && (
          <button
            onClick={toggleTaskForm}
            className={`${
              isFormVisible
                ? "bg-danger hover:bg-red-500"
                : "bg-primary hover:bg-lightBlue"
            } text-white py-3 px-6 rounded-lg transition-all duration-300 mb-6`}
          >
            {isFormVisible ? "Cancel" : "Add Task"}
          </button>
        )}

        {hasWritePermission || hasReadPermission ? (
          <TaskList
            tasks={tasks}
            onDelete={hasWritePermission ? handleDeleteTask : null}
            onEdit={hasWritePermission ? handleEditTask : null}
            canEdit={hasWritePermission}
          />
        ) : (
          <p className="text-center text-gray-500">You do not have access to view tasks.</p>
        )}
      </div>
    </div>
  );
};

export default Taskapp;
