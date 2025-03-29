const UsersModule = {
    renderPending: () => {
        const ul = document.getElementById("admin-users-list");
        ul.innerHTML = "";
        Database.getPendingUsers().then(users => {
            users.forEach(user => {
                const li = document.createElement("li");
                li.textContent = `${user.email}`;
                const btn = document.createElement("button");
                btn.textContent = "Approuver";
                btn.onclick = async () => {
                    user.status = "approved";
                    await Database.updateUser(user);
                    Database.log(`Admin a approuvé ${user.email}`);
                    UsersModule.renderPending();
                };
                li.appendChild(btn);
                ul.appendChild(li);
            });
        });
    },

    renderLogs: () => {
        const ul = document.getElementById("admin-logs");
        ul.innerHTML = "";
        Database.getLogs().then(logs => {
            logs.forEach(entry => {
                const li = document.createElement("li");
                li.textContent = `[${entry.timestamp}] ${entry.message}`;
                ul.appendChild(li);
            });
        });
    }
};