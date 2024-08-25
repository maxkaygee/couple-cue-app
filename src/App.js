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
import { Notifications } from './components/Notifications';
import { PendingActivitiesReview } from './components/PendingActivitiesReview';

export default function App() {
  const [user, setUser] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPendingReview, setShowPendingReview] = useState(false);

  // ... (rest of the useEffects and functions remain the same)

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
                <ActivityForm user={user} partnerId={partnerId} />
                <RandomSelector activities={activities} />
              </div>
              <ActivityList activities={activities} currentUserId={user.uid} partnerId={partnerId} />
            </div>
          )}
          {user && showProfile && (
            <>
              <UserProfile user={user} />
              <CouplePairing user={user} setPartnerId={setPartnerId} />
            </>
          )}
          {user && showNotifications && (
            <Notifications userId={user.uid} />
          )}
          {user && showPendingReview && (
            <PendingActivitiesReview user={user} />
          )}
        </main>
      </div>
    </div>
  );
}