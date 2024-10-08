import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export function CouplePairing({ user, setPartnerId }) {
  const [partnerCode, setPartnerCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [partnerUsername, setPartnerUsername] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (!userData.coupleCode) {
            const newCode = generateCoupleCode();
            await updateDoc(userRef, { coupleCode: newCode });
            setUserCode(newCode);
          } else {
            setUserCode(userData.coupleCode);
          }
          if (userData.partnerId) {
            setPartnerId(userData.partnerId);
            const partnerRef = doc(db, 'users', userData.partnerId);
            const partnerSnap = await getDoc(partnerRef);
            if (partnerSnap.exists()) {
              setPartnerUsername(partnerSnap.data().username);
            }
          } else {
            setPartnerId(null);
          }
        }
      }
    };
    fetchUserData();
  }, [user, setPartnerId]);

  const generateCoupleCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSendPairingRequest = async () => {
    setError(null);
    setSuccess(null);
    if (!partnerCode.trim()) {
      setError("Please enter a partner code.");
      return;
    }
    try {
      const q = query(collection(db, 'users'), where('coupleCode', '==', partnerCode));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('Invalid partner code. Please check and try again.');
        return;
      }
      const partnerDoc = querySnapshot.docs[0];
      const partnerData = partnerDoc.data();
      
      if (partnerDoc.id === user.uid) {
        setError("You can't pair with yourself!");
        return;
      }
      
      if (partnerData.partnerId) {
        setError("This user is already paired with someone else.");
        return;
      }

      // Send a pairing request notification
      await addDoc(collection(db, 'notifications'), {
        type: 'pairingRequest',
        senderId: user.uid,
        senderUsername: user.displayName || user.email,
        recipientId: partnerDoc.id,
        message: `${user.displayName || user.email} wants to pair with you!`,
        createdAt: new Date()
      });

      setSuccess("Pairing request sent successfully!");
      setPartnerCode('');
    } catch (error) {
      console.error("Error in handleSendPairingRequest:", error);
      setError('Failed to send pairing request. Please try again.');
    }
  };

  const handleUnpair = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (userData.partnerId) {
        const partnerRef = doc(db, 'users', userData.partnerId);
        await updateDoc(userRef, { partnerId: null });
        await updateDoc(partnerRef, { partnerId: null });
        setPartnerId(null);
        setPartnerUsername('');
        setSuccess("Successfully unpaired.");
      }
    } catch (error) {
      console.error("Error in handleUnpair:", error);
      setError('Failed to unpair. Please try again.');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Couple Pairing</h2>
      {partnerUsername ? (
        <div>
          <p className="mb-4">You are paired with: {partnerUsername}</p>
          <button onClick={handleUnpair} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Unpair
          </button>
        </div>
      ) : (
        <>
          <p className="mb-2">Your couple code: <span className="font-bold">{userCode}</span></p>
          <p className="mb-2 text-sm text-gray-600">Share this code with your partner to pair up.</p>
          <div className="mb-4">
            <input
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value)}
              placeholder="Enter partner's code"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button onClick={handleSendPairingRequest} className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
            Send Pairing Request
          </button>
        </>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}