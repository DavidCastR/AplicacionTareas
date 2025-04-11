import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/components/_TaskList.scss';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCompleted, setNewTaskCompleted] = useState(false);
  const navigate = useNavigate();
  const { status } = useParams();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las tareas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToFilter = (statusFilter) => {
    navigate(`/tasks/${statusFilter}`);
  };

  const displayTasks = () => {
    if (status === "completed") {
      return tasks.filter(task => task.completed);
    } else if (status === "pending") {
      return tasks.filter(task => !task.completed);
    }
    return tasks;
  };

  const addTask = async () => {
    if (newTaskTitle.trim() === "") {
      alert("Por favor, ingresa un título válido para la tarea");
      return;
    }

    try {
      const newTask = {
        userId: 1,
        title: newTaskTitle,
        completed: newTaskCompleted
      };

      const response = await axios.post("https://jsonplaceholder.typicode.com/todos", newTask);
      
      setTasks([...tasks, { ...response.data, id: tasks.length + 1 }]);
      setNewTaskTitle("");
      setNewTaskCompleted(false);
    } catch (err) {
      setError("Error al crear la tarea: " + err.message);
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const currentView = status || 'default';

  return (
    <div className={`task-container page-${currentView}`}>
      <h1>Gestión de Tareas</h1>
      
      <div className="task-filters">
        <button 
          onClick={() => navigate('/')} 
          className={`filter-btn all ${!status ? 'active' : ''}`}
        >
          Todas
        </button>
        <button 
          onClick={() => navigateToFilter('completed')} 
          className={`filter-btn completed ${status === 'completed' ? 'active' : ''}`}
        >
          Completadas
        </button>
        <button 
          onClick={() => navigateToFilter('pending')} 
          className={`filter-btn pending ${status === 'pending' ? 'active' : ''}`}
        >
          Pendientes
        </button>
      </div>

      <div className="task-form">
        <h2>Crear Nueva Tarea</h2>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Título de la tarea" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="task-input"
          />
          <div className="toggle-container">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={newTaskCompleted}
                onChange={(e) => setNewTaskCompleted(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Completada</span>
            </label>
          </div>
          <button onClick={addTask} className="add-btn">Agregar Tarea</button>
        </div>
      </div>

      {loading && <div className="loading">Cargando tareas...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="tasks-list">
          <h2>Lista de Tareas {status ? (status === "completed" ? "Completadas" : "Pendientes") : ""}</h2>
          {displayTasks().length === 0 ? (
            <p className="no-tasks">No hay tareas para mostrar</p>
          ) : (
            <ul>
              {displayTasks().map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
                  <div className="task-info">
                    <label className="toggle-label task-toggle">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleComplete(task.id)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-switch"></span>
                    </label>
                    <span className="task-title">{task.title}</span>
                  </div>
                  <span className={`task-status ${task.completed ? 'status-completed' : 'status-pending'}`}>
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskList;