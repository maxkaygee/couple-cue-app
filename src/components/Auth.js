import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export function Auth({ user, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const isUsernameValid = (username) => {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const isUsernameUnique = async (username) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const createUserDocument = async (user, username) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email } = user;
    const coupleCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await setDoc(userRef, {
        username,
        email,
        createdAt: new Date(),
        coupleCode,
      });
    } catch (error) {
      console.log('Error creating user document', error);
    }
  }
};

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isUsernameValid(username)) {
      setError('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
      return;
    }
    if (!(await isUsernameUnique(username))) {
      setError('Username is already taken');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user, username);
      setUser(userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user, result.user.displayName);
      setUser(result.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="mb-2">Signed in as {user.email}</p>
        <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <form onSubmit={handleSignUp} className="mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-2">
          Sign Up
        </button>
      </form>
      <button onClick={handleSignIn} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-2">
        Sign In
      </button>
      <button onClick={handleGoogleSignIn} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Sign In with Google
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}