/* ============================================
   NEURAL SIMULATION
   Control de la simulación de flujos
   ============================================ */

class NeuralSimulation {
    constructor(options = {}) {
        this.canvas = options.canvas || document.querySelector('.neural-svg');
        this.impulseContainer = options.impulseContainer || document.getElementById('impulseContainer');
        this.steps = options.steps || [];
        this.speed = 1;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = -1;
        
        this.callbacks = {
            onStepStart: options.onStepStart || (() => {}),
            onStepComplete: options.onStepComplete || (() => {}),
            onSimulationComplete: options.onSimulationComplete || (() => {}),
            onReset: options.onReset || (() => {})
        };
        
        this.impulses = [];
        this.animationFrameId = null;
    }
    
    setSteps(steps) {
        this.steps = steps;
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    async play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.isPaused = false;
        
        for (let i = 0; i < this.steps.length; i++) {
            if (!this.isPlaying) break;
            
            while (this.isPaused) {
                await this.delay(100);
                if (!this.isPlaying) break;
            }
            
            if (!this.isPlaying) break;
            
            this.currentStep = i;
            this.callbacks.onStepStart(this.steps[i], i);
            
            await this.animateStep(this.steps[i]);
            
            this.callbacks.onStepComplete(this.steps[i], i);
            
            await this.delay(300 / this.speed);
        }
        
        if (this.isPlaying) {
            await this.delay(1000);
            this.callbacks.onSimulationComplete();
        }
        
        this.stop();
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = -1;
        this.clearImpulses();
    }
    
    reset() {
        this.stop();
        this.callbacks.onReset();
    }
    
    async animateStep(step) {
        const path = document.getElementById(step.pathId);
        if (!path) return;
        
        // Activar el path
        path.classList.add('active');
        
        // Crear y animar impulsos
        await this.createImpulses(path, step.type, step.impulseCount || 5);
        
        // Desactivar el path (mantener como completed)
        path.classList.remove('active');
        path.classList.add('completed');
    }
    
    async createImpulses(path, type, count = 5) {
        const pathLength = path.getTotalLength();
        const impulses = [];
        
        // Crear impulsos con delay entre ellos
        for (let i = 0; i < count; i++) {
            const impulse = document.createElement('div');
            impulse.className = `neural-impulse type-${type}`;
            this.impulseContainer.appendChild(impulse);
            
            impulses.push({
                element: impulse,
                progress: -i * 0.12, // Offset inicial
                speed: 0.8 + Math.random() * 0.4 // Variación de velocidad
            });
            
            this.impulses.push(impulse);
        }
        
        // Animar impulsos
        return new Promise(resolve => {
            const duration = 1200 / this.speed;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const baseProgress = elapsed / duration;
                
                let allComplete = true;
                
                impulses.forEach(imp => {
                    const progress = Math.max(0, Math.min(1, (baseProgress + imp.progress) * imp.speed));
                    
                    if (progress < 1) {
                        allComplete = false;
                    }
                    
                    try {
                        const point = path.getPointAtLength(progress * pathLength);
                        const svgRect = this.canvas.getBoundingClientRect();
                        const viewBox = this.canvas.viewBox.baseVal;
                        
                        // Convertir coordenadas SVG a coordenadas de pantalla
                        const scaleX = svgRect.width / viewBox.width;
                        const scaleY = svgRect.height / viewBox.height;
                        
                        imp.element.style.left = `${point.x * scaleX}px`;
                        imp.element.style.top = `${point.y * scaleY}px`;
                        imp.element.style.opacity = progress > 0 && progress < 0.95 ? 1 : 0;
                    } catch (e) {
                        // Path might not be valid
                    }
                });
                
                if (baseProgress < 1.5 && this.isPlaying) {
                    requestAnimationFrame(animate);
                } else {
                    // Limpiar impulsos de este paso
                    impulses.forEach(imp => {
                        imp.element.style.opacity = 0;
                        setTimeout(() => imp.element.remove(), 200);
                    });
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    clearImpulses() {
        this.impulses.forEach(imp => {
            if (imp && imp.parentNode) {
                imp.remove();
            }
        });
        this.impulses = [];
        
        if (this.impulseContainer) {
            this.impulseContainer.innerHTML = '';
        }
    }
    
    clearPaths() {
        document.querySelectorAll('.neural-path').forEach(path => {
            path.classList.remove('active', 'completed');
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Exportar
window.NeuralSimulation = NeuralSimulation;
