import React, { useState } from 'react';

export function RandomSelector({ activities }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const selectRandomActivity = () => {
    if (activities.length > 0) {
      const randomIndex = Math.floor(Math.random() * activities.length);
      setSelectedActivity(activities[randomIndex]);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Random Activity Selector</h2>
      <button
        onClick={selectRandomActivity}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-4"
      >
        Select Random Activity
      </button>
      {selectedActivity && (
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">{selectedActivity.activity}</h3>
          <p className="text-sm text-gray-600">
            {selectedActivity.category} - {selectedActivity.subcategory}
          </p>
        </div>
      )}
    </div>
  );
}