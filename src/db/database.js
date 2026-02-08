import { openDB } from 'idb';

const DB_NAME = 'FermerXDB';
const DB_VERSION = 4;

export const initDB = async () => {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
            // Users store
            if (!db.objectStoreNames.contains('users')) {
                const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                userStore.createIndex('phone', 'phone', { unique: true });
            }

            // Crops store
            let cropStore;
            if (!db.objectStoreNames.contains('crops')) {
                cropStore = db.createObjectStore('crops', { keyPath: 'id', autoIncrement: true });
            } else {
                cropStore = transaction.objectStore('crops');
            }
            if (!cropStore.indexNames.contains('userId')) {
                cropStore.createIndex('userId', 'userId');
            }

            // Land store
            let landStore;
            if (!db.objectStoreNames.contains('land')) {
                landStore = db.createObjectStore('land', { keyPath: 'id', autoIncrement: true });
            } else {
                landStore = transaction.objectStore('land');
            }
            if (!landStore.indexNames.contains('userId')) {
                landStore.createIndex('userId', 'userId');
            }

            // Expenses store
            let expenseStore;
            if (!db.objectStoreNames.contains('expenses')) {
                expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
            } else {
                expenseStore = transaction.objectStore('expenses');
            }
            if (!expenseStore.indexNames.contains('userId')) {
                expenseStore.createIndex('userId', 'userId');
            }
            if (!expenseStore.indexNames.contains('date')) {
                expenseStore.createIndex('date', 'date');
            }

            // Income store
            let incomeStore;
            if (!db.objectStoreNames.contains('income')) {
                incomeStore = db.createObjectStore('income', { keyPath: 'id', autoIncrement: true });
            } else {
                incomeStore = transaction.objectStore('income');
            }
            if (!incomeStore.indexNames.contains('userId')) {
                incomeStore.createIndex('userId', 'userId');
            }
            if (!incomeStore.indexNames.contains('date')) {
                incomeStore.createIndex('date', 'date');
            }

            // Warehouse store
            let warehouseStore;
            if (!db.objectStoreNames.contains('warehouse')) {
                warehouseStore = db.createObjectStore('warehouse', { keyPath: 'id', autoIncrement: true });
            } else {
                warehouseStore = transaction.objectStore('warehouse');
            }
            if (!warehouseStore.indexNames.contains('userId')) {
                warehouseStore.createIndex('userId', 'userId');
            }

            // Warehouse History store
            let historyStore;
            if (!db.objectStoreNames.contains('warehouseHistory')) {
                historyStore = db.createObjectStore('warehouseHistory', { keyPath: 'id', autoIncrement: true });
            } else {
                historyStore = transaction.objectStore('warehouseHistory');
            }
            if (!historyStore.indexNames.contains('userId')) {
                historyStore.createIndex('userId', 'userId');
            }

            // Notifications store
            let notificationStore;
            if (!db.objectStoreNames.contains('notifications')) {
                notificationStore = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
            } else {
                notificationStore = transaction.objectStore('notifications');
            }
            if (!notificationStore.indexNames.contains('userId')) {
                notificationStore.createIndex('userId', 'userId');
            }

            // Trash store
            let trashStore;
            if (!db.objectStoreNames.contains('trash')) {
                trashStore = db.createObjectStore('trash', { keyPath: 'id', autoIncrement: true });
            } else {
                trashStore = transaction.objectStore('trash');
            }
            if (!trashStore.indexNames.contains('userId')) {
                trashStore.createIndex('userId', 'userId');
            }

            // Migration for version 4: Extra checks if needed
            if (oldVersion < 4) {
                // Version 4 specific logic
            }
        },
    });

    return db;
};

export const getDB = async () => {
    return await openDB(DB_NAME, DB_VERSION);
};
