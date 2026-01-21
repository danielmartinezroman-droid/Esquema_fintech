/* ============================================
   Header Component
   Renderiza el header de la aplicación
   ============================================ */

const HeaderComponent = {
    container: null,

    init() {
        this.container = document.getElementById('header');
        if (this.container) {
            this.render();
            this.bindEvents();
        }
        console.log('📌 HeaderComponent initialized');
    },

    render() {
        const flow = window.CURRENT_FLOW || { name: 'Flujo', description: '' };
        
        this.container.innerHTML = `
            <!-- Back + Logo Section -->
            <div class="logo-section">
                <a href="../index.html" class="back-btn" title="Volver al menú">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </a>
                <div class="logo-divider"></div>
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                              stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="logo-text">
                    <h1>${flow.name}</h1>
                    <span>${flow.description}</span>
                </div>
            </div>

            <!-- View Toggle (solo para card-payment) -->
            ${flow.id === 'card-payment' ? this.renderViewToggle() : ''}

            <!-- Header Actions -->
            <div class="header-actions">
                <button class="btn" id="resetBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    Reset
                </button>
            </div>
        `;
    },

    renderViewToggle() {
        return `
            <div class="view-toggle">
                <button class="view-btn active" data-view="full">
                    <span class="dot"></span>
                    Flujo Completo
                </button>
                <button class="view-btn" data-view="acquirer">
                    <span class="dot"></span>
                    MP Operador
                </button>
                <button class="view-btn" data-view="issuer">
                    <span class="dot"></span>
                    MP Emisor
                </button>
                <button class="view-btn" data-view="interco">
                    <span class="dot"></span>
                    Interco
                </button>
            </div>
        `;
    },

    bindEvents() {
        // View toggle buttons
        const viewBtns = this.container.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleViewChange(btn, viewBtns);
            });
        });

        // Reset button
        const resetBtn = this.container.querySelector('#resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.handleReset();
            });
        }
    },

    handleViewChange(clickedBtn, allBtns) {
        allBtns.forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');

        const view = clickedBtn.dataset.view;
        AppState.set('currentView', view);
        this.updateMPHighlights(view);
    },

    updateMPHighlights(view) {
        const actorCards = document.querySelectorAll('.actor-card');
        
        actorCards.forEach(card => {
            card.classList.remove('mp-highlight');
        });

        const acquirerCard = document.querySelector('[data-actor="acquirer"]');
        const issuerCard = document.querySelector('[data-actor="issuer"]');

        switch(view) {
            case 'acquirer':
                if (acquirerCard) acquirerCard.classList.add('mp-highlight');
                break;
            case 'issuer':
                if (issuerCard) issuerCard.classList.add('mp-highlight');
                break;
            case 'interco':
                if (acquirerCard) acquirerCard.classList.add('mp-highlight');
                if (issuerCard) issuerCard.classList.add('mp-highlight');
                break;
        }
    },

    handleReset() {
        if (window.AnimationController) {
            AnimationController.stop();
        }

        AppState.reset();

        const viewBtns = this.container.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === 'full');
        });

        if (window.DiagramComponent) {
            DiagramComponent.clearSelection();
        }

        this.updateMPHighlights('full');

        console.log('🔄 App reset');
    }
};

window.HeaderComponent = HeaderComponent;
