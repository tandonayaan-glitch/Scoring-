import { getFirestore, connectFirestoreEmulator, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';

let _db: Firestore | null = null;

export function getDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(firebaseApp);
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
    connectFirestoreEmulator(_db, 'localhost', 8080);
  }
  enableIndexedDbPersistence(_db).catch(() => {});
  return _db;
}
