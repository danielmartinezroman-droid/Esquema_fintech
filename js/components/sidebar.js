/* ============================================
   Sidebar Component
   Renderiza el panel lateral
   ============================================ */

const SidebarComponent = {
    container: null,

    init() {
        this.container = document.getElementById('sidebar');
        if (this.container) {
            this.render();
        }
        console.log('📋 SidebarComponent initialized');
    },

    render() {
        this.container.innerHTML = `
            ${this.renderAnimationControls()}
            ${this.renderFlowSpecificPanel()}
            ${this.renderDetailPanel()}
            ${this.renderFooterTip()}
        `;
    },

    renderAnimationControls() {
        const flowKey = window.CURRENT_FLOW?.stepsKey || 'authorization';
        const steps = FLOW_STEPS[flowKey] || [];
        
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

    renderFlowSpecificPanel() {
        const flowId = window.CURRENT_FLOW?.id || 'card-payment';
        
        switch (flowId) {
            case 'card-payment':
                return this.renderCardPaymentFees();
            case 'atm-withdrawal':
                return this.renderATMFees();
            case 'transfer':
                return this.renderTransferInfo();
            default:
                return '';
        }
    },

    renderCardPaymentFees() {
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

    renderATMFees() {
        const atmFees = window.ATM_FEES?.chile || {};
        
        return `
            <div class="panel-section">
                <div class="panel-header">
                    <span class="panel-title">Costos ATM (MP Emisor)</span>
                    <span class="panel-badge">Chile</span>
                </div>
                <div class="fee-breakdown">
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-cardholder)"></span>
                            Retiro ejemplo
                        </span>
                        <span class="value">$50,000</span>
                    </div>
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-network)"></span>
                            Costo trx Redgiro
                        </span>
                        <span class="value">0.00068 UF</span>
                    </div>
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-acquirer)"></span>
                            Tarifa Interbancaria
                        </span>
                        <span class="value">~0.0155 UF</span>
                    </div>
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-merchant)"></span>
                            Surcharge (banco ATM)
                        </span>
                        <span class="value">$0 - $1,500</span>
                    </div>
                    <div class="fee-row total">
                        <span class="label">Costo aprox MP/trx</span>
                        <span class="value">~$850</span>
                    </div>
                </div>
                <div class="fee-note">
                    <p>💡 <strong>Surcharge:</strong> Comisión que el banco dueño del ATM puede cobrar al cliente por usar un cajero "ajeno".</p>
                </div>
            </div>
        `;
    },

    renderTransferInfo() {
        return `
            <div class="panel-section">
                <div class="panel-header">
                    <span class="panel-title">Info Transferencia</span>
                </div>
                <div class="fee-breakdown">
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-issuer)"></span>
                            Monto enviado
                        </span>
                        <span class="value">$1,000</span>
                    </div>
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-network)"></span>
                            Cámara compensación
                        </span>
                        <span class="value">ACH/SPEI/TEF</span>
                    </div>
                    <div class="fee-row">
                        <span class="label">
                            <span class="dot" style="background: var(--color-acquirer)"></span>
                            Tiempo acreditación
                        </span>
                        <span class="value">Inmediato - 24h</span>
                    </div>
                    <div class="fee-row total">
                        <span class="label">Monto recibido</span>
                        <span class="value">$1,000</span>
                    </div>
                </div>
            </div>
        `;
    },

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

    renderFooterTip() {
        const flowId = window.CURRENT_FLOW?.id || 'card-payment';
        
        const tips = {
            'card-payment': '<strong>💡 Interco:</strong> Cuando MP Operador procesa un pago de una tarjeta MP Emisor, es una transacción "on-us" con fees internos diferenciados.',
            'atm-withdrawal': '<strong>💡 Not on Us:</strong> Cuando un cliente MP retira en cajero de otro banco, MP Emisor paga tarifas interbancarias. Si retira en cajero propio (on-us), el costo es menor.',
            'transfer': '<strong>💡 Tip:</strong> Las transferencias inmediatas usan sistemas como SPEI (México), Pix (Brasil) o TEF (Chile) para acreditar en segundos.'
        };

        return `
            <div class="footer-tip">
                <p>${tips[flowId] || ''}</p>
            </div>
        `;
    },

    showActorDetail(actorId) {
        // Usar getActor para obtener el actor correcto según el flujo
        const actor = window.getActor ? getActor(actorId) : ACTORS[actorId];
        if (!actor) return;

        const detailEmpty = document.getElementById('detailEmpty');
        const detailContent = document.getElementById('detailContent');

        if (detailEmpty) detailEmpty.style.display = 'none';
        
        if (detailContent) {
            detailContent.innerHTML = this.renderActorDetail(actor);
            detailContent.classList.add('active');
        }
    },

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

    renderActorFees(actor) {
        return `
            <div class="detail-section">
                <div class="detail-section-title">Fees / Costos</div>
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

    showEmptyState() {
        const detailEmpty = document.getElementById('detailEmpty');
        const detailContent = document.getElementById('detailContent');

        if (detailEmpty) detailEmpty.style.display = 'block';
        if (detailContent) {
            detailContent.innerHTML = '';
            detailContent.classList.remove('active');
        }
    }
};

window.SidebarComponent = SidebarComponent;
