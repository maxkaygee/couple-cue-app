import React, { useState, useEffect } from 'react';
import { SwipeableActivityCard } from './SwipeableActivityCard';

export function PendingActivitiesReview({ pendingActivities, onApprove, onReject }) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    setCurrentActivityIndex(0);
  }, [pendingActivities]);

  if (!pendingActivities || pendingActivities.length === 0) {
    return <p className="text-center py-4">No pending activities to review.</p>;
  }

  const currentActivity = pendingActivities[currentActivityIndex];

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      onApprove(currentActivity);
    } else {
      setNote('');
      // Show note input for rejection
    }
    setCurrentActivityIndex(prevIndex => 
      prevIndex + 1 >= pendingActivities.length ? 0 : prevIndex + 1
    );
  };

  const handleReject = () => {
    onReject(currentActivity, note);
    setNote('');
    setCurrentActivityIndex(prevIndex => 
      prevIndex + 1 >= pendingActivities.length ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative h-96">
      <SwipeableActivityCard activity={currentActivity} onSwipe={handleSwipe} />
      {note !== '' && (
        <div className="mt-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a note for rejection..."
          />
          <button onClick={handleReject} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
            Confirm Rejection
          </button>
        </div>
      )}
    </div>
  );
}