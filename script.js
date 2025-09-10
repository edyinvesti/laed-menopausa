document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando aplicação...");
    initApp();
});

function initApp() {
    createParticles();
    setupEventListeners();
    loadUserData();
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
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            console.log("Botão de voz clicado");
            handleVoiceCommand();
        });
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log("Botão de login clicado");
            showLoginModal();
        });
    }

    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            console.log("Botão de perfil clicado");
            showProfile();
        });
    }

    const addToDiaryBtn = document.getElementById('addToDiaryBtn');
    if (addToDiaryBtn) {
        addToDiaryBtn.addEventListener('click', () => {
            console.log("Botão Adicionar ao Diário clicado");
            addToDiary();
        });
    }

    const purchaseBtns = document.querySelectorAll('.purchase-btn');
    purchaseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Botão de compra (plano ${this.dataset.plan}) clicado`);
            handlePurchase(this.dataset.plan);
        });
    });

    const closeModalBtn = document.querySelector('.close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log("Botão de fechar modal clicado");
            closeModal();
        });
    }

    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            console.log("Clicado fora do modal, fechando...");
            closeModal();
        }
    });
}

function loadUserData() {
    // Simulação de dados iniciais (pode ser expandido com API ou localStorage)
    console.log("Carregando dados do usuário...");
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

// Reconhecimento de voz
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    const voiceBtn = document.getElementById('voiceBtn');

    recognition.onstart = function() {
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-circle"></i>';
            voiceBtn.style.background = 'var(--secondary)';
        }
        showToast("Ouvindo...");
        console.log("Reconhecimento de voz iniciado");
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.style.background = 'var(--accent)';
        }
        console.log(`Comando de voz recebido: ${transcript}`);
        processVoiceCommand(transcript);
    };

    recognition.onerror = function(event) {
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.style.background = 'var(--accent)';
        }
        showToast("Erro no reconhecimento de voz: " + event.error);
        console.error("Erro no reconhecimento de voz:", event.error);
    };

    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => recognition.start());
    }
}

function processVoiceCommand(transcript) {
    if (transcript.includes('confirmar') || transcript.includes('dose')) {
        console.log("Processando comando: Confirmar dose");
        confirmDose();
    } else if (transcript.includes('comprar') || transcript.includes('reposição')) {
        console.log("Processando comando: Comprar");
        showPurchaseOptions();
    } else if (transcript.includes('lembrete') || transcript.includes('lembrar')) {
        console.log("Processando comando: Lembrete");
        setReminder();
    } else if (transcript.includes('estatísticas') || transcript.includes('estatistica')) {
        console.log("Processando comando: Estatísticas");
        showStats();
    } else if (transcript.includes('perfil')) {
        console.log("Processando comando: Perfil");
        showProfile();
    } else {
        showToast("Comando não reconhecido. Tente: 'confirmar dose', 'comprar', 'lembrete' ou 'perfil'");
        console.log("Comando não reconhecido:", transcript);
    }
}

function confirmDose() {
    showToast("Dose confirmada! Continue com o ótimo trabalho no seu tratamento.");
    const dosesTaken = document.getElementById('dosesTaken');
    const remainingDoses = document.getElementById('remainingDoses');
    if (dosesTaken && remainingDoses) {
        let currentValue = parseInt(dosesTaken.textContent) || 0;
        dosesTaken.textContent = currentValue + 1;
        let [current, total] = remainingDoses.textContent.split(' de ');
        current = parseInt(current) || 0;
        if (current > 0) {
            remainingDoses.textContent = `${current - 1} de ${total}`;
            const progressBar = document.getElementById('progressBar');
            const progressPercentage = document.getElementById('progressPercentage');
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