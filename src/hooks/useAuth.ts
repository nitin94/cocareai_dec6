import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  NextOrObserver,
  ErrorFn,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';
import type { AuthState, User } from '../types/auth';

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email!,
  displayName: firebaseUser.displayName || undefined,
  photoURL: firebaseUser.photoURL || undefined,
});

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      ((user) => {
        setAuthState((prev) => ({
          ...prev,
          user: user ? mapFirebaseUser(user) : null,
          loading: false,
        }));
      }) as NextOrObserver<FirebaseUser>,
      ((error: AuthError) => {
        setAuthState((prev) => ({
          ...prev,
          error: { 
            code: error.code || 'unknown',
            message: error.message 
          },
          loading: false,
        }));
      }) as ErrorFn
    );

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      setAuthState((prev) => ({
        ...prev,
        error: { 
          code: authError.code || 'unknown',
          message: authError.message 
        },
      }));
    }
  };

  return {
    ...authState,
    signOut,
  };
};