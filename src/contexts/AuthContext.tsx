import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, doc, getDoc, setDoc, onAuthStateChanged, User, serverTimestamp, signOut } from '../firebase';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  rollNumber?: string;
  specialization?: string;
  role: 'lawyer' | 'admin';
  privacyConsent: boolean;
  consentDate?: any;
  createdAt: any;
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

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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
      }
      setLoading(false);
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

  const isAdmin = profile?.role === 'admin' || user?.email === "constantinomichelleannel@gmail.com";

  const getAuthToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(true);
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await getAuthToken();
    const headers = {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, refreshProfile: () => fetchProfile(user?.uid || ''), getAuthToken, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
