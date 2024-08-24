import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { Auth } from './components/Auth';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { RandomSelector } from './components/RandomSelector';

export default function App() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'activities'), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
  }, [user]);

  const addActivity = async (activity) => {
    if (user) {
      try {
        await addDoc(collection(db, 'activities'), {
          ...activity,
          userId: user.uid
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gray-800 text-white p-6">
          <h1 className="text-3xl font-bold">Couple Cue</h1>
        </header>
        <main className="p-6">
          <Auth user={user} setUser={setUser} />
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ActivityForm onAddActivity={addActivity} />
                <RandomSelector activities={activities} />
              </div>
              <ActivityList activities={activities} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}