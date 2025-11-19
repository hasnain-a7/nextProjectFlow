"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  updatePassword,
} from "firebase/auth";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/config/Firebase";

export interface User {
  id?: string;
  email: string | null;
  fullname?: string | null;
  location?: string | null;
  occupation?: string | null;
  origanization?: string | null;
  isActive?: boolean;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

type UserContextType = {
  userContextId: string | null;
  setUserId: (id: string | null) => void;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    createUserData: User
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteFirebaseAccount: (userId: string) => Promise<void>;
  changeUserPassword: (newPassword: string) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userContextId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    createUserData: User
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userData: User = {
        id: user.uid,
        email: user.email,
        fullname: createUserData.fullname || "",
        location: createUserData.location || "",
        occupation: createUserData.occupation || "",
        origanization: createUserData.origanization || "",
        isActive: false,
        bio: createUserData.bio || "",
        avatar: createUserData.avatar || "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, userData);
      console.log("✅ User registered & Firestore profile created!");
    } catch (error) {
      console.error("❌ Signup error:", (error as Error).message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ User logged in!");
    } catch (error) {
      console.error("❌ Login error:", (error as Error).message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      console.log("🚪 User logged out!");
    } catch (error) {
      console.error("❌ Logout error:", (error as Error).message);
      throw error;
    }
  };

  const deleteFirebaseAccount = async (userId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("⚠️ No signed-in user.");
        return;
      }
      await deleteDoc(doc(db, "users", userId));
      console.log("🗑️ Firestore user document deleted");
      await deleteUser(user);
      console.log("✅ Firebase Auth account deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting account:", (error as Error).message);
    }
  };

  const changeUserPassword = async (newPassword: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently logged in.");

      await updatePassword(user, newPassword);
      console.log("✅ Password updated successfully!");
      return true;
    } catch (error) {
      console.error("❌ Error updating password:", (error as Error).message);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userContextId,
        setUserId,
        loading,
        signUp,
        login,
        logout,
        deleteFirebaseAccount,
        changeUserPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContextId = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContextId must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
