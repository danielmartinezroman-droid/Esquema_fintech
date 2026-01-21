/* ============================================
   Steps Data - ATM Withdrawal
   Pasos del flujo de retiro en cajero
   ============================================ */

const FLOW_STEPS = {
    atm: [
        {
            num: 1,
            id: 'step-1',
            title: 'Cliente inserta tarjeta',
            description: 'El tarjetahabiente inserta su tarjeta de débito en el cajero automático.',
            actor: 'cardholder',
            targetActor: 'atm',
            amount: '💳',
            amountLabel: 'Tarjeta',
            pathType: 'payment',
            dotColor: '#E91E63'
        },
        {
            num: 2,
            id: 'step-2',
            title: 'ATM solicita retiro',
            description: 'El cajero envía la solicitud de retiro por $500 al banco propietario del ATM.',
            actor: 'atm',
            targetActor: 'atmBank',
            amount: '$500',
            amountLabel: 'Retiro',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 3,
            id: 'step-3',
            title: 'Banco ATM enruta a la red',
            description: 'El banco del cajero envía la solicitud a la red interbancaria (Cirrus/Plus).',
            actor: 'atmBank',
            targetActor: 'atmNetwork',
            amount: 'Auth Req',
            amountLabel: 'Mensaje',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 4,
            id: 'step-4',
            title: 'Red consulta al emisor',
            description: 'La red contacta al banco emisor (MP Emisor) para autorizar el retiro.',
            actor: 'atmNetwork',
            targetActor: 'issuer',
            amount: '$500',
            amountLabel: 'Autorizar',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 5,
            id: 'step-5',
            title: 'Emisor autoriza y debita',
            description: 'MP Emisor valida fondos, debita la cuenta del cliente y envía autorización.',
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
            title: 'Respuesta al banco ATM',
            description: 'La red envía la autorización al banco del cajero.',
            actor: 'atmNetwork',
            targetActor: 'atmBank',
            amount: '✅ OK',
            amountLabel: 'Aprobado',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 7,
            id: 'step-7',
            title: 'ATM dispensa efectivo',
            description: 'El cajero entrega $500 en efectivo al cliente.',
            actor: 'atmBank',
            targetActor: 'atm',
            amount: '$500',
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
    { x: 340, y: 55, width: 100 },
    { x: 680, y: 280, width: 90 },
    { x: 500, y: 440, width: 100 },
    { x: 200, y: 440, width: 110 },
    { x: 200, y: 400, width: 100 },
    { x: 475, y: 400, width: 100 },
    { x: 540, y: 280, width: 90 }
];

// Exportar
window.FLOW_STEPS = FLOW_STEPS;
window.SVG_PATHS = SVG_PATHS;
window.SVG_MARKERS = SVG_MARKERS;
window.LABEL_POSITIONS = LABEL_POSITIONS;
