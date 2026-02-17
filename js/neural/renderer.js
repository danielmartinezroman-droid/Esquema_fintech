/* ============================================
   NEURAL RENDERER
   Renderiza nodos, paths y UI
   ============================================ */

class NeuralRenderer {
    constructor(options = {}) {
        this.canvasArea = options.canvasArea || document.querySelector('.canvas-area');
        this.sidebar = options.sidebar || document.querySelector('.sidebar-panel');
        this.flowConfig = options.flowConfig || {};
        
        this.nodes = [];
        this.paths = [];
    }
    
    render() {
        if (!this.canvasArea) return;
        
        this.canvasArea.innerHTML = `
            <div class="neural-canvas">
                ${this.renderSVG()}
                <div class="impulse-container" id="impulseContainer"></div>
                ${this.renderNodes()}
            </div>
        `;
    }
    
    renderSVG() {
        const paths = this.flowConfig.paths || [];
        
        return `
            <svg class="neural-svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <!-- Gradientes -->
                    <linearGradient id="grad-data" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.3"/>
                        <stop offset="50%" stop-color="#60A5FA"/>
                        <stop offset="100%" stop-color="#60A5FA" stop-opacity="0.3"/>
                    </linearGradient>
                    <linearGradient id="grad-auth" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#4ADE80" stop-opacity="0.3"/>
                        <stop offset="50%" stop-color="#4ADE80"/>
                        <stop offset="100%" stop-color="#4ADE80" stop-opacity="0.3"/>
                    </linearGradient>
                    <linearGradient id="grad-money" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#FFE600" stop-opacity="0.3"/>
                        <stop offset="50%" stop-color="#FFE600"/>
                        <stop offset="100%" stop-color="#FFE600" stop-opacity="0.3"/>
                    </linearGradient>
                    <linearGradient id="grad-response" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#C084FC" stop-opacity="0.3"/>
                        <stop offset="50%" stop-color="#C084FC"/>
                        <stop offset="100%" stop-color="#C084FC" stop-opacity="0.3"/>
                    </linearGradient>
                    
                    <!-- Filtro glow -->
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Paths -->
                ${paths.map(p => `
                    <path id="${p.id}" 
                          class="neural-path type-${p.type}" 
                          d="${p.d}"
                          stroke="url(#grad-${p.type})"/>
                `).join('')}
            </svg>
        `;
    }
    
    renderNodes() {
        const nodes = this.flowConfig.nodes || [];
        
        return nodes.map(node => `
            <div class="neural-node ${node.class || ''}" 
                 data-node="${node.id}"
                 style="--node-color: ${node.color}; ${node.style || ''}">
                <div class="node-wrapper">
                    <div class="node-ring"></div>
                    <div class="node-core">
                        <div class="node-icon">${node.icon}</div>
                        <div class="node-info">
                            <h3>${node.name}</h3>
                            <p>${node.subtitle}</p>
                        </div>
                    </div>
                    ${node.badge ? `<span class="node-badge" style="background: ${node.badgeColor || node.color}">${node.badge}</span>` : ''}
                    <span class="node-tag">${node.tag || ''}</span>
                </div>
            </div>
        `).join('');
    }
    
