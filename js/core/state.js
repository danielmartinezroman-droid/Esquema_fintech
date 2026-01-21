/* ============================================
   State Management
   Manejo del estado global de la aplicación
   ============================================ */

const AppState = {
    // Estado actual
    _state: {
        selectedActor: null,
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        speed: 1,
        currentView: 'full', // full, acquirer, issuer, interco
        currentCountry: 'default'
    },

    // Listeners para cambios de estado
    _listeners: [],

    // Obtener estado
    get(key) {
        return key ? this._state[key] : { ...this._state };
    },

    // Actualizar estado
    set(key, value) {
        const oldValue = this._state[key];
        this._state[key] = value;
        
        // Notificar a los listeners
        this._notifyListeners(key, value, oldValue);
        
        return this;
    },

    // Actualizar múltiples valores
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    },

    // Resetear estado
    reset() {
        this._state = {
            selectedActor: null,
            isPlaying: false,
            isPaused: false,
            currentStep: 0,
            speed: 1,
            currentView: 'full',
            currentCountry: 'default'
        };
        this._notifyListeners('reset', null, null);
        return this;
    },

    // Suscribirse a cambios
    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    },

    // Notificar a los listeners
    _notifyListeners(key, newValue, oldValue) {
        this._listeners.forEach(listener => {
            try {
                listener(key, newValue, oldValue, this._state);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    },

    // Helpers para animación
    isPlaying() {
        return this._state.isPlaying;
    },

    isPaused() {
        return this._state.isPaused;
    },

    getSpeed() {
        return this._state.speed;
    },

    getCurrentStep() {
        return this._state.currentStep;
    },

    // Helpers para selección
    getSelectedActor() {
        return this._state.selectedActor;
    },

    hasSelection() {
        return this._state.selectedActor !== null;
    },

    // Helpers para vista
    getCurrentView() {
        return this._state.currentView;
    },

    isViewActive(view) {
        return this._state.currentView === view;
    }
};

// Congelar el objeto para prevenir modificaciones accidentales
Object.freeze(AppState);

// Exportar para uso global
window.AppState = AppState;

// Log inicial
console.log('🟡 AppState initialized');
