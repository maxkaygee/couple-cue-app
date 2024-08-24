import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { Auth } from './components/Auth';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { RandomSelector } from './components/RandomSelector';
import { UserProfile } from './components/UserProfile';
import { CouplePairing } from './components/CouplePairing';

export default function App() {
  const [user, setUser] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

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
    if (user) {
      const userActivitiesQuery = query(collection(db, 'activities'), where("userId", "in", [user.uid, partnerId]));
      const unsubscribe = onSnapshot(userActivitiesQuery, (querySnapshot) => {
        const activitiesArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setActivities(activitiesArray);
      });

      return () => unsubscribe();
    } else {
      setActivities([]);
    }
  }, [user, partnerId]);

  const addActivity = async (activity) => {
    if (user) {
      try {
        await addDoc(collection(db, 'activities'), {
          ...activity,
          userId: user.uid,
          createdAt: new Date()
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gray-800 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Couple Cue</h1>
          {user && (
            <button 
              onClick={() => setShowProfile(!showProfile)} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {showProfile ? 'Back to Activities' : 'View Profile'}
            </button>
          )}
        </header>
        <main className="p-6">
          <Auth user={user} setUser={setUser} />
          {user && !showProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ActivityForm onAddActivity={addActivity} />
                <RandomSelector activities={activities} />
              </div>
              <ActivityList activities={activities} currentUserId={user.uid} />
            </div>
          )}
          {user && showProfile && (
            <>
              <UserProfile user={user} />
              <CouplePairing user={user} setPartnerId={setPartnerId} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}