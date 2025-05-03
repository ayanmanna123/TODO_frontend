import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ todos }) => {
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    completionRate: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    byDay: {},
    completionTime: []
  });

  useEffect(() => {
    calculateStats();
  }, [todos]);

  const calculateStats = () => {
    const completed = todos.filter(todo => todo.completed).length;
    const pending = todos.filter(todo => !todo.completed).length;
    
    // Calculate completion rate
    const completionRate = todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0;
    
    // Group by priority
    const byPriority = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    };
    
    // Analyze by day of week
    const byDay = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    daysOfWeek.forEach(day => {
      byDay[day] = { completed: 0, created: 0 };
    });
    
    todos.forEach(todo => {
      if (todo.createdAt) {
        const createdDay = daysOfWeek[new Date(todo.createdAt).getDay()];
        byDay[createdDay].created++;
      }
      
      if (todo.completed && todo.completedAt) {
        const completedDay = daysOfWeek[new Date(todo.completedAt).getDay()];
        byDay[completedDay].completed++;
      }
    });
    
    // Calculate average completion time
    const completionTimes = [];
    todos.forEach(todo => {
      if (todo.completed && todo.completedAt && todo.createdAt) {
        const created = new Date(todo.createdAt);
        const completed = new Date(todo.completedAt);
        const diffInHours = (completed - created) / (1000 * 60 * 60);
        
        completionTimes.push({
          title: todo.title,
          hours: Math.round(diffInHours * 10) / 10
        });
      }
    });
    
    setStats({
      completed,
      pending,
      completionRate,
      byPriority,
      byDay,
      completionTime: completionTimes.slice(0, 10) // Get the 10 most recent
    });
  };

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' }
  ];

  const priorityData = [
    { name: 'High', value: stats.byPriority.high, color: '#EF4444' },
    { name: 'Medium', value: stats.byPriority.medium, color: '#F59E0B' },
    { name: 'Low', value: stats.byPriority.low, color: '#10B981' }
  ];

  const dayData = Object.keys(stats.byDay).map(day => ({
    name: day.substring(0, 3),
    completed: stats.byDay[day].completed,
    created: stats.byDay[day].created
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Task Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Completion Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
                      <div className="text-center mt-4">
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-sm text-gray-500">Completion Rate</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Tasks by Priority</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Task Completion Rate</h2>
          <div className="flex items-center justify-center h-64 flex-col">
            <div className="text-5xl font-bold text-blue-500">{todos.length}</div>
            <div className="text-gray-500 mt-2">Total Tasks</div>
            <div className="flex justify-between w-full mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Tasks by Day of Week</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" name="Tasks Created" fill="#3B82F6" />
                <Bar dataKey="completed" name="Tasks Completed" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Task Completion Time (Hours)</h2>
          <div className="h-80">
            {stats.completionTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.completionTime}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No completed tasks with timing data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;