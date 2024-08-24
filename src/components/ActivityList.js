import React from 'react';

export function ActivityList({ activities, currentUserId }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Activity List</h2>
      {activities.length === 0 ? (
        <p className="text-gray-500">No activities added yet.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li key={activity.id} className="bg-white p-3 rounded shadow">
              <h3 className="font-semibold">{activity.activity}</h3>
              <p className="text-sm text-gray-600">
                {activity.category} - {activity.subcategory}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Added by: {activity.userId === currentUserId ? 'You' : 'Your partner'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}