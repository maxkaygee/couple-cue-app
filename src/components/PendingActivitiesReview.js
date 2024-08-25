import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SwipeableActivityCard } from './SwipeableActivityCard';

export function PendingActivitiesReview({ user }) {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'pendingActivities'),
        where('createdFor', '==', user.uid),
        where('status', '==', 'pending')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const activities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingActivities(activities);
        if (activities.length > 0 && !currentActivity) {
          setCurrentActivity(activities[0]);
        }
      });
      return () => unsubscribe();
    }
  }, [user, currentActivity]);

  const handleSwipe = async (direction, activity) => {
    if (direction === 'right') {
      await handleAccept(activity);
    } else {
      setCurrentActivity(activity);
      // Show note input for rejection
    }
  };

  const handleAccept = async (activity) => {
    try {
      await addDoc(collection(db, 'activities'), {
        ...activity,
        status: 'approved',
        approvedAt: new Date()
      });
      await deleteDoc(doc(db, 'pendingActivities', activity.id));
      setCurrentActivity(pendingActivities[pendingActivities.indexOf(activity) + 1] || null);
    } catch (error) {
      console.error("Error accepting activity: ", error);
    }
  };

  const handleReject = async () => {
    try {
      await updateDoc(doc(db, 'pendingActivities', currentActivity.id), {
        status: 'rejected',
        rejectionNote: note,
        rejectedAt: new Date()
      });
      setCurrentActivity(pendingActivities[pendingActivities.indexOf(currentActivity) + 1] || null);
      setNote('');
    } catch (error) {
      console.error("Error rejecting activity: ", error);
    }
  };

  if (!currentActivity) {
    return <p>No pending activities to review.</p>;
  }

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