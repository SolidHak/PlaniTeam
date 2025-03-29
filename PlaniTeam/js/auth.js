const Auth = {
    register: async (email, password) => {
        const existing = await Database.getUser(email);
        if (existing) throw new Error("Email déjà utilisé.");
        const all = await Database.getPendingUsers();
        const isFirst = all.length === 0;
        const user = {
            email, password,
            role: isFirst ? "admin" : "user",
            name: "Nouvel utilisateur",
            status: isFirst ? "approved" : "pending"
        };
        Database.addUser(user);
        Database.log(`${email} inscrit (statut : ${user.status})`);
        return user;
    },
    login: async (email, password) => {
        const user = await Database.getUser(email);
        if (!user || user.password !== password) throw new Error("Identifiants invalides.");
        if (user.status !== "approved") throw new Error("Votre compte est en attente d'approbation.");
        Database.log(`${email} connecté`);
        return user;
    },
    current: null,
    logout: () => {
        Auth.current = null;
        sessionStorage.removeItem("user");
    },
    saveSession: (user) => {
        Auth.current = user;
        sessionStorage.setItem("user", JSON.stringify(user));
    },
    loadSession: () => {
        const user = sessionStorage.getItem("user");
        if (user) Auth.current = JSON.parse(user);
    }
};