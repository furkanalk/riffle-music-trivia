export function initAuthUI() {
  console.log("🔒 Auth UI Initialized");
  
  const elements = {
    // Buttons Containers
    guestButtons: document.getElementById('guest-buttons'),
    userProfileBtn: document.getElementById('user-profile-btn'),
    
    // Trigger Buttons
    loginBtn: document.getElementById('login-btn'),
    signupBtn: document.getElementById('signup-btn'),
    
    // Panel Elements
    authPanel: document.getElementById('auth-panel'),
    authBox: document.getElementById('auth-box'),
    closeBtn: document.getElementById('close-auth'),
    
    // Tabs
    tabLogin: document.getElementById('tab-login'),
    tabRegister: document.getElementById('tab-register'),
    
    // Forms
    formLogin: document.getElementById('form-login'),
    formRegister: document.getElementById('form-register'),
    
    // Display Info
    userDisplayName: document.getElementById('user-display-name'),
    authMessage: document.getElementById('auth-message'),
    
    // Inputs
    loginIdentifier: document.getElementById('login-identifier'),
    loginPassword: document.getElementById('login-password'),
    regUsername: document.getElementById('reg-username'),
    regEmail: document.getElementById('reg-email'),
    regPassword: document.getElementById('reg-password')
  };

  // if loginBtn or userProfileBtn not found, exit
  if (!elements.loginBtn && !elements.userProfileBtn) return;

  // Check login status on load
  checkLoginStatus();

  // --- EVENT LISTENERS ---

  // Login button click to open login panel
  if (elements.loginBtn) {
    elements.loginBtn.addEventListener('click', () => {
      switchAuthTab('login');
      openPanel();
    });
  }

  // Signup button click to open register panel
  if (elements.signupBtn) {
    elements.signupBtn.addEventListener('click', () => {
      switchAuthTab('register');
      openPanel();
    });
  }

  // Profile button click to logout
  if (elements.userProfileBtn) {
    elements.userProfileBtn.addEventListener('click', () => {
      if(confirm("Are you sure you want to logout?")) logout();
    });
  }

  // Close panel
  if (elements.closeBtn) elements.closeBtn.addEventListener('click', closePanel);
  if (elements.authPanel) {
    elements.authPanel.addEventListener('click', (e) => {
      if (e.target === elements.authPanel) closePanel();
    });
  }

  // Tab Switch
  elements.tabLogin.addEventListener('click', () => switchAuthTab('login'));
  elements.tabRegister.addEventListener('click', () => switchAuthTab('register'));

  // --- API REQUESTS ---

  // LOGIN SUBMIT
  elements.formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading(true);
    clearMessage();

    const identifier = elements.loginIdentifier.value;
    const password = elements.loginPassword.value;

    try {
      const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      loginSuccess(data);

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      showLoading(false);
    }
  });

  // REGISTER SUBMIT
  elements.formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading(true);
    clearMessage();

    const username = elements.regUsername.value;
    const email = elements.regEmail.value;
    const password = elements.regPassword.value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Auto login after successful registration
      loginSuccess(data); 

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      showLoading(false);
    }
  });

  // Login Success
  function loginSuccess(data) {
    console.log("✅ Auth Success:", data.user.username);
    
    // Save token & user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show success message and update UI
    showMessage(`Welcome back, ${data.user.username}!`, 'success');
    setTimeout(() => {
      closePanel();
      updateUI(data.user);
    }, 1000);
  }

  // Check login status on load
  function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
      updateUI(user);
    }
  }

  // Update UI after login
  function updateUI(user) {
    // Change Guest text button to Username
    if (elements.userDisplayName) {
      elements.userDisplayName.textContent = user.username;
    }
    // Avatar color can be set here based on user info
  }

  // Logout
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); // Refresh to renew state
  }

  // --- UI Helper Functions ---

  function openPanel() {
    elements.authPanel.classList.remove('hidden');
    setTimeout(() => {
      elements.authBox.classList.remove('scale-95', 'opacity-0');
      elements.authBox.classList.add('scale-100', 'opacity-100');
    }, 10);
  }

  function closePanel() {
    elements.authBox.classList.remove('scale-100', 'opacity-100');
    elements.authBox.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      elements.authPanel.classList.add('hidden');
      clearMessage();
      elements.formLogin.reset();
      elements.formRegister.reset();
    }, 300);
  }

  function switchAuthTab(tab) {
    clearMessage();
    if (tab === 'login') {
      elements.tabLogin.classList.add('text-white', 'border-purple-500');
      elements.tabLogin.classList.remove('text-gray-400', 'border-transparent');
      elements.tabRegister.classList.add('text-gray-400', 'border-transparent');
      elements.tabRegister.classList.remove('text-white', 'border-purple-500');
      elements.formLogin.classList.remove('hidden');
      elements.formRegister.classList.add('hidden');
    } else {
      elements.tabRegister.classList.add('text-white', 'border-purple-500');
      elements.tabRegister.classList.remove('text-gray-400', 'border-transparent');
      elements.tabLogin.classList.add('text-gray-400', 'border-transparent');
      elements.tabLogin.classList.remove('text-white', 'border-purple-500');
      elements.formRegister.classList.remove('hidden');
      elements.formLogin.classList.add('hidden');
    }
  }

  function showMessage(msg, type) {
    elements.authMessage.textContent = msg;
    elements.authMessage.classList.remove('hidden', 'text-red-500', 'text-green-500');
    
    if (type === 'error') {
      elements.authMessage.classList.add('text-red-500');
    } else {
      elements.authMessage.classList.add('text-green-500');
    }
  }

  function clearMessage() {
    elements.authMessage.classList.add('hidden');
    elements.authMessage.textContent = '';
  }

  function showLoading(isLoading) {
    // Butonları disable etme animasyonu eklenebilir
    const btns = document.querySelectorAll('#auth-box button[type="submit"]');
    btns.forEach(btn => {
      btn.disabled = isLoading;
      btn.style.opacity = isLoading ? '0.5' : '1';
      btn.textContent = isLoading ? 'Processing...' : (btn.id === 'btn-login' ? 'ENTER THE ARENA' : btn.textContent);
    });
  }
}