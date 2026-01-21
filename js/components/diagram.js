/* ============================================
   Diagram Component
   Renderiza el diagrama SVG y los actores
   ============================================ */

const DiagramComponent = {
    container: null,

    init() {
        this.container = document.getElementById('diagramArea');
        if (this.container) {
            this.render();
            this.bindEvents();
        }
        console.log('📊 DiagramComponent initialized');
    },

    render() {
        this.container.innerHTML = `
            <div class="diagram-container">
                ${this.renderSVG()}
                ${this.renderActors()}
                ${this.renderStepBanner()}
            </div>
        `;
    },

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

    renderMarkers() {
        return Object.entries(SVG_MARKERS).map(([id, config]) => `
            <marker id="${id}" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 L2,5 Z" fill="${config.color}"/>
            </marker>
        `).join('');
    },

    renderPaths() {
        return Object.entries(SVG_PATHS).map(([id, config]) => `
            <path id="${id}" 
                  class="flow-path ${config.type}" 
                  d="${config.d}" 
                  marker-end="url(#${config.marker})"/>
        `).join('');
    },

    renderFlowLabels() {
        const flowKey = window.CURRENT_FLOW?.stepsKey || 'authorization';
        const steps = FLOW_STEPS[flowKey] || [];
        const positions = window.LABEL_POSITIONS || [];

        return steps.map((step, i) => {
            const pos = positions[i] || { x: 400, y: 350, width: 100 };
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

    getStepIcon(num) {
        const icons = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];
        return icons[num - 1] || num;
    },

    getShortTitle(title) {
        // Devuelve la primera palabra o primeras 10 letras
        const words = title.split(' ');
        if (words[0].length <= 10) return words[0];
        return title.substring(0, 10) + '...';
    },

    renderDots() {
        const flowKey = window.CURRENT_FLOW?.stepsKey || 'authorization';
        const steps = FLOW_STEPS[flowKey] || [];
        
        return steps.map((step, i) => `
            <circle class="flow-dot" 
                    id="dot${i + 1}" 
                    r="7" 
                    fill="${step.dotColor}" 
                    filter="url(#glow)">
                <animateMotion dur="0.8s" fill="freeze" begin="indefinite">
                    <mpath href="#path${i + 1}"/>
                </animateMotion>
            </circle>
        `).join('');
    },

    renderActors() {
        const actorIds = getFlowActors();
        return actorIds.map(actorId => {
            const actor = ACTORS[actorId];
            if (!actor) return '';
            return this.renderActorCard(actor, actorId);
        }).join('');
    },

    renderActorCard(actor, actorId) {
        const position = getActorPosition(actorId);
        const positionStyle = Object.entries(position)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');

        const badgeHTML = actor.badge 
            ? `<span class="mp-badge ${actor.badge.type} visible">${actor.badge.text}</span>` 
            : '';

        const brandsHTML = actor.brands 
            ? `<div class="brand-logos">
                ${actor.brands.map(b => `
                    <div class="brand-logo ${b.class}">${b.name}</div>
                `).join('')}
               </div>` 
            : '';

        const infoTagHTML = actor.infoTag
            ? `<div class="info-tag ${actor.infoTag.type}" title="${actor.infoTag.tooltip || ''}">
                    ${actor.infoTag.text}
               </div>`
            : '';

        return `
            <div class="actor-card" data-actor="${actorId}" style="${positionStyle}">
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

    bindEvents() {
        const actorCards = this.container.querySelectorAll('.actor-card');
        actorCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleActorClick(card);
            });
        });

        this.container.addEventListener('click', (e) => {
            if (!e.target.closest('.actor-card')) {
                this.clearSelection();
            }
        });
    },

    handleActorClick(card) {
        const actorId = card.dataset.actor;
        const currentSelected = AppState.getSelectedActor();

        if (currentSelected === actorId) {
            this.clearSelection();
        } else {
            this.selectActor(actorId);
        }
    },

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

window.DiagramComponent = DiagramComponent;
