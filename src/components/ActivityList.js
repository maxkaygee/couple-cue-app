import React from 'react';

function ActivityList({ activities, onRemoveActivity }) {
  return (
    <div>
      <h2>Activity List</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            {activity.activity} - {activity.category}
            <button onClick={() => onRemoveActivity(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityList;