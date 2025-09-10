document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando aplicação Laed Menopausa...");
    initApp();
});

function initApp() {
    createParticles();
    setupEventListeners();
    loadUserData();
    updateReminderTime();
}

function createParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) {
        console.error("Elemento particles-container não encontrado");
        return;
    }
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 30 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        particlesContainer.appendChild(particle);
    }
    console.log("Partículas criadas");
}

function setupEventListeners() {
    const voiceBtn = document.getElementById('voiceBtn');
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    const addToDiaryBtn = document.getElementById('addToDiaryBtn');
    const purchaseBtns = document.querySelectorAll('.purchase-btn');
    const closeModalBtn = document.querySelector('.close');

    if (voiceBtn) voiceBtn.addEventListener('click', handleVoiceCommandStart);
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (profileBtn) profileBtn.addEventListener('click', showProfile);
    if (addToDiaryBtn) addToDiaryBtn.addEventListener('click', addToDiary);
    if (purchaseBtns.length) purchaseBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); handlePurchase(btn.dataset.plan); }));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('loginModal');
        if (modal && event.target === modal) closeModal();
    });
}

function loadUserData() {
    console.log("Carregando dados do usuário... (simulação)");
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        showToast("Acessando o sistema de login...");
    }
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function showProfile() {
    showToast("Acessando o perfil do usuário...");
}

function addToDiary() {
    showToast("Produto adicionado ao seu diário!");
}

function handlePurchase(plan) {
    showToast(`Compra do plano ${plan} iniciada!`);
}

function handleVoiceCommandStart() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        const voiceBtn = document.getElementById('voiceBtn');

        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-circle"></i>';
            voiceBtn.style.background = 'var(--secondary)';
        }

        recognition.onstart = () => {
            showToast("Ouvindo...");
            console.log("Reconhecimento de voz iniciado");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            if (voiceBtn) {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.background = 'var(--accent)';
            }
            console.log(`Comando de voz recebido: ${transcript}`);
            processVoiceCommand(transcript);
        };

        recognition.onerror = (event) => {
            if (voiceBtn) {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.background = 'var(--accent)';
            }
            showToast(`Erro no reconhecimento de voz: ${event.error}`);
            console.error("Erro no reconhecimento de voz:", event.error);
        };

        recognition.start();
    } else {
        showToast("Reconhecimento de voz não suportado neste navegador. Use o Chrome.");
        console.warn("SpeechRecognition não disponível");
    }
}

function processVoiceCommand(transcript) {
    if (transcript.includes('confirmar') || transcript.includes('dose')) {
        confirmDose();
    } else if (transcript.includes('comprar') || transcript.includes('reposição')) {
        showPurchaseOptions();
    } else if (transcript.includes('lembrete') || transcript.includes('lembrar')) {
        setReminder();
    } else if (transcript.includes('estatísticas') || transcript.includes('estatistica')) {
        showStats();
    } else if (transcript.includes('perfil')) {
        showProfile();
    } else {
        showToast("Comando não reconhecido. Tente: 'confirmar dose', 'comprar', 'lembrete' ou 'perfil'");
    }
}

function confirmDose() {
    showToast("Dose confirmada! Continue com o ótimo trabalho no seu tratamento.");
    const dosesTaken = document.getElementById('dosesTaken');
    const remainingDoses = document.getElementById('remainingDoses');
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');

    if (dosesTaken && remainingDoses && progressBar && progressPercentage) {
        let currentDoses = parseInt(dosesTaken.textContent) || 0;
        dosesTaken.textContent = currentDoses + 1;

        let [current, total] = remainingDoses.textContent.split(' de ').map(Number);
        if (current > 0) {
            remainingDoses.textContent = `${current - 1} de ${total}`;
            const progress = ((total - (current - 1)) / total) * 100;
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${Math.round(progress)}%`;
        }
    }
}

function showPurchaseOptions() {
    showToast("Opções de compra exibidas!");
}

function setReminder() {
    showToast("Lembrete configurado!");
}

function showStats() {
    showToast("Exibindo estatísticas!");
}

function updateReminderTime() {
    const badge = document.querySelector('.reminder-item .badge');
    if (badge) {
        const now = new Date();
        const reminderTime = new Date(now);
        reminderTime.setHours(20, 0, 0, 0); // 20:00 de hoje
        if (now > reminderTime) reminderTime.setDate(reminderTime.getDate() + 1); // Se passou, usa amanhã
        const diffMs = reminderTime - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        badge.textContent = `Em ${diffHours} horas e ${diffMinutes} minutos`;
        setTimeout(updateReminderTime, 60000); // Atualiza a cada minuto
    }
}