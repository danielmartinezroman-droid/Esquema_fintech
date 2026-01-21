/* ============================================
   Steps Data - ATM Withdrawal
   Flujo de retiro en cajero desde perspectiva MP Emisor
   ============================================ */

const FLOW_STEPS = {
    atm: [
        {
            num: 1,
            id: 'step-1',
            title: 'Cliente inserta tarjeta en ATM ajeno',
            description: 'El cliente MP inserta su tarjeta de débito en un cajero automático que NO es de Mercado Pago.',
            actor: 'cardholder',
            targetActor: 'atm',
            amount: '💳',
            amountLabel: 'Tarjeta MP',
            pathType: 'payment',
            dotColor: '#E91E63'
        },
        {
            num: 2,
            id: 'step-2',
            title: 'ATM solicita retiro al banco dueño',
            description: 'El cajero envía la solicitud de retiro ($50,000 CLP) al banco propietario del ATM.',
            actor: 'atm',
            targetActor: 'atmBank',
            amount: '$50,000',
            amountLabel: 'Solicitud',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 3,
            id: 'step-3',
            title: 'Banco ATM enruta a la red',
            description: 'El banco dueño del cajero envía la solicitud a la red interbancaria (Redgiro, Cirrus, Plus).',
            actor: 'atmBank',
            targetActor: 'atmNetwork',
            amount: 'Auth',
            amountLabel: 'Redgiro',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 4,
            id: 'step-4',
            title: 'Red consulta a MP Emisor',
            description: 'La red interbancaria contacta a MP Emisor para autorizar el retiro del cliente.',
            actor: 'atmNetwork',
            targetActor: 'issuer',
            amount: '$50,000',
            amountLabel: 'Autorizar',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 5,
            id: 'step-5',
            title: 'MP Emisor autoriza y debita',
            description: 'MP Emisor valida fondos, debita la cuenta del cliente y envía autorización. Registra costo interbancario.',
            actor: 'issuer',
            targetActor: 'atmNetwork',
            amount: '✅ OK',
            amountLabel: 'Aprobado',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 6,
            id: 'step-6',
            title: 'Respuesta viaja al banco ATM',
            description: 'La red envía la autorización al banco dueño del cajero.',
            actor: 'atmNetwork',
            targetActor: 'atmBank',
            amount: '✅ OK',
            amountLabel: 'Autorizado',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 7,
            id: 'step-7',
            title: 'ATM dispensa efectivo',
            description: 'El cajero entrega el efectivo al cliente. El banco ATM puede cobrar Surcharge adicional.',
            actor: 'atmBank',
            targetActor: 'atm',
            amount: '$50,000',
            amountLabel: 'Efectivo',
            pathType: 'settlement',
            dotColor: '#E6CF00'
        }
    ]
};

// SVG Paths para ATM
const SVG_PATHS = {
    path1: { d: 'M200,95 L580,95', type: 'payment', marker: 'arrowPayment' },
    path2: { d: 'M665,130 L665,480', type: 'auth', marker: 'arrowAuth' },
    path3: { d: 'M600,540 L460,400', type: 'network-flow', marker: 'arrowNetwork' },
    path4: { d: 'M340,400 L200,540', type: 'network-flow', marker: 'arrowNetwork' },
    path5: { d: 'M200,505 L340,370', type: 'auth', marker: 'arrowAuth' },
    path6: { d: 'M460,370 L600,505', type: 'auth', marker: 'arrowAuth' },
    path7: { d: 'M630,480 L630,165', type: 'settlement', marker: 'arrowSettle' }
};

// SVG Markers
const SVG_MARKERS = {
    arrowPayment: { color: '#E91E63' },
    arrowAuth: { color: '#00A650' },
    arrowNetwork: { color: '#8B5CF6' },
    arrowSettle: { color: '#E6CF00' }
};

// Label positions
const LABEL_POSITIONS = [
    { x: 320, y: 55, width: 130 },
    { x: 680, y: 280, width: 95 },
    { x: 500, y: 440, width: 90 },
    { x: 200, y: 440, width: 100 },
    { x: 200, y: 400, width: 90 },
    { x: 475, y: 400, width: 100 },
    { x: 540, y: 280, width: 95 }
];

// Fees específicos de ATM para MP Emisor (Chile)
const ATM_FEES = {
    chile: {
        currency: 'CLP',
        description: 'Costos para MP Emisor cuando cliente retira en cajero ajeno',
        costs: [
            {
                id: 'sponsor',
                label: 'Tarifa Banco Sponsor',
                value: 'UF 5 (~$55)',
                type: 'fixed',
                frequency: 'mensual'
            },
            {
                id: 'rbi',
                label: 'Costo mensual RBI',
                value: '$151',
                type: 'fixed',
                frequency: 'mensual'
            },
            {
                id: 'redgiro-fixed',
                label: 'Costo fijo Redgiro',
                value: '$150',
                type: 'fixed',
                frequency: 'mensual'
            },
            {
                id: 'redgiro-trx',
                label: 'Costo trx Redgiro (Not on Us)',
                value: '0.00068 UF/trx',
                type: 'variable',
                frequency: 'por transacción'
            },
            {
                id: 'interbancaria',
                label: 'Tarifa Interbancaria',
                value: '0.0155 UF/trx',
                type: 'variable',
                frequency: 'por transacción'
            }
        ],
        surcharge: {
            label: 'Surcharge (cobra banco ATM al cliente)',
            value: '$0 - $1,500',
            description: 'Comisión que el banco dueño del ATM puede cobrar al cliente por usar cajero ajeno'
        },
        example: {
            withdrawal: 50000,
            costPerTrx: 850, // Aprox en CLP
            surcharge: 1000 // Ejemplo
        }
    }
};

// Exportar
window.FLOW_STEPS = FLOW_STEPS;
window.SVG_PATHS = SVG_PATHS;
window.SVG_MARKERS = SVG_MARKERS;
window.LABEL_POSITIONS = LABEL_POSITIONS;
window.ATM_FEES = ATM_FEES;
