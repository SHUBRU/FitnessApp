import React, { useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase'; // Import 'auth' and 'db' from your firebase configuration

const MigrateData = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const migrateTrackerData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage("No authenticated user found.");
        setLoading(false);
        return;
      }

      const userId = user.uid;

      // Get all documents from the old ExcersiseID collection for the user
      const oldTrackerRef = collection(db, 'Users', userId, 'Tracker');
      const snapshot = await getDocs(oldTrackerRef);

      if (snapshot.empty) {
        setMessage("No documents found in the user's Tracker collection.");
        setLoading(false);
        return;
      }

      // Loop through each document and migrate it to the new collection with corrected IDs
      snapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        const oldDocId = docSnap.id; // Get the old document ID (e.g., ExcersiseID1)

        // Replace the typo in the document ID (ExcersiseID -> ExerciseID)
        const newDocId = oldDocId.replace('Excersise', 'Exercise');

        // Set the new document in the ExerciseTracker collection with the corrected ID
        const newDocRef = doc(db, 'Users', userId, 'ExerciseTracker', newDocId);
        await setDoc(newDocRef, data); // Copy the data as is
        console.log(`Document ${newDocId} copied for user ${userId}.`);
      });

      setMessage("Migration completed successfully!");
    } catch (error) {
      console.error("Error migrating data: ", error);
      setMessage("An error occurred during migration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Tracker Data Migration</h1>
      <button onClick={migrateTrackerData} disabled={loading}>
        {loading ? "Migrating..." : "Migrate Tracker Data"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MigrateData;
