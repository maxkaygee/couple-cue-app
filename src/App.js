import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, where, getDoc, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  const [currentView, setCurrentView] = useState('activities');

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
        console.log("Fetched activities:", activitiesArray);
        setActivities(activitiesArray);
      });

      return () => unsubscribe();
    } else {
      setActivities([]);
    }
  }, [user, partnerId]);

  useEffect(() => {
    if (user && partnerId) {
      const q = query(
        collection(db, 'pendingActivities'),
        where('createdFor', '==', user.uid),
        where('status', '==', 'pending')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const pendingActivitiesArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched pending activities:", pendingActivitiesArray);
        setPendingActivities(pendingActivitiesArray);
      });

      return () => unsubscribe();
    } else {
      setPendingActivities([]);
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

  const renderContent = () => {
    switch (currentView) {
      case 'activities':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ActivityForm user={user} partnerId={partnerId} onAddActivity={addActivity} />
              <RandomSelector activities={activities} />
            </div>
            <ActivityList activities={activities} currentUserId={user.uid} partnerId={partnerId} />
          </div>
        );
      case 'profile':
        return (
          <>
            <UserProfile user={user} />
            <CouplePairing user={user} setPartnerId={setPartnerId} />
          </>
        );
      case 'notifications':
        return <Notifications userId={user.uid} />;
      case 'pendingReview':
        return (
          <PendingActivitiesReview 
            pendingActivities={pendingActivities}
            onApprove={approveActivity} 
            onReject={rejectActivity} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gray-800 text-white p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Couple Cue</h1>
          {user && (
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4 mt-4 sm:mt-0">
              <button 
                onClick={() => setCurrentView('activities')}
                className={`${currentView === 'activities' ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base mb-2 sm:mb-0`}
              >
                Activities
              </button>
              <button 
                onClick={() => setCurrentView('profile')}
                className={`${currentView === 'profile' ? 'bg-green-700' : 'bg-green-500'} hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base mb-2 sm:mb-0`}
              >
                Profile
              </button>
              <button 
                onClick={() => setCurrentView('notifications')}
                className={`${currentView === 'notifications' ? 'bg-yellow-700' : 'bg-yellow-500'} hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base mb-2 sm:mb-0`}
              >
                Notifications
              </button>
              <button 
                onClick={() => setCurrentView('pendingReview')}
                className={`${currentView === 'pendingReview' ? 'bg-purple-700' : 'bg-purple-500'} hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base`}
              >
                Review
              </button>
            </nav>
          )}
        </header>
        <main className="p-4 sm:p-6">
          <Auth user={user} setUser={setUser} />
          {user && renderContent()}
        </main>
      </div>
    </div>
  );
}