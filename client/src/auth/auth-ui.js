export function initAuthUI() {
  console.log("🔒 Auth UI Initialized");

  const elements = {
    // Buttons Containers
    guestButtons: document.getElementById("guest-buttons"),
    userProfileBtn: document.getElementById("user-profile-btn"),

    // Trigger Buttons
    loginBtn: document.getElementById("login-btn"),
    signupBtn: document.getElementById("signup-btn"),

    // Panel Elements
    authPanel: document.getElementById("auth-panel"),
    authBox: document.getElementById("auth-box"),
    closeBtn: document.getElementById("close-auth"),

    // Tabs
    tabLogin: document.getElementById("tab-login"),
    tabRegister: document.getElementById("tab-register"),

    // Forms
    formLogin: document.getElementById("form-login"),
    formRegister: document.getElementById("form-register"),

    // Display Info
    userDisplayName: document.getElementById("user-display-name"),
    authMessage: document.getElementById("auth-message"),

    // Inputs
    loginIdentifier: document.getElementById("login-identifier"),
    loginPassword: document.getElementById("login-password"),
    regUsername: document.getElementById("reg-username"),
    regEmail: document.getElementById("reg-email"),
    regPassword: document.getElementById("reg-password"),
  };

  // if loginBtn or userProfileBtn not found, exit
  if (!elements.loginBtn && !elements.userProfileBtn) return;

  // Check login status on load
  checkLoginStatus();

  // --- EVENT LISTENERS ---

  // Login button click to open login panel
  if (elements.loginBtn) {
    elements.loginBtn.addEventListener("click", () => {
      switchAuthTab("login");
      openPanel();
    });
  }

  // Signup button click to open register panel
  if (elements.signupBtn) {
    elements.signupBtn.addEventListener("click", () => {
      switchAuthTab("register");
      openPanel();
    });
  }

  // Profile button click to logout
  if (elements.userProfileBtn) {
    elements.userProfileBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) logout();
    });
  }

  // Close panel
  if (elements.closeBtn)
    elements.closeBtn.addEventListener("click", closePanel);
  if (elements.authPanel) {
    elements.authPanel.addEventListener("click", (e) => {
      if (e.target === elements.authPanel) closePanel();
    });
  }

  // Tab Switching
  if (elements.tabLogin)
    elements.tabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (elements.tabRegister)
    elements.tabRegister.addEventListener("click", () =>
      switchAuthTab("register")
    );

  // --- API REQUESTS ---

  // LOGIN SUBMIT
  if (elements.formLogin) {
    elements.formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoading(true);
      clearMessage();

      const identifier = elements.loginIdentifier.value;
      const password = elements.loginPassword.value;

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        loginSuccess(data);
      } catch (error) {
        showMessage(error.message, "error");
      } finally {
        showLoading(false);
      }
    });
  }

  // REGISTER SUBMIT
  if (elements.formRegister) {
    elements.formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoading(true);
      clearMessage();

      const username = elements.regUsername.value;
      const email = elements.regEmail.value;
      const password = elements.regPassword.value;

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");

        loginSuccess(data);
      } catch (error) {
        showMessage(error.message, "error");
      } finally {
        showLoading(false);
      }
    });
  }

  // --- LOGIC FUNCTIONS ---

  // Login Success
  function loginSuccess(data) {
    console.log("✅ Auth Success:", data.user.username);

    // Save token & user info
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Show success message and update UI after one second
    showMessage(`Welcome back, ${data.user.username}!`, "success");
    setTimeout(() => {
      closePanel();
      updateUI(data.user);
    }, 1000);
  }

  // Check login status on load
  function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      updateUI(user);
    } else {
      // Back to guest mode if token/user not found
      showGuestMode();
    }
  }

  // Update UI after login
  function updateUI(user) {
    // Hide guest buttons
    if (elements.guestButtons) elements.guestButtons.classList.add("hidden");

    // Show profile button and set username
    if (elements.userProfileBtn)
      elements.userProfileBtn.classList.remove("hidden");
    if (elements.userDisplayName)
      elements.userDisplayName.textContent = user.username;
  }

  // Show guest mode
  function showGuestMode() {
    if (elements.guestButtons) elements.guestButtons.classList.remove("hidden");
    if (elements.userProfileBtn)
      elements.userProfileBtn.classList.add("hidden");
  }

  // Logout
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Refresh to renew state
  }

  // --- UI Helper Functions ---

  function openPanel() {
    elements.authPanel.classList.remove("hidden");
    setTimeout(() => {
      elements.authBox.classList.remove("scale-95", "opacity-0");
      elements.authBox.classList.add("scale-100", "opacity-100");
    }, 10);
  }

  function closePanel() {
    elements.authBox.classList.remove("scale-100", "opacity-100");
    elements.authBox.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      elements.authPanel.classList.add("hidden");
      clearMessage();
      if (elements.formLogin) elements.formLogin.reset();
      if (elements.formRegister) elements.formRegister.reset();
    }, 300);
  }

  // Switch between login and register tabs
  function switchAuthTab(tab) {
    clearMessage();
    if (tab === "login") {
      elements.tabLogin.classList.add("text-white", "border-purple-500");
      elements.tabLogin.classList.remove("text-gray-400", "border-transparent");
      elements.tabRegister.classList.add("text-gray-400", "border-transparent");
      elements.tabRegister.classList.remove("text-white", "border-purple-500");
      elements.formLogin.classList.remove("hidden");
      elements.formRegister.classList.add("hidden");
    } else {
      elements.tabRegister.classList.add("text-white", "border-purple-500");
      elements.tabRegister.classList.remove(
        "text-gray-400",
        "border-transparent"
      );
      elements.tabLogin.classList.add("text-gray-400", "border-transparent");
      elements.tabLogin.classList.remove("text-white", "border-purple-500");
      elements.formRegister.classList.remove("hidden");
      elements.formLogin.classList.add("hidden");
    }
  }

  // Show message
  function showMessage(msg, type) {
    elements.authMessage.textContent = msg;
    elements.authMessage.classList.remove(
      "hidden",
      "text-red-500",
      "text-green-500"
    );

    if (type === "error") {
      elements.authMessage.classList.add("text-red-500");
    } else {
      elements.authMessage.classList.add("text-green-500");
    }
  }

  // Clear message
  function clearMessage() {
    elements.authMessage.classList.add("hidden");
    elements.authMessage.textContent = "";
  }

  // Show loading state
  function showLoading(isLoading) {
    const btns = document.querySelectorAll('#auth-box button[type="submit"]');
    btns.forEach((btn) => {
      btn.disabled = isLoading;
      btn.style.opacity = isLoading ? "0.5" : "1";

      btns.forEach((btn) => {
        btn.disabled = isLoading;
        if (isLoading) {
          btn.classList.add("opacity-75", "cursor-not-allowed");
          btn.innerHTML = `
                    <div class="flex items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </div>
                `;
        } else {
          btn.classList.remove("opacity-75", "cursor-not-allowed");

          if (btn.id === "btn-login-submit") {
            btn.textContent = "ENTER THE ARENA";
          } else if (btn.id === "btn-register-submit") {
            btn.textContent = "CREATE LEGEND";
          }
        }
      });
    });
  }
}
