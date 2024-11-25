import React from "react";

const TaskList = ({ tasks, onDelete, onEdit, canEdit }) => {
  if (tasks.length === 0) {
    return <p className="text-dark text-center mt-6 font-medium">No tasks added yet.</p>;
  }

  return (
    <ul className="divide-y divide-gray-300 bg-white rounded-lg shadow-card overflow-hidden max-w-4xl w-full mx-auto">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center p-4 hover:bg-neutral transition-all duration-200"
        >
          <div>
            <p className="text-lg font-semibold text-dark">{task.name}</p>
            <p className="text-sm text-gray-600 mt-1">{task.description || "No description provided."}</p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium text-dark">Due:</span>{" "}
              {task.dueDate || "No deadline"}{" "}
              <span className="mx-2">|</span>
              <span className="font-medium text-dark">Priority:</span>{" "}
              <span
                className={`font-bold ${
                  task.priority === "High"
                    ? "text-danger"
                    : task.priority === "Medium"
                    ? "text-orange"
                    : "text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </p>
          </div>
          {canEdit && (
            <div className="flex space-x-4">
              <button
                onClick={() => onEdit(task)}
                className="bg-orange text-white px-4 py-2 rounded-md font-medium hover:bg-deepBlue transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="bg-danger text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
