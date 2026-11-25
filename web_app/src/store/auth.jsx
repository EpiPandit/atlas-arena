'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  TOKEN_KEY,
  apiFetch,
  authConfigured,
  getToken,
  readSignInFragment,
  setToken,
  setUnauthorizedHandler,
  signInUrl,
} from '@/libs/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const signOut = useCallback(() => {
    // The API has no logout endpoint; the session token just expires.
    setToken(null);
    setUser(null);
    setStatus('signedOut');
  }, []);

  // Signed in iff the stored token checks out with the API. A 401 clears the
  // token (apiFetch -> signOut, for every tab); any other failure only signs
  // this tab out, so a network blip doesn't end the shared session.
  const loadUser = useCallback(() => {
    if (!getToken()) {
      setUser(null);
      setStatus('signedOut');
      return;
    }
    apiFetch('auth/me')
      .then(({ data }) => {
        setUser({ email: data.identity });
        setStatus('signedIn');
      })
      .catch(() => {
        setUser(null);
        setStatus('signedOut');
      });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    if (!authConfigured) {
      setStatus('signedOut');
      return;
    }
    const outcome = readSignInFragment();
    if (outcome?.token) setToken(outcome.token);
    if (outcome?.error) setError(outcome.error);
    loadUser();

    // The token is shared by every tab: follow sign-in/out in the others.
    const onStorage = (event) => {
      if (event.key === TOKEN_KEY || event.key === null) loadUser();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [signOut, loadUser]);

  const signIn = useCallback(() => {
    window.location.href = signInUrl();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        error,
        clearError,
        signIn,
        signOut,
        enabled: authConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Renders children only for signed-in users. This is a UI convenience; the API
// is what actually rejects unauthenticated requests.
export const RequireAuth = ({ children, fallback = null }) => {
  const { status } = useAuth();
  return status === 'signedIn' ? children : fallback;
};
