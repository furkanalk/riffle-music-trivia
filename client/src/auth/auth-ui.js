export function initAuthUI() {
    console.log("🔒 Auth UI Initialized");
    
    const elements = {
        authBtn: document.getElementById('auth-btn'),
        authPanel: document.getElementById('auth-panel'),
        authBox: document.getElementById('auth-box'),
        closeBtn: document.getElementById('close-auth'),
        tabLogin: document.getElementById('tab-login'),
        tabRegister: document.getElementById('tab-register'),
        formLogin: document.getElementById('form-login'),
        formRegister: document.getElementById('form-register'),
        userDisplayName: document.getElementById('user-display-name')
    };

    if (!elements.authBtn) return;

    // --- Event Listeners ---

    // Open Panel
    elements.authBtn.addEventListener('click', () => {
        elements.authPanel.classList.remove('hidden');
        // Delay for transition
        setTimeout(() => {
            elements.authBox.classList.remove('scale-95', 'opacity-0');
            elements.authBox.classList.add('scale-100', 'opacity-100');
        }, 10);
    });

    // Close Panel
    elements.closeBtn.addEventListener('click', closePanel);

    // Close on outside click
    elements.authPanel.addEventListener('click', (e) => {
        if (e.target === elements.authPanel) closePanel();
    });

    function closePanel() {
        elements.authBox.classList.remove('scale-100', 'opacity-100');
        elements.authBox.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            elements.authPanel.classList.add('hidden');
        }, 300);
    }

    // Tab Switch (Login -> Register)
    elements.tabLogin.addEventListener('click', () => switchAuthTab('login'));
    elements.tabRegister.addEventListener('click', () => switchAuthTab('register'));

    function switchAuthTab(tab) {
        if (tab === 'login') {
            // UI Update
            elements.tabLogin.classList.add('text-white', 'border-purple-500');
            elements.tabLogin.classList.remove('text-gray-400', 'border-transparent');
            
            elements.tabRegister.classList.add('text-gray-400', 'border-transparent');
            elements.tabRegister.classList.remove('text-white', 'border-purple-500');

            // Form Toggle
            elements.formLogin.classList.remove('hidden');
            elements.formRegister.classList.add('hidden');
        } else {
            // UI Update
            elements.tabRegister.classList.add('text-white', 'border-purple-500');
            elements.tabRegister.classList.remove('text-gray-400', 'border-transparent');
            
            elements.tabLogin.classList.add('text-gray-400', 'border-transparent');
            elements.tabLogin.classList.remove('text-white', 'border-purple-500');

            // Form Toggle
            elements.formRegister.classList.remove('hidden');
            elements.formLogin.classList.add('hidden');
        }
    }

    // Form Submit (logging for now)
    elements.formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        console.log(`🔑 Login Attempt: ${username}`);
        // Future API call will go here
    });

    elements.formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        console.log(`📝 Register Attempt: ${username} (${email})`);
        // Future API call will go here
    });
}