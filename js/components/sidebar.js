/* ============================================
   Sidebar Component
   Renderiza el panel lateral
   ============================================ */

const SidebarComponent = {
    // Contenedor
    container: null,

    // Inicializar
    init() {
        this.container = document.getElementById('sidebar');
        if (this.container) {
            this.render();
        }
        console.log('📋 SidebarComponent initialized');
    },

    // Renderizar sidebar completo
    render() {
        this.container.innerHTML = `
            ${this.renderAnimationControls()}
            ${this.renderFeeBreakdown()}
            ${this.renderDetailPanel()}
            ${this.renderFooterTip()}
        `;
    },

    // Renderizar controles de animación
    renderAnimationControls() {
        const steps = FLOW_STEPS.authorization;
        
        return `
            <div class="panel-section">
                <div class="panel-header">
                    <span class="panel-title">Simulación</span>
                    <span class="panel-badge">${steps.length} Pasos</span>
                </div>
                
                <div class="anim-controls">
                    <button class="play-btn" id="playBtn">
                        <span id="playIcon">▶</span>
                        <span id="playText">Iniciar Flujo</span>
                    </button>
                    <button class="ctrl-btn" id="speedBtn" title="Velocidad">1x</button>
                </div>

                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-steps">
                        ${steps.map((step, i) => `
                            <div class="progress-step" data-step="${i + 1}">${i + 1}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Renderizar desglose de fees
    renderFeeBreakdown() {
        const fees = getCurrentFees();
        
        return `
            <div class="panel-section">
                <div class="panel-header">
                    <span class="panel-title">Desglose de Fees</span>
                </div>
                <div class="fee-breakdown">
                    ${fees.breakdown.map(fee => `
                        <div class="fee-row ${fee.isTotal ? 'total' : ''}">
                            <span class="label">
                                ${fee.color ? `<span class="dot" style="background: var(--color-${fee.color})"></span>` : ''}
                                ${fee.label}
                            </span>
                            <span class="value">${fee.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Renderizar panel de detalles
    renderDetailPanel() {
        return `
            <div class="panel-section detail-panel">
                <div class="panel-header">
                    <span class="panel-title">Detalle</span>
                </div>
                
                <div class="detail-empty" id="detailEmpty">
                    <div class="detail-empty-icon">👆</div>
                    <h3>Selecciona un actor</h3>
                    <p>Haz clic en cualquier participante del diagrama para ver su rol.</p>
                </div>

                <div id="detailContent"></div>
            </div>
        `;
    },

    // Renderizar footer tip
    renderFooterTip() {
        return `
            <div class="footer-tip">
                <p>
                    <strong>💡 Interco:</strong> Cuando MP Operador procesa un pago de una tarjeta MP Emisor, 
                    es una transacción "on-us" con fees internos diferenciados.
                </p>
            </div>
        `;
    },

    // Mostrar detalle de actor
    showActorDetail(actorId) {
        const actor = ACTORS[actorId];
        if (!actor) return;

        const detailEmpty = document.getElementById('detailEmpty');
        const detailContent = document.getElementById('detailContent');

        if (detailEmpty) detailEmpty.style.display = 'none';
        
        if (detailContent) {
            detailContent.innerHTML = this.renderActorDetail(actor);
            detailContent.classList.add('active');
        }
    },

    // Renderizar detalle de actor
    renderActorDetail(actor) {
        return `
            <div class="detail-content active">
                <div class="detail-header">
                    <div class="detail-icon" style="background: var(--color-${actor.color}-light);">
                        ${actor.icon}
                    </div>
                    <div class="detail-info">
                        <h3>${actor.name}</h3>
                        <p>${actor.badge ? actor.badge.text : actor.shortName}</p>
                    </div>
                </div>

                <div class="detail-section">
                    <div class="detail-section-title">Descripción</div>
                    <p class="detail-text">${actor.description}</p>
                </div>

                <div class="detail-section">
                    <div class="detail-section-title">En el flujo</div>
                    <div class="detail-list">
                        ${actor.actions.map(action => `
                            <div class="detail-item">
                                <div class="detail-item-icon" style="background: var(--color-${actor.color}-light);">
                                    ${action.icon}
                                </div>
                                <div class="detail-item-text">
                                    <h4>${action.title}</h4>
                                    <p>${action.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${actor.fees ? this.renderActorFees(actor) : ''}
                ${actor.metrics ? this.renderActorMetrics(actor) : ''}
                ${actor.hasInterco ? this.renderIntercoIndicator() : ''}
            </div>
        `;
    },

    // Renderizar fees del actor
    renderActorFees(actor) {
        return `
            <div class="detail-section">
                <div class="detail-section-title">Fees</div>
                <div class="detail-list">
                    ${actor.fees.map(fee => `
                        <div class="detail-item">
                            <div class="detail-item-icon" style="background: var(--color-${actor.color}-light);">
                                💰
                            </div>
                            <div class="detail-item-text">
                                <h4>${fee.label}</h4>
                                <p>${fee.value}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Renderizar métricas del actor
    renderActorMetrics(actor) {
        return `
            <div class="detail-section">
                <div class="detail-section-title">Métricas típicas</div>
                <div class="detail-list">
                    ${actor.metrics.map(metric => `
                        <div class="detail-item">
                            <div class="detail-item-icon" style="background: var(--color-${actor.color}-light);">
                                📊
                            </div>
                            <div class="detail-item-text">
                                <h4>${metric.label}</h4>
                                <p>${metric.value}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Renderizar indicador de Interco
    renderIntercoIndicator() {
        return `
            <div class="interco-indicator">
                <div class="icon">🔄</div>
                <div class="text">
                    <h4>Transacción Interco</h4>
                    <p>Cuando ambos lados son Mercado Pago</p>
                </div>
            </div>
        `;
    },

    // Mostrar estado vacío
    showEmptyState() {
        const detailEmpty = document.getElementById('detailEmpty');
        const detailContent = document.getElementById('detailContent');

        if (detailEmpty) detailEmpty.style.display = 'block';
        if (detailContent) {
            detailContent.innerHTML = '';
            detailContent.classList.remove('active');
        }
    },

    // Actualizar fees (cuando cambia el país)
    updateFees() {
        const feesContainer = this.container.querySelector('.fee-breakdown');
        if (feesContainer) {
            const fees = getCurrentFees();
            feesContainer.innerHTML = fees.breakdown.map(fee => `
                <div class="fee-row ${fee.isTotal ? 'total' : ''}">
                    <span class="label">
                        ${fee.color ? `<span class="dot" style="background: var(--color-${fee.color})"></span>` : ''}
                        ${fee.label}
                    </span>
                    <span class="value">${fee.value}</span>
                </div>
            `).join('');
        }
    }
};

// Exportar para uso global
window.SidebarComponent = SidebarComponent;
