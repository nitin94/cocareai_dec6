import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCOvM4OZ62Ub7JUqQYhi_uu-KVDvwrtMzQ",
  authDomain: "cocareai2.firebaseapp.com",
  projectId: "cocareai2",
  storageBucket: "cocareai2.firebasestorage.app",
  messagingSenderId: "463302448727",
  appId: "1:463302448727:web:a8dca658df5cd495213512",
  measurementId: "G-DFFY7KCDSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and configure auth
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Initialize analytics only in production
let analytics = null;
if (import.meta.env.PROD) {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(console.error);
}

export { auth, analytics };