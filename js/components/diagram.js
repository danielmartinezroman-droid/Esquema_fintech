/* ============================================
   Diagram Component
   Renderiza el diagrama SVG y los actores
   ============================================ */

const DiagramComponent = {
    // Contenedor
    container: null,

    // Inicializar
    init() {
        this.container = document.getElementById('diagramArea');
        if (this.container) {
            this.render();
            this.bindEvents();
        }
        console.log('📊 DiagramComponent initialized');
    },

    // Renderizar diagrama completo
    render() {
        this.container.innerHTML = `
            <div class="diagram-container">
                ${this.renderSVG()}
                ${this.renderActors()}
                ${this.renderStepBanner()}
            </div>
        `;
    },

    // Renderizar SVG de conexiones
    renderSVG() {
        return `
            <svg class="connections-svg" viewBox="0 0 800 700" preserveAspectRatio="xMidYMid meet">
                <defs>
                    ${this.renderMarkers()}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                ${this.renderPaths()}
                ${this.renderFlowLabels()}
                ${this.renderDots()}
            </svg>
        `;
    },

    // Renderizar markers (flechas)
    renderMarkers() {
        return Object.entries(SVG_MARKERS).map(([id, config]) => `
            <marker id="${id}" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 L2,5 Z" fill="${config.color}"/>
            </marker>
        `).join('');
    },

    // Renderizar paths
    renderPaths() {
        return Object.entries(SVG_PATHS).map(([id, config]) => `
            <path id="${id}" 
                  class="flow-path ${config.type}" 
                  d="${config.d}" 
                  marker-end="url(#${config.marker})"/>
        `).join('');
    },

    // Renderizar labels de flujo
    renderFlowLabels() {
        const steps = FLOW_STEPS.authorization;
        const labelPositions = [
            { x: 340, y: 55, width: 120 },
            { x: 680, y: 280, width: 95 },
            { x: 500, y: 440, width: 100 },
            { x: 200, y: 440, width: 110 },
            { x: 200, y: 400, width: 120 },
            { x: 475, y: 400, width: 130 },
            { x: 540, y: 280, width: 90 }
        ];

        return steps.map((step, i) => {
            const pos = labelPositions[i];
            return `
                <g class="flow-label-group" data-step="${step.num}">
                    <rect class="flow-label-bg" 
                          x="${pos.x}" y="${pos.y}" 
                          width="${pos.width}" height="32" rx="6"/>
                    <text class="flow-label-text" 
                          x="${pos.x + pos.width/2}" y="${pos.y + 13}">
                        ${this.getStepIcon(step.num)} ${this.getShortTitle(step.title)}
                    </text>
                    <text class="flow-amount" 
                          x="${pos.x + pos.width/2}" y="${pos.y + 26}">
                        ${step.amount}
                    </text>
                </g>
            `;
        }).join('');
    },

    // Obtener icono de paso
    getStepIcon(num) {
        const icons = ['①', '②', '③', '④', '⑤', '⑥', '⑦'];
        return icons[num - 1] || num;
    },

    // Obtener título corto
    getShortTitle(title) {
        const shortTitles = {
            'Cliente paga al comercio': 'Paga',
            'Comercio informa al adquirente': 'Solicitud',
            'Adquirente enruta a la marca': 'Enruta',
            'La red contacta al emisor': 'Autoriza',
            'Emisor paga a la red': 'Paga a Red',
            'Red paga al adquirente': 'Paga a Acq',
            'Adquirente liquida al comercio': 'Liquida'
        };
        return shortTitles[title] || title.split(' ')[0];
    },

    // Renderizar dots animados
    renderDots() {
        const steps = FLOW_STEPS.authorization;
        return steps.map((step, i) => `
            <circle class="flow-dot" 
                    id="dot${i + 1}" 
                    r="7" 
                    fill="${step.dotColor}" 
                    filter="url(#glow)">
                <animateMotion dur="0.8s" fill="freeze" begin="indefinite">
                    <mpath href="#${step.pathId}"/>
                </animateMotion>
            </circle>
        `).join('');
    },

    // Renderizar actores
    renderActors() {
        return ACTOR_ORDER.map(actorId => {
            const actor = ACTORS[actorId];
            return this.renderActorCard(actor);
        }).join('');
    },

    // Renderizar tarjeta de actor
    renderActorCard(actor) {
        // Badge de MP (MP Operador / MP Emisor)
        const badgeHTML = actor.badge 
            ? `<span class="mp-badge ${actor.badge.type} visible">${actor.badge.text}</span>` 
            : '';

        // Logos de marcas (solo para network)
        const brandsHTML = actor.brands 
            ? `<div class="brand-logos">
                ${actor.brands.map(b => `
                    <div class="brand-logo ${b.class}">${b.name}</div>
                `).join('')}
               </div>` 
            : '';

        // Info tag (Interchange, MDR, etc.)
        const infoTagHTML = actor.infoTag
            ? `<div class="info-tag ${actor.infoTag.type}" title="${actor.infoTag.tooltip || ''}">
                    ${actor.infoTag.text}
               </div>`
            : '';

        return `
            <div class="actor-card" data-actor="${actor.id}">
                ${badgeHTML}
                <div class="actor-header">
                    <div class="actor-icon">${actor.icon}</div>
                    <div class="actor-info">
                        <h3>${actor.name}</h3>
                        <p>${actor.shortName}</p>
                    </div>
                </div>
                ${brandsHTML}
                ${infoTagHTML}
            </div>
        `;
    },

    // Renderizar banner de paso
    renderStepBanner() {
        return `
            <div class="step-banner" id="stepBanner">
                <div class="step-banner-num" id="stepNum">1</div>
                <div class="step-banner-content">
                    <h4 id="stepTitle">Paso</h4>
                    <p id="stepDesc">Descripción del paso</p>
                </div>
                <div class="step-banner-amount">
                    <div class="amount" id="stepAmount">$0</div>
                    <div class="label" id="stepAmountLabel">Monto</div>
                </div>
            </div>
        `;
    },

    // Bindear eventos
    bindEvents() {
        // Click en actores
        const actorCards = this.container.querySelectorAll('.actor-card');
        actorCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleActorClick(card);
            });
        });

        // Click fuera para deseleccionar
        this.container.addEventListener('click', (e) => {
            if (!e.target.closest('.actor-card')) {
                this.clearSelection();
            }
        });
    },

    // Manejar click en actor
    handleActorClick(card) {
        const actorId = card.dataset.actor;
        const currentSelected = AppState.getSelectedActor();

        if (currentSelected === actorId) {
            this.clearSelection();
        } else {
            this.selectActor(actorId);
        }
    },

    // Seleccionar actor
    selectActor(actorId) {
        AppState.set('selectedActor', actorId);

        const actorCards = this.container.querySelectorAll('.actor-card');
        actorCards.forEach(card => {
            card.classList.toggle('active', card.dataset.actor === actorId);
        });

        if (window.SidebarComponent) {
            SidebarComponent.showActorDetail(actorId);
        }
    },

    // Limpiar selección
    clearSelection() {
        AppState.set('selectedActor', null);

        const actorCards = this.container.querySelectorAll('.actor-card');
        actorCards.forEach(card => {
            card.classList.remove('active');
        });

        if (window.SidebarComponent) {
            SidebarComponent.showEmptyState();
        }
    }
};

// Exportar para uso global
window.DiagramComponent = DiagramComponent;
