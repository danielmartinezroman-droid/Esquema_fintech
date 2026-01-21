/* ============================================
   Steps Data - Card Payment
   Pasos del flujo de pago con tarjeta
   ============================================ */

const FLOW_STEPS = {
    authorization: [
        {
            num: 1,
            id: 'step-1',
            title: 'Cliente paga al comercio',
            description: 'El tarjetahabiente usa su tarjeta para pagar $1,000 por un producto o servicio.',
            actor: 'cardholder',
            targetActor: 'merchant',
            amount: '$1,000',
            amountLabel: 'Monto',
            pathType: 'payment',
            dotColor: '#E91E63'
        },
        {
            num: 2,
            id: 'step-2',
            title: 'Comercio informa al adquirente',
            description: 'El comercio envía los datos de la tarjeta y el monto a autorizar.',
            actor: 'merchant',
            targetActor: 'acquirer',
            amount: '$1,000',
            amountLabel: 'Solicitud',
            pathType: 'auth',
            dotColor: '#00A650'
        },
        {
            num: 3,
            id: 'step-3',
            title: 'Adquirente enruta a la marca',
            description: 'MP Operador envía la solicitud a Visa/MC según el BIN de la tarjeta.',
            actor: 'acquirer',
            targetActor: 'network',
            amount: 'Auth Req',
            amountLabel: 'Mensaje',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 4,
            id: 'step-4',
            title: 'La red contacta al emisor',
            description: 'La marca solicita autorización al banco emisor para validar la transacción.',
            actor: 'network',
            targetActor: 'issuer',
            amount: '$1,000',
            amountLabel: 'Autorizar',
            pathType: 'network-flow',
            dotColor: '#8B5CF6'
        },
        {
            num: 5,
            id: 'step-5',
            title: 'Emisor paga a la red',
            description: 'El banco emisor transfiere $990, quedándose con 1% de interchange.',
            actor: 'issuer',
            targetActor: 'network',
            amount: '$990',
            amountLabel: '-1% IC',
            pathType: 'settlement',
            dotColor: '#E6CF00'
        },
        {
            num: 6,
            id: 'step-6',
            title: 'Red paga al adquirente',
            description: 'La red transfiere $980 al adquirente, cobrando 1% de scheme fee.',
            actor: 'network',
            targetActor: 'acquirer',
            amount: '$980',
            amountLabel: '-1% Fee',
            pathType: 'settlement',
            dotColor: '#E6CF00'
        },
        {
            num: 7,
            id: 'step-7',
            title: 'Adquirente liquida al comercio',
            description: 'El comercio recibe $960 después del MDR (2% del adquirente).',
            actor: 'acquirer',
            targetActor: 'merchant',
            amount: '$960',
            amountLabel: 'Neto',
            pathType: 'settlement',
            dotColor: '#E6CF00'
        }
    ]
};

// SVG Paths para Card Payment
const SVG_PATHS = {
    path1: { d: 'M200,95 L580,95', type: 'payment', marker: 'arrowPayment' },
    path2: { d: 'M665,130 L665,480', type: 'auth', marker: 'arrowAuth' },
    path3: { d: 'M600,540 L460,400', type: 'network-flow', marker: 'arrowNetwork' },
    path4: { d: 'M340,400 L200,540', type: 'network-flow', marker: 'arrowNetwork' },
    path5: { d: 'M200,505 L340,370', type: 'settlement', marker: 'arrowSettle' },
    path6: { d: 'M460,370 L600,505', type: 'settlement', marker: 'arrowSettle' },
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
    { x: 340, y: 55, width: 120 },
    { x: 680, y: 280, width: 95 },
    { x: 500, y: 440, width: 100 },
    { x: 200, y: 440, width: 110 },
    { x: 200, y: 400, width: 120 },
    { x: 475, y: 400, width: 130 },
    { x: 540, y: 280, width: 90 }
];

// Exportar
window.FLOW_STEPS = FLOW_STEPS;
window.SVG_PATHS = SVG_PATHS;
window.SVG_MARKERS = SVG_MARKERS;
window.LABEL_POSITIONS = LABEL_POSITIONS;
