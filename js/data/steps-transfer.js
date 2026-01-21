/* ============================================
   Steps Data - Bank Transfer
   Pasos del flujo de transferencia bancaria
   ============================================ */

const FLOW_STEPS = {
    transfer: [
        {
            num: 1,
            id: 'step-1',
            title: 'Usuario inicia transferencia',
            description: 'El usuario ingresa los datos del beneficiario y el monto a transferir ($1,000).',
            actor: 'user',
            targetActor: 'mpIssuer',
            amount: '$1,000',
            amountLabel: 'Enviar',
            pathType: 'payment',
            dotColor: '#E91E63'
        },
        {
            num: 2,
            id: 'step-2',
            title: 'MP Emisor valida y debita',
            description: 'Mercado Pago verifica fondos, debita la cuenta del usuario y genera la instrucción.',
            actor: 'mpIssuer',
            targetActor: 'clearingHouse',
            amount: '$1,000',
            amountLabel: 'Instrucción',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 3,
            id: 'step-3',
            title: 'Cámara recibe instrucción',
            description: 'La cámara de compensación (ACH/SPEI/TEF) recibe y procesa la transferencia.',
            actor: 'clearingHouse',
            targetActor: 'clearingHouse',
            amount: '🔄',
            amountLabel: 'Procesa',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 4,
            id: 'step-4',
            title: 'Cámara envía a banco destino',
            description: 'La cámara instruye al banco destino para acreditar los fondos.',
            actor: 'clearingHouse',
            targetActor: 'destinationBank',
            amount: '$1,000',
            amountLabel: 'Acreditar',
            pathType: 'settlement',
            dotColor: '#E6CF00'
        },
        {
            num: 5,
            id: 'step-5',
            title: 'Banco destino acredita',
            description: 'El banco receptor abona el dinero en la cuenta del beneficiario.',
            actor: 'destinationBank',
            targetActor: 'beneficiary',
            amount: '$1,000',
            amountLabel: 'Abono',
            pathType: 'settlement',
            dotColor: '#E6CF00'
        },
        {
            num: 6,
            id: 'step-6',
            title: 'Beneficiario recibe fondos',
            description: 'El beneficiario recibe notificación y puede disponer del dinero.',
            actor: 'beneficiary',
            targetActor: 'beneficiary',
            amount: '✅',
            amountLabel: 'Recibido',
            pathType: 'auth',
            dotColor: '#00A650'
        }
    ]
};

// SVG Paths para Transfer (layout diferente - más lineal)
const SVG_PATHS = {
    path1: { d: 'M200,95 L580,95', type: 'payment', marker: 'arrowPayment' },
    path2: { d: 'M580,130 L450,340', type: 'auth', marker: 'arrowAuth' },
    path3: { d: 'M400,385 L400,385', type: 'network-flow', marker: 'arrowNetwork' }, // Self
    path4: { d: 'M450,420 L600,540', type: 'settlement', marker: 'arrowSettle' },
    path5: { d: 'M600,580 L200,580', type: 'settlement', marker: 'arrowSettle' },
    path6: { d: 'M200,545 L200,545', type: 'auth', marker: 'arrowAuth' } // Self
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
    { x: 340, y: 55, width: 100 },
    { x: 520, y: 220, width: 110 },
    { x: 350, y: 360, width: 100 },
    { x: 520, y: 460, width: 100 },
    { x: 340, y: 550, width: 100 },
    { x: 150, y: 500, width: 90 }
];

// Exportar
window.FLOW_STEPS = FLOW_STEPS;
window.SVG_PATHS = SVG_PATHS;
window.SVG_MARKERS = SVG_MARKERS;
window.LABEL_POSITIONS = LABEL_POSITIONS;
