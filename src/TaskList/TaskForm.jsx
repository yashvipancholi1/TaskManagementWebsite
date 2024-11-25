import React, { useState, useEffect } from "react";

const TaskForm = ({ onSave, editingTask }) => {
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.trim() === "") return;
    onSave(task);
    setTask({ name: "", description: "", priority: "Medium", dueDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-neutral p-6 rounded-lg shadow-card">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary"
          placeholder="Task Name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          required
        />
        <select
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <textarea
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-primary mt-4"
        placeholder="Description (optional)"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <input
        type="date"
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-primary mt-4"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />
      <button
        type="submit"
        className="bg-primary text-white py-3 px-6 rounded-lg mt-6 w-full hover:bg-lightBlue transition-all duration-300"
      >
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
