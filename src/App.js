import React, { useState } from 'react';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import RandomSelector from './components/RandomSelector';

function App() {
  const [activities, setActivities] = useState([]);

  const addActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  const removeActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  return (
    <div className="App">
      <h1>Couple Cue App</h1>
      <ActivityForm onAddActivity={addActivity} />
      <ActivityList activities={activities} onRemoveActivity={removeActivity} />
      <RandomSelector activities={activities} />
    </div>
  );
}

export default App;