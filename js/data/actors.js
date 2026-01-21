/* ============================================
   Actors Data
   Definición de los actores del modelo 4 partes
   ============================================ */

const ACTORS = {
    cardholder: {
        id: 'cardholder',
        name: 'Tarjetahabiente',
        shortName: 'Cliente',
        icon: '👤',
        description: 'Cliente que tiene una tarjeta de crédito o débito emitida por un banco bajo una marca de la red (Visa, MC, Amex).',
        color: 'cardholder',
        position: { top: '0', left: '8%' },
        badge: null,
        actions: [
            {
                icon: '💳',
                title: 'Presenta credenciales',
                description: 'Tarjeta física, digital o token'
            },
            {
                icon: '🔐',
                title: 'Autentica (si aplica)',
                description: '3DS, PIN, biometría'
            },
            {
                icon: '✅',
                title: 'Recibe confirmación',
                description: 'Aprobación o rechazo'
            }
        ]
    },

    merchant: {
        id: 'merchant',
        name: 'Comercio',
        shortName: 'Comercio',
        icon: '🏪',
        description: 'Negocio que acepta pagos con tarjeta. Informa al adquirente sobre el intento de pago y recibe la liquidación neta.',
        color: 'merchant',
        position: { top: '0', right: '8%' },
        badge: null,
        actions: [
            {
                icon: '📡',
                title: 'Captura datos',
                description: 'POS, chip, contactless, online'
            },
            {
                icon: '📤',
                title: 'Envía solicitud',
                description: 'Datos de la transacción al adquirente'
            },
            {
                icon: '💵',
                title: 'Recibe liquidación',
                description: 'Fondos netos después de MDR'
            }
        ],
        metrics: [
            { label: 'MDR promedio', value: '2-4%' },
            { label: 'Liquidación', value: 'T+1 a T+30' }
        ]
    },

    acquirer: {
        id: 'acquirer',
        name: 'Adquirente',
        shortName: 'Adquirente',
        icon: '🏦',
        description: 'Banco o procesador que tiene contrato con el comercio. Enruta la transacción a la red y liquida fondos al merchant.',
        color: 'acquirer',
        position: { bottom: '8%', right: '5%' },
        badge: {
            text: 'MP Operador',
            type: 'acquirer'
        },
        actions: [
            {
                icon: '🔀',
                title: 'Enruta a la marca',
                description: 'Identifica Visa/MC/Amex por BIN'
            },
            {
                icon: '📊',
                title: 'Gestiona clearing',
                description: 'Batch de transacciones'
            },
            {
                icon: '💰',
                title: 'Cobra MDR',
                description: 'Merchant Discount Rate'
            }
        ],
        fees: [
            { label: 'Interchange (paga)', value: '~1.5%' },
            { label: 'Scheme Fee (paga)', value: '~0.1%' }
        ],
        hasInterco: true
    },

    network: {
        id: 'network',
        name: 'Marcas / Red',
        shortName: 'Red',
        icon: '🌐',
        description: 'Red que interconecta adquirentes y emisores. Define las reglas del esquema, mensajería y fija las tasas de intercambio.',
        color: 'network',
        position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
        badge: null,
        isCenter: true,
        brands: [
            { id: 'visa', name: 'VISA', class: 'visa' },
            { id: 'mastercard', name: 'MC', class: 'mastercard' },
            { id: 'amex', name: 'AMEX', class: 'amex' }
        ],
        actions: [
            {
                icon: '🔗',
                title: 'Interconexión',
                description: 'Enruta mensajes entre bancos'
            },
            {
                icon: '📋',
                title: 'Reglas del esquema',
                description: 'Define estándares y compliance'
            },
            {
                icon: '💵',
                title: 'Scheme Fee',
                description: 'Cobra ~0.1-1% por transacción'
            }
        ]
    },

    issuer: {
        id: 'issuer',
        name: 'Banco Emisor',
        shortName: 'Emisor',
        icon: '🏛️',
        description: 'Banco que emite tarjetas a los clientes. Autoriza o declina transacciones y recibe el interchange fee como compensación.',
        color: 'issuer',
        position: { bottom: '8%', left: '5%' },
        badge: {
            text: 'MP Emisor',
            type: 'issuer'
        },
        actions: [
            {
                icon: '🔍',
                title: 'Autoriza transacción',
                description: 'Valida fondos, fraude, límites'
            },
            {
                icon: '📝',
                title: 'Registra movimiento',
                description: 'En la cuenta del cliente'
            },
            {
                icon: '💰',
                title: 'Recibe Interchange',
                description: '~1-2% de la transacción'
            }
        ],
        fees: [
            { label: 'Interchange (recibe)', value: '~1.5%' },
            { label: 'Interés anual', value: '~18-40%' }
        ],
        hasInterco: true
    }
};

// Orden de los actores para renderizado
const ACTOR_ORDER = ['cardholder', 'merchant', 'acquirer', 'network', 'issuer'];

// Exportar para uso global
window.ACTORS = ACTORS;
window.ACTOR_ORDER = ACTOR_ORDER;
