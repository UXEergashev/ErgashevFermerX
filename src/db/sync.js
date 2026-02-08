import { db, auth } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import * as localDB from './operations';

const STORES_TO_SYNC = ['crops', 'land', 'expenses', 'income', 'warehouse', 'warehouseHistory', 'notifications', 'trash'];

/**
 * Sync local data to Cloud (Firestore)
 */
export const syncLocalToCloud = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not logged in' };

    try {
        const batch = writeBatch(db);
        let syncCount = 0;

        for (const storeName of STORES_TO_SYNC) {
            const localData = await localDB.getAllByUserId(storeName, user.uid);

            for (const item of localData) {
                // Use a combination of storeName and localId as the document id in Firestore
                // to avoid duplicates and allow updates
                const docId = `${storeName}_${item.id}`;
                const docRef = doc(db, 'userData', user.uid, 'data', docId);

                batch.set(docRef, {
                    ...item,
                    _storeName: storeName,
                    _updatedAt: serverTimestamp(),
                    userId: user.uid // Ensure userId matches cloud uid
                });
                syncCount++;
            }
        }

        if (syncCount > 0) {
            await batch.commit();
        }

        return { success: true, count: syncCount };
    } catch (error) {
        console.error("Cloud Sync Error (Local -> Cloud):", error);
        return { success: false, error: error.message };
    }
};

/**
 * Sync Cloud data to Local (IndexedDB)
 */
export const syncCloudToLocal = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not logged in' };

    try {
        const q = query(collection(db, 'userData', user.uid, 'data'));
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
            const cloudData = doc.data();
            const { _storeName, _updatedAt, ...localData } = cloudData;

            // Re-map cloud ID to local ID if needed, but usually we just put it back
            // We use put (update) to either update or add
            await localDB.update(_storeName, localData);
        }

        return { success: true, count: querySnapshot.size };
    } catch (error) {
        console.error("Cloud Sync Error (Cloud -> Local):", error);
        return { success: false, error: error.message };
    }
};

/**
 * Sync a single item to Cloud
 */
export const syncSingleToCloud = async (storeName, item) => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not logged in' };

    try {
        const docId = `${storeName}_${item.id}`;
        const docRef = doc(db, 'userData', user.uid, 'data', docId);

        await setDoc(docRef, {
            ...item,
            _storeName: storeName,
            _updatedAt: serverTimestamp(),
            userId: user.uid
        });

        return { success: true };
    } catch (error) {
        console.error(`Sync Single to Cloud Error (${storeName}):`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Remove a single item from Cloud
 */
export const removeSingleFromCloud = async (storeName, id) => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not logged in' };

    try {
        const docId = `${storeName}_${id}`;
        const docRef = doc(db, 'userData', user.uid, 'data', docId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error(`Remove Single from Cloud Error (${storeName}):`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Full bi-directional sync
 */
export const fullSync = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not logged in' };

    console.log("Starting full sync...");
    // 1. First pull from cloud to local (to get changes from other devices)
    const toLocal = await syncCloudToLocal();
    // 2. Then push local changes to cloud
    const toCloud = await syncLocalToCloud();

    console.log("Sync finished.", { toCloud, toLocal });
    return { toCloud, toLocal };
};
