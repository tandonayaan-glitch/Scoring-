import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { firebaseApp } from './firebaseConfig';

let _auth: Auth | null = null;

export function getAuthClient(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(firebaseApp);
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
    connectAuthEmulator(_auth, 'http://localhost:9099', { disableWarnings: true });
  }
  return _auth;
}
