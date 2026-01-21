/* ============================================
   Animation Controller
   Maneja las animaciones del flujo
   ============================================ */

const AnimationController = {
    // Configuración
    config: {
        stepDuration: 2000,
        dotDuration: 800,
        pauseBetweenSteps: 500
    },

    // Referencias DOM (se llenan en init)
    elements: {
        playBtn: null,
        playIcon: null,
        playText: null,
        speedBtn: null,
        progressFill: null,
        progressSteps: null,
        stepBanner: null,
        flowPaths: null,
        flowLabels: null,
        flowDots: null,
        actorCards: null
    },

    // Inicializar referencias DOM
    init() {
        this.elements = {
            playBtn: document.getElementById('playBtn'),
            playIcon: document.getElementById('playIcon'),
            playText: document.getElementById('playText'),
            speedBtn: document.getElementById('speedBtn'),
            progressFill: document.getElementById('progressFill'),
            progressSteps: document.querySelectorAll('.progress-step'),
            stepBanner: document.getElementById('stepBanner'),
            stepNum: document.getElementById('stepNum'),
            stepTitle: document.getElementById('stepTitle'),
            stepDesc: document.getElementById('stepDesc'),
            stepAmount: document.getElementById('stepAmount'),
            stepAmountLabel: document.getElementById('stepAmountLabel'),
            flowPaths: document.querySelectorAll('.flow-path'),
            flowLabels: document.querySelectorAll('.flow-label-group'),
            actorCards: document.querySelectorAll('.actor-card')
        };

        this.bindEvents();
        console.log('🎬 AnimationController initialized');
    },

    // Bindear eventos
    bindEvents() {
        // Play/Pause button
        if (this.elements.playBtn) {
            this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Speed button
        if (this.elements.speedBtn) {
            this.elements.speedBtn.addEventListener('click', () => this.cycleSpeed());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
            if (e.key === 'Escape') {
                this.stop();
            }
        });
    },

    // Toggle play/pause
    togglePlay() {
        if (AppState.isPlaying()) {
            this.stop();
        } else {
            this.play();
        }
    },

    // Iniciar animación
    async play() {
        if (AppState.isPlaying()) return;

        AppState.update({
            isPlaying: true,
            isPaused: false,
            currentStep: 0
        });

        this.updatePlayButton(true);
        this.hideAllFlowLabels();

        const steps = FLOW_STEPS.authorization;
        const speed = AppState.getSpeed();
        const stepDuration = this.config.stepDuration / speed;

        for (let i = 0; i < steps.length; i++) {
            if (!AppState.isPlaying()) break;

            const step = steps[i];
            AppState.set('currentStep', i);

            // Actualizar UI
            this.showStepBanner(step);
            this.highlightActor(step.actor);
            this.highlightPath(i);
            this.showFlowLabel(i);
            this.updateProgress(i, steps.length);

            // Animar dot
            await this.animateDot(i);

            // Esperar antes del siguiente paso
            await this.delay(stepDuration);
        }

        // Completar
        if (AppState.isPlaying()) {
            await this.delay(1000);
        }

        this.stop();
    },

    // Detener animación
    stop() {
        AppState.update({
            isPlaying: false,
            isPaused: false,
            currentStep: 0
        });

        this.updatePlayButton(false);
        this.hideStepBanner();
        this.clearHighlights();
        this.clearPathHighlights();
        this.hideAllFlowLabels();
        this.resetProgress();
    },

    // Ciclar velocidad
    cycleSpeed() {
        const speeds = [1, 1.5, 2, 0.5];
        const currentSpeed = AppState.getSpeed();
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];

        AppState.set('speed', newSpeed);

        if (this.elements.speedBtn) {
            this.elements.speedBtn.textContent = `${newSpeed}x`;
        }
    },

    // Actualizar botón de play
    updatePlayButton(isPlaying) {
        if (!this.elements.playBtn) return;

        if (isPlaying) {
            this.elements.playBtn.classList.add('playing');
            if (this.elements.playIcon) this.elements.playIcon.textContent = '⏸';
            if (this.elements.playText) this.elements.playText.textContent = 'Pausar';
        } else {
            this.elements.playBtn.classList.remove('playing');
            if (this.elements.playIcon) this.elements.playIcon.textContent = '▶';
            if (this.elements.playText) this.elements.playText.textContent = 'Iniciar Flujo';
        }
    },

    // Mostrar banner de paso
    showStepBanner(step) {
        const { stepBanner, stepNum, stepTitle, stepDesc, stepAmount, stepAmountLabel } = this.elements;
        
        if (!stepBanner) return;

        if (stepNum) stepNum.textContent = step.num;
        if (stepTitle) stepTitle.textContent = step.title;
        if (stepDesc) stepDesc.textContent = step.description;
        if (stepAmount) stepAmount.textContent = step.amount;
        if (stepAmountLabel) stepAmountLabel.textContent = step.amountLabel;

        stepBanner.classList.add('visible');
    },

    // Ocultar banner de paso
    hideStepBanner() {
        if (this.elements.stepBanner) {
            this.elements.stepBanner.classList.remove('visible');
        }
    },

    // Resaltar actor
    highlightActor(actorId) {
        this.elements.actorCards.forEach(card => {
            if (card.dataset.actor === actorId) {
                card.classList.add('highlight');
                card.classList.remove('dim');
            } else {
                card.classList.add('dim');
                card.classList.remove('highlight');
            }
        });
    },

    // Limpiar resaltados de actores
    clearHighlights() {
        this.elements.actorCards.forEach(card => {
            card.classList.remove('highlight', 'dim');
        });
    },

    // Resaltar path
    highlightPath(index) {
        this.elements.flowPaths.forEach((path, i) => {
            path.classList.remove('highlight', 'dim', 'completed');
            
            if (i === index) {
                path.classList.add('highlight');
            } else if (i < index) {
                path.classList.add('completed');
            } else {
                path.classList.add('dim');
            }
        });
    },

    // Limpiar resaltados de paths
    clearPathHighlights() {
        this.elements.flowPaths.forEach(path => {
            path.classList.remove('highlight', 'dim', 'completed');
        });
    },

    // Mostrar label de flujo
    showFlowLabel(index) {
        const label = this.elements.flowLabels[index];
        if (label) {
            label.classList.add('visible');
        }
    },

    // Ocultar todos los labels de flujo
    hideAllFlowLabels() {
        this.elements.flowLabels.forEach(label => {
            label.classList.remove('visible');
        });
    },

    // Actualizar progreso
    updateProgress(stepIndex, totalSteps) {
        const percent = ((stepIndex + 1) / totalSteps) * 100;
        
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percent}%`;
        }

        this.elements.progressSteps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            
            if (i < stepIndex) {
                step.classList.add('completed');
            } else if (i === stepIndex) {
                step.classList.add('active');
            }
        });
    },

    // Resetear progreso
    resetProgress() {
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = '0%';
        }

        this.elements.progressSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
    },

    // Animar dot
    async animateDot(index) {
        const dot = document.getElementById(`dot${index + 1}`);
        if (!dot) return;

        dot.classList.add('active');
        
        const animateMotion = dot.querySelector('animateMotion');
        if (animateMotion) {
            animateMotion.beginElement();
        }

        const duration = this.config.dotDuration / AppState.getSpeed();
        await this.delay(duration);

        dot.classList.remove('active');
    },

    // Helper para delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Exportar para uso global
window.AnimationController = AnimationController;
