import React, { useState } from 'react';

export function ActivityForm({ onAddActivity }) {
  const [activity, setActivity] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activity && category && subcategory) {
      onAddActivity({ activity, category, subcategory });
      setActivity('');
      setCategory('');
      setSubcategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
      <div className="mb-4">
        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Enter activity"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="Home">Home</option>
          <option value="Denton">Denton</option>
          <option value="Travel">Travel</option>
        </select>
      </div>
      <div className="mb-4">
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Subcategory</option>
          {category === 'Home' && (
            <>
              <option value="Jess apt">Jess apt</option>
              <option value="Javi suite">Javi suite</option>
            </>
          )}
          {category === 'Denton' && (
            <>
              <option value="Food">Food</option>
              <option value="Activity">Activity</option>
            </>
          )}
          {category === 'Travel' && (
            <>
              <option value="$0-$100">$0-$100</option>
              <option value="$101-$500">$101-$500</option>
              <option value="$501-$1500">$501-$1500</option>
              <option value="$1501+">$1501+</option>
            </>
          )}
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Activity
      </button>
    </form>
  );
}