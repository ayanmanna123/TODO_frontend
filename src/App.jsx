import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, List, BarChart2, Bell } from 'lucide-react';
import axios from 'axios';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import NotificationCenter from './components/NotificationCenter';
import LoginSignup from './components/LoginSignup';
import { LogIn, UserPlus, LogOut } from 'lucide-react'; 

const API_URL = 'https://todo-backensd.vercel.app/api';

// Configure axios with auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
      checkForEndOfDayNotification();
      // Check for notifications every minute
      const notificationInterval = setInterval(checkForEndOfDayNotification, 60000);
      return () => clearInterval(notificationInterval);
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // If we get 401, user is not authenticated
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };
  
  const addTodo = async (todo) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
      // Handle 401 error
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      
      // If marking as complete, add a notification
      if (updatedTodo.completed && !todos.find(t => t._id === id).completed) {
        addNotification(`Task completed: ${updatedTodo.title}`);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      // Handle 401 error
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Handle 401 error
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const checkForEndOfDayNotification = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Check if it's end of day (5:00 PM)
    if (hours === 24 && minutes === 0) {
      const completedToday = todos.filter(todo => {
        const completedDate = todo.completedAt ? new Date(todo.completedAt) : null;
        return completedDate && 
               completedDate.getDate() === now.getDate() &&
               completedDate.getMonth() === now.getMonth() &&
               completedDate.getFullYear() === now.getFullYear();
      });
      
      const pendingTodos = todos.filter(todo => !todo.completed);
      
      addNotification(`End of day summary: ${completedToday.length} tasks completed, ${pendingTodos.length} tasks pending.`);
      
      // Trigger auto-planning for tomorrow
      planTomorrow();
    }
  };
  
  const planTomorrow = async () => {
    try {
      const response = await axios.post(`${API_URL}/todos/plan-tomorrow`);
      if (response.data.planned) {
        addNotification("Tomorrow's tasks have been automatically planned based on your completion patterns.");
        fetchTodos(); // Refresh todos to show the newly planned items
      }
    } catch (error) {
      console.error('Error planning tomorrow:', error);
      // Handle 401 error
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      date: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTodos([]);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">Smart Todo</span>
              </div>
              <div className="flex">
                {isAuthenticated ? (
                  <>
                    <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-500">
                      <List className="h-5 w-5 mr-1" />
                      Tasks
                    </Link>
                    <Link to="/calendar" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-500">
                      <Calendar className="h-5 w-5 mr-1" />
                      Calendar
                    </Link>
                    <Link to="/analytics" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-500">
                      <BarChart2 className="h-5 w-5 mr-1" />
                      Analytics
                    </Link>
                    <Link to="/notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-500">
                      <Bell className="h-5 w-5 mr-1" />
                      <span>Notifications</span>
                      {notifications.length > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {notifications.length}
                        </span>
                      )}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-500"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-500">
                    <LogIn className="h-5 w-5 mr-1" />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>
                    <TodoForm addTodo={addTodo} />
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <TodoList 
                      todos={todos} 
                      updateTodo={updateTodo} 
                      deleteTodo={deleteTodo} 
                    />
                  )}
                </div>
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarView todos={todos} updateTodo={updateTodo} />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics todos={todos} />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationCenter 
                  notifications={notifications}
                  dismissNotification={dismissNotification}
                />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <LoginSignup onLoginSuccess={handleLogin} />
            } />
          </Routes>
        </main>

        {notifications.length > 0 && (
          <div className="fixed bottom-4 right-4 max-w-sm">
            {notifications.slice(-1).map(notification => (
              <div 
                key={notification.id} 
                className="bg-white shadow-lg rounded-lg p-4 mb-2 border-l-4 border-blue-500 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {notification.date.toLocaleTimeString()}
                  </p>
                </div>
                <button 
                  onClick={() => dismissNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;