const { db } = require('../../src/firebase');
const { collection, addDoc } = require('firebase/firestore');

exports.handler = async function(event, context) {
  const { activity } = JSON.parse(event.body);
  
  try {
    const docRef = await addDoc(collection(db, "activities"), activity);
    return {
      statusCode: 200,
      body: JSON.stringify({ id: docRef.id })
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}