const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.copyExercises = functions.https.onRequest(async (req, res) => {
  try {
    // Get all documents from the old 'Excersies' collection
    const oldExercisesSnapshot = await db.collection('Excersies').get();
    
    // Loop through each document in the old collection
    const batch = db.batch(); // Batch to perform bulk operations

    oldExercisesSnapshot.forEach((doc) => {
      const oldExerciseData = doc.data(); // Get the data from each old document
      const oldExerciseID = doc.id; // Get the document ID

      // Create a new ID by removing 'ExcersiseID' typo and replacing with 'ExerciseID'
      const newExerciseID = oldExerciseID.replace('Excersise', 'Exercise');

      // Reference to the new document in the 'Exercises' collection
      const newExerciseRef = db.collection('Exercises').doc(newExerciseID);

      // Set the data in the new document with the same content from the old document
      batch.set(newExerciseRef, {
        Muscle: oldExerciseData.Muscle,
        Name: oldExerciseData.Name,
      });
    });

    // Commit the batch operation to write all data at once
    await batch.commit();

    // Send success response
    res.status(200).send('Exercises copied successfully to new collection');
  } catch (error) {
    console.error('Error copying exercises:', error);
    res.status(500).send('Error copying exercises');
  }
});
