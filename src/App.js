import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskValue, setEditingTaskValue] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  // Add a new task
  const addTask = () => {
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    })
      .then((response) => response.json())
      .then((newTask) => setTasks([...tasks, newTask]));
    setTask(""); // Reset the input field
  };

  // Delete a task
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((t) => t._id !== id)));
  };

  // Start editing a task
  const startEditingTask = (id, currentTask) => {
    setEditingTaskId(id);
    setEditingTaskValue(currentTask); // Imposta il valore dell'attività corrente
  };

  // Update a task
  function updateTask(id) {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: editingTaskValue }), // Passa il nuovo valore
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((t) => (t._id === id ? updatedTask : t)) // Aggiorna l'elenco
        );
        setEditingTaskId(null); // Esce dalla modalità di modifica
        setEditingTaskValue(""); // Resetta il campo di input
      });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={addTask} style={{ padding: "5px 10px" }}>
          Add Task
        </button>
      </div>
      <ul style={{ marginTop: "20px" }}>
        {tasks.map((t) => (
          <li key={t._id} style={{ marginBottom: "10px" }}>
            {editingTaskId === t._id ? (
              <>
                <input
                  type="text"
                  value={editingTaskValue}
                  onChange={(e) => setEditingTaskValue(e.target.value)}
                  style={{ marginRight: "10px", padding: "5px" }}
                />
                <button
                  onClick={() => updateTask(t._id)}
                  style={{
                    padding: "2px 5px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {t.task}
                <button
                  onClick={() => startEditingTask(t._id, t.task)}
                  style={{
                    marginLeft: "10px",
                    padding: "2px 5px",
                    color: "white",
                    background: "blue",
                    border: "none",
                    borderRadius: "3px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(t._id)}
                  style={{
                    marginLeft: "10px",
                    padding: "2px 5px",
                    color: "white",
                    background: "red",
                    border: "none",
                    borderRadius: "3px",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
