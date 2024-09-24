import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);  // Set the user's ID
            } else {
                setUserId(null);  // User is logged out or doesn't exist
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { userId, loading };
};
