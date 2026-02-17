/* ============================================
   NEURAL APP
   Aplicación principal del flujo neural
   ============================================ */

class NeuralApp {
    constructor(flowId) {
        this.flowId = flowId;
        this.config = FLOW_CONFIGS[flowId];
        
        if (!this.config) {
            console.error(`Flow config not found: ${flowId}`);
            return;
        }
        
        this.background = null;
        this.renderer = null;
        this.simulation = null;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log(`🧠 Initializing Neural App: ${this.config.name}`);
        
        // Inicializar background
        this.background = new NeuralBackground('neuralBg');
        
        // Inicializar renderer
        this.renderer = new NeuralRenderer({
            canvasArea: document.querySelector('.canvas-area'),
            sidebar: document.querySelector('.sidebar-panel'),
            flowConfig: this.config
        });
        
        // Renderizar UI
        this.renderer.render();
        this.renderer.renderSidebar(this.config);
        
        // Inicializar simulación
        this.simulation = new NeuralSimulation({
            canvas: document.querySelector('.neural-svg'),
            impulseContainer: document.getElementById('impulseContainer'),
            steps: this.config.steps,
            onStepStart: (step, index) => this.onStepStart(step, index),
            onStepComplete: (step, index) => this.onStepComplete(step, index),
            onSimulationComplete: () => this.onSimulationComplete(),
            onReset: () => this.onReset()
        });
        
        // Bindear eventos
        this.bindEvents();
        
        console.log('✅ Neural App ready');
    }
    
    bindEvents() {
        // Play button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        // Speed buttons
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.setSpeed(speed);
            });
        });
        
        // Node clicks
        document.querySelectorAll('.neural-node').forEach(node => {
            node.addEventListener('click', () => {
                const nodeId = node.dataset.node;
                this.onNodeClick(nodeId);
            });
        });
        
        // Timeline clicks
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => {
                const step = parseInt(item.dataset.step);
                this.goToStep(step);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
            if (e.key === 'Escape') {
                this.reset();
            }
        });
        
        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    async play() {
        this.isPlaying = true;
        this.updatePlayButton(true);
        await this.simulation.play();
    }
    
    pause() {
        this.simulation.pause();
        this.updatePlayButton(false);
        this.isPlaying = false;
    }
    
    reset() {
        this.isPlaying = false;
        this.simulation.reset();
        this.renderer.resetUI();
        this.updatePlayButton(false);
    }
    
    setSpeed(speed) {
        this.simulation.setSpeed(speed);
        
        // Update UI
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
        });
    }
    
    goToStep(stepIndex) {
        // Por ahora solo resalta el paso en la UI
        this.renderer.updateTimeline(stepIndex);
        this.renderer.updateProgress(stepIndex);
    }
    
    onNodeClick(nodeId) {
        // Toggle active state
        const node = document.querySelector(`[data-node="${nodeId}"]`);
        const wasActive = node.classList.contains('active');
        
        // Deactivate all nodes first
        this.renderer.deactivateAllNodes();
        
        // If wasn't active, activate it
        if (!wasActive) {
            this.renderer.activateNode(nodeId);
        }
    }
    
    // Callbacks de simulación
    onStepStart(step, index) {
        // Activar nodos del paso
        step.nodes.forEach(nodeId => {
            this.renderer.activateNode(nodeId);
        });
        
        // Actualizar timeline
        this.renderer.updateTimeline(index);
        this.renderer.updateProgress(index);
    }
    
    onStepComplete(step, index) {
        // Desactivar pulsing de nodos
        step.nodes.forEach(nodeId => {
            this.renderer.deactivateNode(nodeId);
        });
    }
    
    onSimulationComplete() {
        this.isPlaying = false;
        this.updatePlayButton(false);
        
        // Pequeño delay y luego reset
        setTimeout(() => {
            this.renderer.resetUI();
            this.simulation.clearPaths();
        }, 2000);
    }
    
    onReset() {
        this.renderer.resetUI();
    }
    
    updatePlayButton(isPlaying) {
        const playBtn = document.getElementById('playBtn');
        const playIcon = document.getElementById('playIcon');
        const playText = document.getElementById('playText');
        
        if (playBtn) {
            playBtn.classList.toggle('playing', isPlaying);
        }
        if (playIcon) {
            playIcon.textContent = isPlaying ? '⏸' : '▶';
        }
        if (playText) {
            playText.textContent = isPlaying ? 'Pausar' : 'Iniciar Simulación';
        }
    }
    
    destroy() {
        if (this.background) {
            this.background.destroy();
        }
        if (this.simulation) {
            this.simulation.stop();
        }
    }
}

// Exportar
window.NeuralApp = NeuralApp;
