'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  onAuthStateChanged,
  signOut,
  FirebaseError,
} from 'firebase/auth';

type AuthResult = {
    success: boolean;
    user?: User | null;
    error?: FirebaseError;
};

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, callback?: (result: AuthResult) => void): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
        if (callback) {
            callback({ success: true, user: userCredential.user });
        }
    })
    .catch((error: FirebaseError) => {
        console.error("Error signing up:", error);
        if (callback) {
            callback({ success: false, error: error });
        }
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, callback?: (result: AuthResult) => void): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
        if (callback) {
            callback({ success: true, user: userCredential.user });
        }
    })
    .catch((error: FirebaseError) => {
        console.error("Error signing in:", error);
        if (callback) {
            callback({ success: false, error: error });
        }
    });
}


/** Update user profile (non-blocking). */
export function updateProfileNonBlocking(user: User, profileData: { displayName?: string; photoURL?: string; }, callback?: (result: AuthResult) => void): void {
    updateProfile(user, profileData)
    .then(() => {
        if (callback) {
            callback({ success: true, user });
        }
    })
    .catch(error => {
        console.error("Error updating profile:", error);
        if (callback) {
            callback({ success: false, error: error, user });
        }
    });
}

/** Initiate sign-out (non-blocking). */
export function initiateSignOut(authInstance: Auth, callback?: () => void): void {
    signOut(authInstance)
    .then(() => {
        if (callback) callback();
    })
    .catch(error => {
        console.error("Sign out error:", error);
    });
}
