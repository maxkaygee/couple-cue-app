import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export function CouplePairing({ user }) {
  const [partnerCode, setPartnerCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [partnerUsername, setPartnerUsername] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserCode(userData.coupleCode || generateCoupleCode());
          if (userData.partnerId) {
            const partnerRef = doc(db, 'users', userData.partnerId);
            const partnerSnap = await getDoc(partnerRef);
            if (partnerSnap.exists()) {
              setPartnerUsername(partnerSnap.data().username);
            }
          }
        }
      }
    };
    fetchUserData();
  }, [user]);

  const generateCoupleCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handlePairCouple = async () => {
    try {
      const q = query(collection(db, 'users'), where('coupleCode', '==', partnerCode));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('Invalid partner code');
        return;
      }
      const partnerDoc = querySnapshot.docs[0];
      const partnerData = partnerDoc.data();
      const userRef = doc(db, 'users', user.uid);
      const partnerRef = doc(db, 'users', partnerDoc.id);

      await updateDoc(userRef, { partnerId: partnerDoc.id });
      await updateDoc(partnerRef, { partnerId: user.uid });

      setPartnerUsername(partnerData.username);
      setError(null);
    } catch (error) {
      setError('Failed to pair with partner');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Couple Pairing</h2>
      {partnerUsername ? (
        <p>You are paired with: {partnerUsername}</p>
      ) : (
        <>
          <p className="mb-2">Your couple code: {userCode}</p>
          <div className="mb-4">
            <input
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value)}
              placeholder="Enter partner's code"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button onClick={handlePairCouple} className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
            Pair with Partner
          </button>
        </>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}