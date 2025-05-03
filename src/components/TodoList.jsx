import { useState } from 'react';
import { CheckCircle, Circle, Trash2, Edit, Clock } from 'lucide-react';

const TodoList = ({ todos, updateTodo, deleteTodo }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('all');

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  };

  const saveEdit = (id) => {
    updateTodo(id, { title: editTitle });
    setEditingId(null);
  };

  const toggleComplete = (todo) => {
    const now = new Date();
    updateTodo(todo._id, { 
      completed: !todo.completed,
      completedAt: !todo.completed ? now : null
    });
  };

  const filteredTodos = () => {
    switch(filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b flex justify-between">
        <div className="space-x-2">
          <button 
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filter === 'active' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {filteredTodos().length === 0 ? (
          <li className="px-6 py-4 text-center text-gray-500">No tasks found</li>
        ) : (
          filteredTodos().map(todo => (
            <li key={todo._id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <button 
                    onClick={() => toggleComplete(todo)}
                    className={`flex-shrink-0 ${todo.completed ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    {todo.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  
                  {editingId === todo._id ? (
                    <input
                      type="text"
                      className="ml-3 flex-1 px-2 py-1 border rounded"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                      autoFocus
                    />
                  ) : (
                    <span className={`ml-3 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.title}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
                    </span>
                  </div>
                  
                  {editingId === todo._id ? (
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {todo.completed && todo.completedAt && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span>Completed on {formatDate(todo.completedAt)}</span>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;