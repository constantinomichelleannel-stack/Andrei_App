import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, db, doc, getDoc, setDoc, onAuthStateChanged, User, serverTimestamp, signOut } from '../firebase';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

interface UserProfile {
  uid: string;
  displayName: string;
  rollNumber?: string;
  specialization?: string;
  role: 'user' | 'admin';
  privacyConsent: boolean;
  consentDate?: any;
  createdAt: any;
  lastLoginAt?: any;
  accountVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshProfile: async () => {},
  getAuthToken: async () => null,
  fetchWithAuth: async () => new Response(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      // First try Firestore as backup/initial source
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      // Then try our API which syncs with local DB
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });

      if (response.ok) {
        const apiData = await response.json();
        setProfile(apiData);
      } else if (docSnap.exists()) {
        const firestoreData = docSnap.data() as UserProfile;
        setProfile(firestoreData);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Update last login in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true }).catch(err => {
          console.error("Failed to update last login:", err);
        });

        // Handle session timeout
        const now = Date.now();
        const loginTimestamp = localStorage.getItem('lexph_login_timestamp');
        
        if (loginTimestamp) {
          const elapsed = now - parseInt(loginTimestamp, 10);
          if (elapsed > SESSION_TIMEOUT) {
            console.log("Session expired. Signing out...");
            localStorage.removeItem('lexph_login_timestamp');
            await signOut(auth);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }
        } else {
          // New session or timestamp missing
          localStorage.setItem('lexph_login_timestamp', now.toString());
        }

        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
        localStorage.removeItem('lexph_login_timestamp');
        setLoading(false);
      }
    });

    // Periodic check for session timeout
    const interval = setInterval(() => {
      const loginTimestamp = localStorage.getItem('lexph_login_timestamp');
      if (loginTimestamp && auth.currentUser) {
        const elapsed = Date.now() - parseInt(loginTimestamp, 10);
        if (elapsed > SESSION_TIMEOUT) {
          console.log("Session interval check: expired. Signing out...");
          localStorage.removeItem('lexph_login_timestamp');
          signOut(auth);
        }
      }
    }, 60000); // Check every minute

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const isAdmin = profile?.role === 'admin';

  const getAuthToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(true);
  }, []);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = await getAuthToken();
    const headers = {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
  }, [getAuthToken]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, refreshProfile, getAuthToken, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
