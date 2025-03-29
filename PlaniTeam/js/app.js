document.addEventListener("DOMContentLoaded", () => {
    Auth.loadSession();

    const pages = {
        login: document.getElementById("login-page"),
        register: document.getElementById("register-page"),
        calendar: document.getElementById("calendar-page"),
        admin: document.getElementById("admin-page"),
    };

    const show = (key) => {
        Object.values(pages).forEach(p => p.style.display = "none");
        pages[key].style.display = "block";
    };

    const updateNav = () => {
        const u = Auth.current;
        document.getElementById("nav-login").style.display = u ? "none" : "inline";
        document.getElementById("nav-register").style.display = u ? "none" : "inline";
        document.getElementById("nav-calendar").style.display = u ? "inline" : "none";
        document.getElementById("nav-admin").style.display = u?.role === "admin" ? "inline" : "none";
        document.getElementById("nav-logout").style.display = u ? "inline" : "none";
    };

    // Formulaires
    document.getElementById("login-form").onsubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await Auth.login(login - email.value, login - password.value);
            Auth.saveSession(user);
            updateNav();
            show("calendar");
            CalendarModule.init();
        } catch (err) { login - message.textContent = err.message; }
    };

    document.getElementById("registration-form").onsubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await Auth.register(reg - email.value, reg - password.value);
            register - message.textContent = "Inscription réussie. Attente approbation.";
        } catch (err) {
            register - message.textContent = err.message;
        }
    };

    // Nav
    document.getElementById("nav-login").onclick = () => show("login");
    document.getElementById("nav-register").onclick = () => show("register");
    document.getElementById("nav-calendar").onclick = () => {
        show("calendar");
        CalendarModule.init();
    };
    document.getElementById("nav-admin").onclick = () => {
        show("admin");
        UsersModule.renderPending();
        UsersModule.renderLogs();
    };
    document.getElementById("nav-logout").onclick = () => { Auth.logout(); location.reload(); };
    document.getElementById("nav-theme").onclick = () => {
        const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    };

    // Initial
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (Auth.current) {
        updateNav();
        show("calendar");
        CalendarModule.init();
    } else {
        show("login");
    }
});