import { useState } from 'react';
import { Plus, Calendar, Clock, Mail } from 'lucide-react';

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [emailNotify, setEmailNotify] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyTime, setNotifyTime] = useState('15'); // Default 15 minutes before
  const [showForm, setShowForm] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Validate email if notification is enabled
    if (emailNotify && !validateEmail(notifyEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Create due date time object if both date and time are provided
    let dueDatetime = null;
    if (dueDate) {
      dueDatetime = new Date(dueDate);
      
      // If time is set, update the hours and minutes
      if (dueTime) {
        const [hours, minutes] = dueTime.split(':').map(Number);
        dueDatetime.setHours(hours, minutes);
      }
    }
    
    addTodo({
      title: title.trim(),
      completed: false,
      dueDate: dueDatetime,
      priority,
      createdAt: new Date(),
      // Email notification properties
      emailNotify: emailNotify,
      notifyEmail: emailNotify ? notifyEmail : '',
      notifyTime: emailNotify ? notifyTime : '15',
      notified: false // Track if notification has been sent
    });
    
    // Reset form
    setTitle('');
    setDueDate('');
    setDueTime('');
    setPriority('medium');
    setEmailNotify(false);
    setNotifyEmail('');
    setNotifyTime('15');
    setEmailError('');
    setShowForm(false);
  };

  return (
    <div className="mt-4 mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add New Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          {/* Email Notification Section */}
           
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!title.trim() || (emailNotify && !validateEmail(notifyEmail))}
            >
              Add Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TodoForm;