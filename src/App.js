import React, { useState } from 'react';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { RandomSelector } from './components/RandomSelector';

export default function App() {
  const [activities, setActivities] = useState([]);

  const addActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gray-800 text-white p-6">
          <h1 className="text-3xl font-bold">Couple Cue</h1>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ActivityForm onAddActivity={addActivity} />
              <RandomSelector activities={activities} />
            </div>
            <ActivityList activities={activities} />
          </div>
        </main>
      </div>
    </div>
  );
}