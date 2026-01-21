/* ============================================
   Header Component
   Renderiza el header de la aplicación
   ============================================ */

const HeaderComponent = {
    // Contenedor
    container: null,

    // Inicializar
    init() {
        this.container = document.getElementById('header');
        if (this.container) {
            this.render();
            this.bindEvents();
        }
        console.log('📌 HeaderComponent initialized');
    },

    // Renderizar header
    render() {
        this.container.innerHTML = `
            <!-- Logo Section -->
            <div class="logo-section">
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                              stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="logo-text">
                    <h1>Modelo de 4 Partes</h1>
                    <span>Ecosistema de Pagos con Tarjeta</span>
                </div>
            </div>

            <!-- View Toggle -->
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

    // Bindear eventos
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

    // Manejar cambio de vista
    handleViewChange(clickedBtn, allBtns) {
        // Actualizar clases
        allBtns.forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');

        // Actualizar estado
        const view = clickedBtn.dataset.view;
        AppState.set('currentView', view);

        // Actualizar highlights de MP
        this.updateMPHighlights(view);
    },

    // Actualizar highlights de MP según vista
    updateMPHighlights(view) {
        const actorCards = document.querySelectorAll('.actor-card');
        
        // Limpiar todos los highlights
        actorCards.forEach(card => {
            card.classList.remove('mp-highlight');
        });

        // Aplicar según vista
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

    // Manejar reset
    handleReset() {
        // Detener animación
        if (window.AnimationController) {
            AnimationController.stop();
        }

        // Resetear estado
        AppState.reset();

        // Resetear vista a "full"
        const viewBtns = this.container.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === 'full');
        });

        // Limpiar selección de actores
        if (window.DiagramComponent) {
            DiagramComponent.clearSelection();
        }

        // Limpiar highlights
        this.updateMPHighlights('full');

        console.log('🔄 App reset');
    }
};

// Exportar para uso global
window.HeaderComponent = HeaderComponent;
