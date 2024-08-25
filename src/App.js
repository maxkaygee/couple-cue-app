import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { Auth } from './components/Auth';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { RandomSelector } from './components/RandomSelector';
import { UserProfile } from './components/UserProfile';
import { CouplePairing } from './components/CouplePairing';
import { Notifications } from './components/Notifications';
import { PendingActivitiesReview } from './components/PendingActivitiesReview';

export default function App() {
  const [user, setUser] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPendingReview, setShowPendingReview] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setPartnerId(userDoc.data().partnerId || null);
        }
      } else {
        setPartnerId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && partnerId) {
      const q = query(
        collection(db, 'activities'),
        where('userId', 'in', [user.uid, partnerId])
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const activitiesArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched activities:", activitiesArray); // Add this line for debugging
        setActivities(activitiesArray);
      });

      return () => unsubscribe();
    } else {
      setActivities([]);
    }
  }, [user, partnerId]);

  const addActivity = useCallback(async (newActivity) => {
    if (user) {
      try {
        await addDoc(collection(db, 'pendingActivities'), {
          ...newActivity,
          createdBy: user.uid,
          createdFor: partnerId,
          status: 'pending',
          createdAt: new Date()
        });
      } catch (error) {
        console.error("Error adding pending activity: ", error);
      }
    }
  }, [user, partnerId]);

  const approveActivity = useCallback(async (activity) => {
    if (user) {
      try {
        await addDoc(collection(db, 'activities'), {
          ...activity,
          status: 'approved',
          approvedAt: new Date()
        });
        await deleteDoc(doc(db, 'pendingActivities', activity.id));
      } catch (error) {
        console.error("Error approving activity: ", error);
      }
    }
  }, [user]);

  const rejectActivity = useCallback(async (activity, note) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'pendingActivities', activity.id), {
          status: 'rejected',
          rejectionNote: note,
          rejectedAt: new Date()
        });
      } catch (error) {
        console.error("Error rejecting activity: ", error);
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gray-800 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Couple Cue</h1>
          {user && (
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setShowNotifications(false);
                  setShowPendingReview(false);
                }} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Activities
              </button>
              <button 
                onClick={() => {
                  setShowProfile(true);
                  setShowNotifications(false);
                  setShowPendingReview(false);
                }} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Profile
              </button>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setShowNotifications(true);
                  setShowPendingReview(false);
                }} 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Notifications
              </button>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setShowNotifications(false);
                  setShowPendingReview(true);
                }} 
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Review Activities
              </button>
            </div>
          )}
        </header>
        <main className="p-6">
          <Auth user={user} setUser={setUser} />
          {user && !showProfile && !showNotifications && !showPendingReview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ActivityForm user={user} partnerId={partnerId} onAddActivity={addActivity} />
                <RandomSelector activities={activities} />
              </div>
              <ActivityList activities={activities} currentUserId={user.uid} partnerId={partnerId} />
            </div>
          )}
            {user && !showProfile && !showNotifications && !showPendingReview && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ActivityForm user={user} partnerId={partnerId} onAddActivity={addActivity} />
          <RandomSelector activities={activities} />
        </div>
        <ActivityList activities={activities} currentUserId={user.uid} partnerId={partnerId} />
      </div>
    )}
        </main>
      </div>
    </div>
  );
}