import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByPhone, createUser } from '../db/operations';
import { initDB } from '../db/database';
import { auth } from '../db/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile
} from 'firebase/auth';
import { fullSync } from '../db/sync';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await initDB();
            } catch (err) {
                console.error("DB Init Error:", err);
            }
        };
        init();

        // Listen for Firebase Auth changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userSession = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Fermer',
                    phone: firebaseUser.phoneNumber || firebaseUser.email,
                    email: firebaseUser.email
                };
                setUser(userSession);

                // Perform initial sync from cloud when logging in on a new device
                setIsSyncing(true);
                try {
                    await fullSync();
                } catch (e) {
                    console.error("Initial sync failed:", e);
                } finally {
                    setIsSyncing(false);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (phoneOrEmail, password) => {
        try {
            // Firebase uses email for login, so we'll treat phone as part of email if it's just a number
            const email = phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@fermerx.com`;
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            // Fallback for demo: check local DB if Firebase fails (e.g. not configured)
            try {
                const localUser = await getUserByPhone(phoneOrEmail);
                if (localUser && localUser.password === password) {
                    const userSession = {
                        id: localUser.id || 'local_user',
                        name: localUser.name,
                        phone: localUser.phone
                    };
                    setUser(userSession);
                    return { success: true };
                }
            } catch (e) { }

            let message = 'Login xatoligi';
            if (error.code === 'auth/user-not-found') message = 'Foydalanuvchi topilmadi';
            if (error.code === 'auth/wrong-password') message = 'Parol noto\'g\'ri';
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const email = `${userData.phone}@fermerx.com`;
            const userCredential = await createUserWithEmailAndPassword(auth, email, userData.password);

            // Update profile with name
            await updateProfile(userCredential.user, {
                displayName: userData.name
            });

            // Also save locally for offline use
            await createUser({
                ...userData,
                id: userCredential.user.uid
            });

            return { success: true };
        } catch (error) {
            console.error("Register Error:", error);
            let message = 'Ro\'yxatdan o\'tishda xatolik';
            if (error.code === 'auth/email-already-in-use') message = 'Bu raqam allaqachon mavjud';
            if (error.code === 'auth/weak-password') message = 'Parol juda kuchsiz';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            // Push final data to cloud before logging out
            await fullSync();
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isSyncing,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

