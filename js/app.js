/* ============================================
   App Initialization
   Punto de entrada principal de la aplicación
   ============================================ */

const App = {
    // Versión
    version: '1.0.0',

    // Inicializar aplicación
    init() {
        console.log(`🚀 Initializing Modelo 4 Partes v${this.version}`);
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bootstrap());
        } else {
            this.bootstrap();
        }
    },

    // Bootstrap de componentes
    bootstrap() {
        try {
            // 1. Inicializar componentes UI
            this.initComponents();

            // 2. Inicializar controladores
            this.initControllers();

            // 3. Configurar listeners globales
            this.setupGlobalListeners();

            // 4. Log de éxito
            this.logReady();

        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    },

    // Inicializar componentes UI
    initComponents() {
        // Header
        if (window.HeaderComponent) {
            HeaderComponent.init();
        }

        // Diagrama
        if (window.DiagramComponent) {
            DiagramComponent.init();
        }

        // Sidebar
        if (window.SidebarComponent) {
            SidebarComponent.init();
        }
    },

    // Inicializar controladores
    initControllers() {
        // Animación
        if (window.AnimationController) {
            AnimationController.init();
        }
    },

    // Configurar listeners globales
    setupGlobalListeners() {
        // Escuchar cambios de estado
        AppState.subscribe((key, newValue, oldValue, state) => {
            this.handleStateChange(key, newValue, oldValue, state);
        });

        // Prevenir scroll con espacio
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
            }
        });

        // Responsive: cerrar sidebar en mobile al seleccionar
        if (window.innerWidth < 1024) {
            AppState.subscribe((key) => {
                if (key === 'selectedActor') {
                    // Scroll al sidebar en mobile
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    },

    // Manejar cambios de estado
    handleStateChange(key, newValue, oldValue, state) {
        switch (key) {
            case 'currentView':
                console.log(`👁️ View changed: ${oldValue} → ${newValue}`);
                break;
            
            case 'selectedActor':
                if (newValue) {
                    console.log(`🎯 Actor selected: ${newValue}`);
                } else {
                    console.log(`🎯 Selection cleared`);
                }
                break;
            
            case 'isPlaying':
                console.log(`🎬 Animation ${newValue ? 'started' : 'stopped'}`);
                break;
            
            case 'currentStep':
                // Silent - too noisy
                break;
            
            case 'reset':
                console.log('🔄 State reset');
                break;
        }
    },

    // Log de aplicación lista
    logReady() {
        console.log('');
        console.log('%c✅ Modelo 4 Partes Ready!', 'color: #00A650; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFE600;');
        console.log('%c🎹 Shortcuts:', 'font-weight: bold;');
        console.log('   SPACE  → Play/Pause animation');
        console.log('   ESC    → Stop & Reset');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFE600;');
        console.log('');
    }
};

// Iniciar aplicación
App.init();

// Exportar para uso global
window.App = App;
