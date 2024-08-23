import React, { useState } from 'react';

function RandomSelector({ activities }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const selectRandom = () => {
    if (activities.length > 0) {
      const randomIndex = Math.floor(Math.random() * activities.length);
      setSelectedActivity(activities[randomIndex]);
    }
  };

  return (
    <div>
      <h2>Random Activity Selector</h2>
      <button onClick={selectRandom}>Select Random Activity</button>
      {selectedActivity && (
        <p>Selected Activity: {selectedActivity.activity} - {selectedActivity.category}</p>
      )}
    </div>
  );
}

export default RandomSelector;