import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipientId', '==', userId)
      );

      const unsubscribe = onSnapshot(notificationsQuery, (querySnapshot) => {
        const notificationsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notificationsArray);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleAccept = async (notification) => {
    try {
      // Update the current user's partnerId
      await updateDoc(doc(db, 'users', userId), {
        partnerId: notification.senderId
      });

      // Update the sender's partnerId
      await updateDoc(doc(db, 'users', notification.senderId), {
        partnerId: userId
      });

      // Delete the notification
      await deleteDoc(doc(db, 'notifications', notification.id));
    } catch (error) {
      console.error("Error accepting pairing request:", error);
    }
  };

  const handleReject = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error("Error rejecting pairing request:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-4 p-3 bg-gray-100 rounded">
              <p>{notification.message}</p>
              {notification.type === 'pairingRequest' && (
                <div className="mt-2">
                  <button
                    onClick={() => handleAccept(notification)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(notification.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}