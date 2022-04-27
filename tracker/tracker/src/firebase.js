import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlNujBDqAtSWsjQ_UOxxiwM3y9HzR0ybI",
  authDomain: "project-c1270.firebaseapp.com",
  projectId: "project-c1270",
  storageBucket: "project-c1270.appspot.com",
  messagingSenderId: "59508850666",
  appId: "1:59508850666:web:5ef9be02fb8efe0fc7fc93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function useAuth() {
  const [ currentUser, setCurrentUser ] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}
