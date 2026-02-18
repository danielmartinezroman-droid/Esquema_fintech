/* ============================================
   NEURAL RENDERER
   Renderiza nodos, paths y UI
   ============================================ */

class NeuralRenderer {
    constructor(options = {}) {
        this.canvasArea = options.canvasArea || document.querySelector('.canvas-area');
        this.sidebar = options.sidebar || document.querySelector('.sidebar-panel');
        this.flowConfig = options.flowConfig || {};
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

        // El SVG NO usa viewBox — coordenadas en píxeles reales del canvas
        return `
            <svg class="neural-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradientes -->
                    <linearGradient id="grad-data" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.2"/>
                        <stop offset="50%" stop-color="#60A5FA"/>
                        <stop offset="100%" stop-color="#60A5FA" stop-opacity="0.2"/>
                    </linearGradient>
                    <linearGradient id="grad-auth" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#4ADE80" stop-opacity="0.2"/>
                        <stop offset="50%" stop-color="#4ADE80"/>
                        <stop offset="100%" stop-color="#4ADE80" stop-opacity="0.2"/>
                    </linearGradient>
                    <linearGradient id="grad-money" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#FFE600" stop-opacity="0.2"/>
                        <stop offset="50%" stop-color="#FFE600"/>
                        <stop offset="100%" stop-color="#FFE600" stop-opacity="0.2"/>
                    </linearGradient>
                    <linearGradient id="grad-response" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#C084FC" stop-opacity="0.2"/>
                        <stop offset="50%" stop-color="#C084FC"/>
                        <stop offset="100%" stop-color="#C084FC" stop-opacity="0.2"/>
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

                <!-- Paths — d="" se calculará dinámicamente con updatePaths() -->
                ${paths.map(p => `
                    <path id="${p.id}"
                          class="neural-path type-${p.type}"
                          d=""
                          stroke="url(#grad-${p.type})"/>
                `).join('')}
            </svg>
        `;
    }

    // ─── Calcula los paths SVG basándose en la posición real de los nodos ───
    updatePaths(flowConfig) {
        const paths = (flowConfig || this.flowConfig).paths || [];
        const canvasEl = this.canvasArea ? this.canvasArea.querySelector('.neural-canvas') : null;
        if (!canvasEl) return;

        const canvasRect = canvasEl.getBoundingClientRect();
        if (canvasRect.width === 0) return; // Layout aún no está listo

        paths.forEach(pathConfig => {
            const pathEl = document.getElementById(pathConfig.id);
            if (!pathEl) return;

            const fromNode = document.querySelector(`[data-node="${pathConfig.from}"]`);
            const toNode   = document.querySelector(`[data-node="${pathConfig.to}"]`);
            if (!fromNode || !toNode) return;

            const fromRect = fromNode.getBoundingClientRect();
            const toRect   = toNode.getBoundingClientRect();
            const { sx, sy, ex, ey } = this._getEdgePoints(fromRect, toRect, canvasRect);

            pathEl.setAttribute('d', this._getCurvedPath(sx, sy, ex, ey));
        });
    }

    _getEdgePoints(fromRect, toRect, canvasRect) {
        const fx = fromRect.left + fromRect.width  / 2 - canvasRect.left;
        const fy = fromRect.top  + fromRect.height / 2 - canvasRect.top;
        const tx = toRect.left   + toRect.width    / 2 - canvasRect.left;
        const ty = toRect.top    + toRect.height   / 2 - canvasRect.top;

        const dx  = tx - fx;
        const dy  = ty - fy;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);

        let sx, sy, ex, ey;

        if (adx > ady * 1.3) {
            // Predominantemente horizontal
            if (dx > 0) {
                sx = fromRect.right  - canvasRect.left; sy = fy;
                ex = toRect.left     - canvasRect.left; ey = ty;
            } else {
                sx = fromRect.left   - canvasRect.left; sy = fy;
                ex = toRect.right    - canvasRect.left; ey = ty;
            }
        } else if (ady > adx * 1.3) {
            // Predominantemente vertical
            if (dy > 0) {
                sx = fx; sy = fromRect.bottom - canvasRect.top;
                ex = tx; ey = toRect.top      - canvasRect.top;
            } else {
                sx = fx; sy = fromRect.top    - canvasRect.top;
                ex = tx; ey = toRect.bottom   - canvasRect.top;
            }
        } else {
            // Diagonal — salir / entrar por las esquinas más próximas
            if (dx > 0 && dy > 0) {
                sx = fromRect.right  - canvasRect.left; sy = fromRect.bottom - canvasRect.top;
                ex = toRect.left     - canvasRect.left; ey = toRect.top      - canvasRect.top;
            } else if (dx > 0) {
                sx = fromRect.right  - canvasRect.left; sy = fromRect.top    - canvasRect.top;
                ex = toRect.left     - canvasRect.left; ey = toRect.bottom   - canvasRect.top;
            } else if (dy > 0) {
                sx = fromRect.left   - canvasRect.left; sy = fromRect.bottom - canvasRect.top;
                ex = toRect.right    - canvasRect.left; ey = toRect.top      - canvasRect.top;
            } else {
                sx = fromRect.left   - canvasRect.left; sy = fromRect.top    - canvasRect.top;
                ex = toRect.right    - canvasRect.left; ey = toRect.bottom   - canvasRect.top;
            }
        }

        return { sx, sy, ex, ey };
    }

    _getCurvedPath(x1, y1, x2, y2) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        // Punto de control perpendicular a la línea (curvatura suave)
        const cx = mx - (y2 - y1) * 0.25;
        const cy = my + (x2 - x1) * 0.25;
        return `M ${Math.round(x1)} ${Math.round(y1)} Q ${Math.round(cx)} ${Math.round(cy)} ${Math.round(x2)} ${Math.round(y2)}`;
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
