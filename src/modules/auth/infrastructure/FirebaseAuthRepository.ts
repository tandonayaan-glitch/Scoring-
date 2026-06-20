import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged, FirebaseError } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getAuthClient } from '@/infrastructure/firebase/authClient';
import { getDb } from '@/infrastructure/firebase/firestoreClient';
import { User, usernameToSyntheticEmail } from '../domain/entities/User';
import { isValidRole } from '../domain/valueObjects/Role';
import { IAuthRepository, LoginCredentials } from '../application/ports/IAuthRepository';

function mapFirebaseError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/invalid-credential') return new Error('Invalid credentials');
    if (error.code === 'auth/user-disabled') return new Error('Account disabled');
  }
  return error instanceof Error ? error : new Error('Auth error');
}

async function buildUserFromUid(uid: string, username: string): Promise<User> {
  const db = getDb();
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    await new Promise((r) => setTimeout(r, 1500));
    const retryDoc = await getDoc(doc(db, 'users', uid));
    if (!retryDoc.exists()) throw new Error('User not found');
    const data = retryDoc.data();
    const role = isValidRole(data.role) ? data.role : 'VIEWER';
    return { uid, username: data.username ?? username, role, isActive: data.isActive ?? true, createdAt: data.createdAt?.toDate() ?? new Date() };
  }
  const data = userDoc.data();
  const role = isValidRole(data.role) ? data.role : 'VIEWER';
  return { uid, username: data.username ?? username, role, isActive: data.isActive ?? true, createdAt: data.createdAt?.toDate() ?? new Date() };
}

export class FirebaseAuthRepository implements IAuthRepository {
  private _currentUser: User | null = null;

  async login(credentials: LoginCredentials): Promise<User> {
    const auth = getAuthClient();
    const syntheticEmail = usernameToSyntheticEmail(credentials.username);
    try {
      const { user: fbUser } = await signInWithEmailAndPassword(auth, syntheticEmail, credentials.password);
      const user = await buildUserFromUid(fbUser.uid, credentials.username);
      this._currentUser = user;
      return user;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  }

  async logout(): Promise<void> {
    const auth = getAuthClient();
    await signOut(auth);
    this._currentUser = null;
  }

  getCurrentUser(): User | null {
    return this._currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const auth = getAuthClient();
    return firebaseOnAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        this._currentUser = null;
        callback(null);
        return;
      }
      try {
        const username = fbUser.email?.replace('@cricketapp.local', '') ?? '';
        const user = await buildUserFromUid(fbUser.uid, username);
        this._currentUser = user;
        callback(user);
      } catch {
        this._currentUser = null;
        callback(null);
      }
    });
  }
}
