import React, { useState } from 'react';

function ActivityForm({ onAddActivity }) {
  const [activity, setActivity] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activity.trim() && category) {
      onAddActivity({ activity, category });
      setActivity('');
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        placeholder="Enter an activity"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select a category</option>
        <option value="home">Home</option>
        <option value="denton">Denton</option>
        <option value="travel">Travel</option>
      </select>
      <button type="submit">Add Activity</button>
    </form>
  );
}

export default ActivityForm;