import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const WeightTracker = () => {
  const [weight, setWeight] = useState('');
  const [dateTracked, setDateTracked] = useState('');
  const db = getFirestore();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = auth.currentUser.uid;
      const weightRef = collection(db, 'Users', userId, 'Weight_Tracker');

      // Add the weight data
      await addDoc(weightRef, {
        Weight: weight,
        DateTracked: dateTracked,
        Timestamp: new Date()
      });

      alert('Weight data saved successfully!');
    } catch (error) {
      console.error('Error saving weight data: ', error);
    }
  };

  return (
    <div>
      <h1>Weight Tracker</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Weight:
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </label>
        <label>
          Select Date:
          <input
            type="date"
            value={dateTracked}
            onChange={(e) => setDateTracked(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save Weight Data</button>
      </form>
    </div>
  );
};

export default WeightTracker;
