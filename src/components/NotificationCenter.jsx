 
import { Bell } from 'lucide-react';

const NotificationCenter = ({ notifications, dismissNotification }) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Bell className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-medium">No notifications</h2>
        <p className="text-sm mt-2">You're all caught up!</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group notifications by date
  const groupedNotifications = {};
  notifications.forEach(notification => {
    const dateKey = new Date(notification.date).toDateString();
    if (!groupedNotifications[dateKey]) {
      groupedNotifications[dateKey] = [];
    }
    groupedNotifications[dateKey].push(notification);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notifications</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="font-medium text-gray-700">
            {notifications.length} {notifications.length === 1 ? 'Notification' : 'Notifications'}
          </div>
          <button 
            onClick={() => notifications.forEach(n => dismissNotification(n.id))}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear All
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {Object.keys(groupedNotifications).map(dateKey => (
            <div key={dateKey} className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{dateKey}</h3>
              <div className="space-y-3">
                {groupedNotifications[dateKey].map(notification => (
                  <div key={notification.id} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Bell className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm text-gray-800">{notification.message}</div>
                      <div className="text-xs text-gray-500">{formatDate(notification.date)}</div>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="ml-4 text-gray-400 hover:text-gray-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;