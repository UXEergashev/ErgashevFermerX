import { getDB } from './database';
import { syncSingleToCloud, removeSingleFromCloud } from './sync';
import { auth } from './firebase';

// Generic CRUD operations
export const add = async (storeName, data) => {
    const db = await getDB();
    const id = await db.add(storeName, data);
    const item = { ...data, id };

    // Sync to cloud if user is logged in
    if (auth.currentUser) {
        await syncSingleToCloud(storeName, item);
    }

    return id;
};

export const getAll = async (storeName, indexName = null, query = null) => {
    const db = await getDB();
    if (indexName && query) {
        return await db.getAllFromIndex(storeName, indexName, query);
    }
    return await db.getAll(storeName);
};

export const getById = async (storeName, id) => {
    const db = await getDB();
    return await db.get(storeName, id);
};

export const update = async (storeName, data) => {
    const db = await getDB();
    const result = await db.put(storeName, data);

    // Sync to cloud if user is logged in
    if (auth.currentUser) {
        await syncSingleToCloud(storeName, data);
    }

    return result;
};

export const remove = async (storeName, id) => {
    const db = await getDB();
    const item = await db.get(storeName, id);
    if (item) {
        // Move to trash
        const trashItem = {
            ...item,
            originalStore: storeName,
            deletedAt: new Date().toISOString(),
            originalId: id
        };
        await db.add('trash', trashItem);

        // Sync trash to cloud
        if (auth.currentUser) {
            await syncSingleToCloud('trash', trashItem);
            await removeSingleFromCloud(storeName, id);
        }

        // Remove from original store
        return await db.delete(storeName, id);
    }
};

// Trash operations
export const restoreFromTrash = async (trashId) => {
    const db = await getDB();
    const item = await db.get('trash', trashId);
    if (item) {
        const { originalStore, deletedAt, originalId, ...rest } = item;
        // Restore to original store
        await db.add(originalStore, rest);
        // Remove from trash
        return await db.delete('trash', trashId);
    }
};

export const emptyTrash = async (userId) => {
    const db = await getDB();
    const tx = db.transaction('trash', 'readwrite');
    const index = tx.store.index('userId');
    let cursor = await index.openCursor(userId);
    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    await tx.done;
};

export const getTrashByUserId = async (userId) => {
    const db = await getDB();
    return await db.getAllFromIndex('trash', 'userId', userId);
};

export const deleteFromTrashPermanently = async (trashId) => {
    const db = await getDB();
    return await db.delete('trash', trashId);
};

// User operations
export const createUser = async (userData) => {
    return await add('users', {
        ...userData,
        createdAt: new Date().toISOString()
    });
};

export const getUserByPhone = async (phone) => {
    const db = await getDB();
    return await db.getFromIndex('users', 'phone', phone);
};

// Get all data for a specific user
export const getAllByUserId = async (storeName, userId) => {
    return await getAll(storeName, 'userId', userId);
};
