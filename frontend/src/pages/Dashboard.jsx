import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Yet To Start',
    priority: 'Low',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'Completed' }),
      });
      if (response.ok) {
        fetchTasks(); // Refresh tasks after updating
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewTask({
          title: '',
          description: '',
          status: 'Yet To Start',
          priority: 'Low',
        });
        fetchTasks();
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filterTasks = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand">Taskify</span>
          <div className="d-flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              Add Task
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Yet To Start</h5>
              </div>
              <div className="card-body">
                {filterTasks('Yet To Start').map((task) => (
                  <div key={task._id} className="task-card mb-3 p-3 border rounded">
                    <h6 className="mb-2">{task.title}</h6>
                    <p className="text-muted small mb-2">{task.description}</p>
                    <span className={`badge ${
                      task.priority === 'High' ? 'bg-danger' :
                      task.priority === 'Medium' ? 'bg-warning' :
                      'bg-success'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">In Progress</h5>
              </div>
              <div className="card-body">
                {filterTasks('In Progress').map((task) => (
                  <div key={task._id} className="task-card mb-3 p-3 border rounded">
                    <h6 className="mb-2">{task.title}</h6>
                    <p className="text-muted small mb-2">{task.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge ${
                        task.priority === 'High' ? 'bg-danger' :
                        task.priority === 'Medium' ? 'bg-warning' :
                        'bg-success'
                      }`}>
                        {task.priority}
                      </span>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleComplete(task._id)}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Completed</h5>
              </div>
              <div className="card-body">
                {filterTasks('Completed').map((task) => (
                  <div key={task._id} className="task-card mb-3 p-3 border rounded">
                    <h6 className="mb-2">{task.title}</h6>
                    <p className="text-muted small mb-2">{task.description}</p>
                    <span className={`badge ${
                      task.priority === 'High' ? 'bg-danger' :
                      task.priority === 'Medium' ? 'bg-warning' :
                      'bg-success'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddTask}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={newTask.priority}
                        onChange={(e) =>
                          setNewTask({ ...newTask, priority: e.target.value })
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={newTask.status}
                        onChange={(e) =>
                          setNewTask({ ...newTask, status: e.target.value })
                        }
                      >
                        <option value="Yet To Start">Yet To Start</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;