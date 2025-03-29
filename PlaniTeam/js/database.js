const DB_NAME = "Planified";
const DB_VERSION = 1;
let db;

const Database = {
    open: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                db = e.target.result;
                if (!db.objectStoreNames.contains("users")) {
                    const users = db.createObjectStore("users", { keyPath: "email" });
                    users.createIndex("status", "status", { unique: false });
                }
                if (!db.objectStoreNames.contains("events"))
                    db.createObjectStore("events", { keyPath: "id", autoIncrement: true });
                if (!db.objectStoreNames.contains("logs"))
                    db.createObjectStore("logs", { keyPath: "timestamp" });
            };
            request.onsuccess = () => {
                db = request.result;
                resolve();
            };
            request.onerror = () => reject("Erreur ouverture DB");
        });
    },

    addEvent: (event) => {
        const tx = db.transaction("events", "readwrite");
        tx.objectStore("events").add(event);
    },

    getEvents: () => {
        return new Promise((resolve) => {
            const req = db.transaction("events").objectStore("events").getAll();
            req.onsuccess = () => resolve(req.result);
        });
    },

    addUser: (user) => {
        const tx = db.transaction("users", "readwrite");
        tx.objectStore("users").add(user);
    },

    getUser: (email) => {
        return new Promise((resolve) => {
            const req = db.transaction("users").objectStore("users").get(email);
            req.onsuccess = () => resolve(req.result);
        });
    },

    updateUser: (user) => {
        const tx = db.transaction("users", "readwrite");
        tx.objectStore("users").put(user);
    },

    getPendingUsers: () => {
        return new Promise((resolve) => {
            const index = db.transaction("users").objectStore("users").index("status");
            const req = index.getAll("pending");
            req.onsuccess = () => resolve(req.result);
        });
    },

    log: (message) => {
        const logEntry = { message, timestamp: new Date().toISOString() };
        db.transaction("logs", "readwrite").objectStore("logs").add(logEntry);
    },

    getLogs: () => {
        return new Promise((resolve) => {
            const req = db.transaction("logs").objectStore("logs").getAll();
            req.onsuccess = () => resolve(req.result.reverse());
        });
    }
};

Database.open().then(() => {
    console.log("DB prête");
});