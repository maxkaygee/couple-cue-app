import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export function UserProfile({ user }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsername(userData.username);
          setEmail(userData.email);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { username });
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        {isEditing ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        ) : (
          <p>{username}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <p>{email}</p>
      </div>
      {isEditing ? (
        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save
        </button>
      ) : (
        <button onClick={() => setIsEditing(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Edit Profile
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}