    renderSidebar(flowConfig) {
        if (!this.sidebar) return;
        
        const steps = flowConfig.steps || [];
        const fees = flowConfig.fees || [];
        
        this.sidebar.innerHTML = `
            <!-- Control Panel -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">Simulación</span>
                    <span class="panel-badge">${steps.length} pasos</span>
                </div>
                
                <button class="play-btn" id="playBtn">
                    <span id="playIcon">▶</span>
                    <span id="playText">Iniciar Simulación</span>
                </button>
                
                <div class="speed-control">
                    <span class="speed-label">Velocidad:</span>
                    <div class="speed-options">
                        <button class="speed-btn" data-speed="0.5">0.5x</button>
                        <button class="speed-btn active" data-speed="1">1x</button>
                        <button class="speed-btn" data-speed="1.5">1.5x</button>
                        <button class="speed-btn" data-speed="2">2x</button>
                    </div>
                </div>
                
                <div class="step-progress" id="stepProgress">
                    ${steps.map((_, i) => `<div class="progress-dot" data-step="${i}"></div>`).join('')}
                </div>
            </div>
            
            <!-- Timeline -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">Pasos del flujo</span>
                </div>
                <div class="timeline-list" id="timeline">
                    ${steps.map((step, i) => `
                        <div class="timeline-item" data-step="${i}">
                            <div class="timeline-num">${i + 1}</div>
                            <div class="timeline-content">
                                <h4>${step.title}</h4>
                                <p>${step.subtitle}</p>
                            </div>
                            <span class="timeline-value">${step.amount || ''}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Fees -->
            ${fees.length > 0 ? `
                <div class="panel-card">
                    <div class="panel-header">
                        <span class="panel-title">${flowConfig.feesTitle || 'Costos'}</span>
                        ${flowConfig.feesBadge ? `<span class="panel-badge">${flowConfig.feesBadge}</span>` : ''}
                    </div>
                    <div class="fee-list">
                        ${fees.map(fee => `
                            <div class="fee-row ${fee.isTotal ? 'total' : ''}">
                                <span class="fee-label">
                                    ${fee.color ? `<span class="fee-dot" style="background: ${fee.color}"></span>` : ''}
                                    ${fee.label}
                                </span>
                                <span class="fee-value">${fee.value}</span>
                            </div>
                        `).join('')}
                    </div>
                    ${flowConfig.feesNote ? `<div class="info-note" style="margin-top: 12px;">${flowConfig.feesNote}</div>` : ''}
                </div>
            ` : ''}
            
            <!-- Legend -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">Leyenda</span>
                </div>
                <div class="legend-grid">
                    <div class="legend-item">
                        <div class="legend-line data"></div>
                        <span>Datos</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-line auth"></div>
                        <span>Autorización</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-line money"></div>
                        <span>Dinero</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-line response"></div>
                        <span>Respuesta</span>
                    </div>
                </div>
            </div>
            
            <!-- Footer Note -->
            ${flowConfig.footerNote ? `
                <div class="info-note">${flowConfig.footerNote}</div>
            ` : ''}
        `;
    }
    
    // Métodos de actualización de UI
    activateNode(nodeId) {
        const node = document.querySelector(`[data-node="${nodeId}"]`);
        if (node) {
            node.classList.add('active', 'pulsing');
        }
    }
    
    deactivateNode(nodeId) {
        const node = document.querySelector(`[data-node="${nodeId}"]`);
        if (node) {
            node.classList.remove('pulsing');
        }
    }
    
    deactivateAllNodes() {
        document.querySelectorAll('.neural-node').forEach(node => {
            node.classList.remove('active', 'pulsing');
        });
    }
    
    updateTimeline(stepIndex) {
        document.querySelectorAll('.timeline-item').forEach((item, i) => {
            item.classList.remove('active', 'completed');
            if (i < stepIndex) item.classList.add('completed');
            if (i === stepIndex) item.classList.add('active');
        });
    }
    
    updateProgress(stepIndex) {
        document.querySelectorAll('.progress-dot').forEach((dot, i) => {
            dot.classList.remove('active', 'completed');
            if (i < stepIndex) dot.classList.add('completed');
            if (i === stepIndex) dot.classList.add('active');
        });
    }
    
    resetUI() {
        this.deactivateAllNodes();
        
        document.querySelectorAll('.neural-path').forEach(path => {
            path.classList.remove('active', 'completed');
        });
        
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('active', 'completed');
        });
        
        document.querySelectorAll('.progress-dot').forEach(dot => {
            dot.classList.remove('active', 'completed');
        });
    }
}

// Exportar
window.NeuralRenderer = NeuralRenderer;
