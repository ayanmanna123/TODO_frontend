import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const CalendarView = ({ todos, updateTodo }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const todayDate = new Date();
  
  // Get incomplete todos for the calendar
  const incompleteTodos = todos.filter(todo => !todo.completed && todo.dueDate);
  
  // Group todos by date
  const todosByDate = {};
  incompleteTodos.forEach(todo => {
    if (todo.dueDate) {
      const dateKey = new Date(todo.dueDate).toDateString();
      if (!todosByDate[dateKey]) {
        todosByDate[dateKey] = [];
      }
      todosByDate[dateKey].push(todo);
    }
  });
  
  const buildCalendar = () => {
    const calendar = [];
    let day = 1;
    
    for (let i = 0; i < 6; i++) {
      const week = [];
      
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
          week.push(null);
        } else {
          const calendarDate = new Date(year, month, day);
          const dateString = calendarDate.toDateString();
          const todosForDay = todosByDate[dateString] || [];
          
          week.push({
            day,
            date: calendarDate,
            todos: todosForDay,
            isToday: calendarDate.getDate() === todayDate.getDate() &&
                     calendarDate.getMonth() === todayDate.getMonth() &&
                     calendarDate.getFullYear() === todayDate.getFullYear()
          });
          
          day++;
        }
      }
      
      calendar.push(week);
      if (day > daysInMonth) break;
    }
    
    return calendar;
  };
  
  const calendar = buildCalendar();
  
  const toggleTodo = (todoId) => {
    const todo = todos.find(t => t._id === todoId);
    if (todo) {
      updateTodo(todoId, { completed: !todo.completed });
    }
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {calendar.flatMap((week, i) => 
          week.map((day, j) => (
            <div 
              key={`${i}-${j}`} 
              className={`bg-white min-h-[120px] p-2 ${
                day?.isToday ? 'bg-blue-50' : ''
              }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium ${
                    day.isToday ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {day.day}
                  </div>
                  <div className="mt-1 space-y-1 max-h-[100px] overflow-y-auto">
                    {day.todos.map(todo => (
                      <div 
                        key={todo._id}
                        className={`text-xs p-1 rounded ${
                          todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo._id)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className={`${todo.completed ? 'line-through' : ''} truncate`}>
                            {todo.title}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-xs opacity-80">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(todo.dueDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarView;