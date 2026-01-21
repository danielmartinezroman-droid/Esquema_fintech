/* ============================================
   Actors Data
   Definición de todos los actores del ecosistema
   ============================================ */

const ACTORS = {
    // ===== ACTORES COMUNES =====
    cardholder: {
        id: 'cardholder',
        name: 'Tarjetahabiente',
        shortName: 'Cliente',
        icon: '👤',
        description: 'Cliente que tiene una tarjeta de crédito o débito emitida por un banco bajo una marca de la red (Visa, MC, Amex).',
        color: 'cardholder',
        actions: [
            { icon: '💳', title: 'Presenta credenciales', description: 'Tarjeta física, digital o token' },
            { icon: '🔐', title: 'Autentica (si aplica)', description: '3DS, PIN, biometría' },
            { icon: '✅', title: 'Recibe confirmación', description: 'Aprobación o rechazo' }
        ],
        infoTag: null
    },

    user: {
        id: 'user',
        name: 'Usuario',
        shortName: 'Usuario',
        icon: '👤',
        description: 'Usuario de la aplicación que inicia una operación financiera como transferencia o retiro.',
        color: 'cardholder',
        actions: [
            { icon: '📱', title: 'Inicia operación', description: 'Desde app o web' },
            { icon: '🔐', title: 'Autentica', description: 'PIN, biometría, 2FA' },
            { icon: '✅', title: 'Recibe confirmación', description: 'Comprobante de operación' }
        ],
        infoTag: null
    },

    merchant: {
        id: 'merchant',
        name: 'Comercio',
        shortName: 'Comercio',
        icon: '🏪',
        description: 'Negocio que acepta pagos con tarjeta. Informa al adquirente sobre el intento de pago y recibe la liquidación neta.',
        color: 'merchant',
        actions: [
            { icon: '📡', title: 'Captura datos', description: 'POS, chip, contactless, online' },
            { icon: '📤', title: 'Envía solicitud', description: 'Datos de la transacción al adquirente' },
            { icon: '💵', title: 'Recibe liquidación', description: 'Fondos netos después de MDR' }
        ],
        metrics: [
            { label: 'MDR promedio', value: '2-4%' },
            { label: 'Liquidación', value: 'T+1 a T+30' }
        ],
        infoTag: { text: '📤 Paga MDR', type: 'expense', tooltip: 'Merchant Discount Rate: ~2-4% del monto' }
    },

    acquirer: {
        id: 'acquirer',
        name: 'Adquirente',
        shortName: 'Adquirente',
        icon: '🏦',
        description: 'Banco o procesador que tiene contrato con el comercio. Enruta la transacción a la red y liquida fondos al merchant.',
        color: 'acquirer',
        badge: { text: 'MP Operador', type: 'acquirer' },
        actions: [
            { icon: '🔀', title: 'Enruta a la marca', description: 'Identifica Visa/MC/Amex por BIN' },
            { icon: '📊', title: 'Gestiona clearing', description: 'Batch de transacciones' },
            { icon: '💰', title: 'Cobra MDR', description: 'Merchant Discount Rate' }
        ],
        fees: [
            { label: 'Interchange (paga)', value: '~1.5%' },
            { label: 'Scheme Fee (paga)', value: '~0.1%' }
        ],
        hasInterco: true,
        infoTag: { text: '💸 Paga IC + Scheme', type: 'expense', tooltip: 'Paga Interchange al emisor y Scheme Fee a la red' }
    },

    network: {
        id: 'network',
        name: 'Marcas / Red',
        shortName: 'Red',
        icon: '🌐',
        description: 'Red que interconecta adquirentes y emisores. Define las reglas del esquema, mensajería y fija las tasas de intercambio.',
        color: 'network',
        isCenter: true,
        brands: [
            { id: 'visa', name: 'VISA', class: 'visa' },
            { id: 'mastercard', name: 'MC', class: 'mastercard' },
            { id: 'amex', name: 'AMEX', class: 'amex' }
        ],
        actions: [
            { icon: '🔗', title: 'Interconexión', description: 'Enruta mensajes entre bancos' },
            { icon: '📋', title: 'Reglas del esquema', description: 'Define estándares y compliance' },
            { icon: '💵', title: 'Scheme Fee', description: 'Cobra ~0.1-1% por transacción' }
        ],
        infoTag: { text: '🏷️ Cobra Scheme Fee', type: 'income', tooltip: 'Assessment fee: ~0.1% por transacción' }
    },

    issuer: {
        id: 'issuer',
        name: 'Banco Emisor',
        shortName: 'Emisor',
        icon: '🏛️',
        description: 'Banco que emite tarjetas a los clientes. Autoriza o declina transacciones y recibe el interchange fee.',
        color: 'issuer',
        badge: { text: 'MP Emisor', type: 'issuer' },
        actions: [
            { icon: '🔍', title: 'Autoriza transacción', description: 'Valida fondos, fraude, límites' },
            { icon: '📝', title: 'Registra movimiento', description: 'En la cuenta del cliente' },
            { icon: '💰', title: 'Recibe Interchange', description: '~1-2% por transacción' }
        ],
        fees: [
            { label: 'Interchange (recibe)', value: '~1.5%' },
            { label: 'Interés anual', value: '~18-40%' }
        ],
        hasInterco: true,
        infoTag: { text: '💰 Recibe Interchange', type: 'income', tooltip: 'Compensación por riesgo crediticio: ~1-2%' }
    },

    // ===== ACTORES ATM =====
    atm: {
        id: 'atm',
        name: 'Cajero ATM',
        shortName: 'ATM Ajeno',
        icon: '🏧',
        description: 'Cajero automático de OTRO banco (no MP). El cliente MP usa este cajero para retirar efectivo.',
        color: 'merchant',
        actions: [
            { icon: '💳', title: 'Lee tarjeta', description: 'Chip, banda magnética o contactless' },
            { icon: '🔢', title: 'Solicita PIN', description: 'Cliente ingresa su clave' },
            { icon: '💵', title: 'Dispensa efectivo', description: 'Entrega billetes al cliente' }
        ],
        infoTag: { text: '🏧 Cajero Ajeno', type: 'neutral', tooltip: 'ATM de otro banco, no de MP' }
    },

    atmBank: {
        id: 'atmBank',
        name: 'Banco del ATM',
        shortName: 'Banco ATM',
        icon: '🏦',
        description: 'Banco dueño/operador del cajero automático. Puede cobrar Surcharge al cliente por usar su ATM siendo de otro banco.',
        color: 'acquirer',
        actions: [
            { icon: '📡', title: 'Recibe solicitud', description: 'Del cajero automático' },
            { icon: '🔀', title: 'Enruta a la red', description: 'Redgiro, Cirrus, Plus' },
            { icon: '💰', title: 'Puede cobrar Surcharge', description: 'Comisión al cliente ($0-$1,500)' }
        ],
        fees: [
            { label: 'Surcharge (opcional)', value: '$0 - $1,500' },
            { label: 'Tarifa interbancaria', value: 'Recibe del emisor' }
        ],
        infoTag: { text: '💰 Cobra Surcharge', type: 'income', tooltip: 'Comisión que puede cobrar al cliente por usar ATM ajeno' }
    },

    atmNetwork: {
        id: 'atmNetwork',
        name: 'Red Interbancaria',
        shortName: 'Redgiro',
        icon: '🌐',
        description: 'Red que conecta cajeros automáticos con bancos emisores. En Chile: Redgiro. Internacional: Cirrus (MC), Plus (Visa).',
        color: 'network',
        isCenter: true,
        brands: [
            { id: 'redgiro', name: 'REDGIRO', class: 'mastercard' },
            { id: 'cirrus', name: 'CIRRUS', class: 'visa' },
            { id: 'plus', name: 'PLUS', class: 'amex' }
        ],
        actions: [
            { icon: '🔗', title: 'Interconexión ATM', description: 'Conecta cajeros con emisores' },
            { icon: '✅', title: 'Autorización online', description: 'Valida en tiempo real' },
            { icon: '📊', title: 'Clearing diario', description: 'Compensación entre bancos' }
        ],
        fees: [
            { label: 'Costo trx Redgiro', value: '0.00068 UF/trx' },
            { label: 'Costo fijo mensual', value: '~$150' }
        ],
        infoTag: { text: '🔗 Red ATM', type: 'neutral', tooltip: 'Redgiro / Cirrus / Plus' }
    },

    // Issuer específico para ATM (hereda de issuer pero con info de ATM)
    issuerAtm: {
        id: 'issuer',
        name: 'MP Emisor',
        shortName: 'MP Emisor',
        icon: '🏛️',
        description: 'Mercado Pago como banco emisor. Cuando su cliente retira en cajero ajeno, MP Emisor paga tarifas interbancarias a la red y al banco del ATM.',
        color: 'issuer',
        badge: { text: 'MP Emisor', type: 'issuer' },
        actions: [
            { icon: '🔍', title: 'Autoriza retiro', description: 'Valida fondos y límites del cliente' },
            { icon: '💸', title: 'Debita cuenta', description: 'Descuenta monto + comisiones' },
            { icon: '📤', title: 'Paga tarifa interbancaria', description: 'Costo por usar red ajena' }
        ],
        fees: [
            { label: 'Tarifa Banco Sponsor', value: 'UF 5/mes (~$55)' },
            { label: 'Costo Redgiro Not on Us', value: '0.00068 UF/trx' },
            { label: 'Tarifa Interbancaria', value: '~0.0155 UF/trx' }
        ],
        hasInterco: false,
        infoTag: { text: '💸 Paga Tarifa Interbancaria', type: 'expense', tooltip: 'MP paga al banco del ATM y a la red por cada retiro' }
    },

    // ===== ACTORES TRANSFERENCIA =====
    mpIssuer: {
        id: 'mpIssuer',
        name: 'MP Emisor',
        shortName: 'Origen',
        icon: '🏛️',
        description: 'Mercado Pago como institución emisora. Cuenta origen desde donde se envía el dinero.',
        color: 'issuer',
        badge: { text: 'MP Emisor', type: 'issuer' },
        actions: [
            { icon: '✅', title: 'Valida fondos', description: 'Verifica saldo disponible' },
            { icon: '📤', title: 'Envía instrucción', description: 'A la cámara de compensación' },
            { icon: '➖', title: 'Debita cuenta', description: 'Descuenta del usuario' }
        ],
        infoTag: { text: '📤 Money Out', type: 'expense', tooltip: 'Salida de dinero de MP' }
    },

    clearingHouse: {
        id: 'clearingHouse',
        name: 'Cámara de Compensación',
        shortName: 'Cámara',
        icon: '🏦',
        description: 'Entidad que procesa y compensa transferencias entre instituciones financieras (ACH, SPEI, TEF, etc.).',
        color: 'network',
        isCenter: true,
        brands: [
            { id: 'ach', name: 'ACH', class: 'visa' },
            { id: 'spei', name: 'SPEI', class: 'mastercard' },
            { id: 'tef', name: 'TEF', class: 'amex' }
        ],
        actions: [
            { icon: '📥', title: 'Recibe instrucción', description: 'Del banco origen' },
            { icon: '🔄', title: 'Compensa', description: 'Netea posiciones' },
            { icon: '📤', title: 'Envía a destino', description: 'Instruye al banco receptor' }
        ],
        infoTag: { text: '🔄 Compensa', type: 'neutral', tooltip: 'Liquida transferencias interbancarias' }
    },

    destinationBank: {
        id: 'destinationBank',
        name: 'Banco Destino',
        shortName: 'Destino',
        icon: '🏦',
        description: 'Banco receptor de la transferencia. Acredita los fondos en la cuenta del beneficiario.',
        color: 'acquirer',
        actions: [
            { icon: '📥', title: 'Recibe instrucción', description: 'De la cámara' },
            { icon: '✅', title: 'Valida cuenta', description: 'Verifica beneficiario' },
            { icon: '➕', title: 'Acredita fondos', description: 'Abona en cuenta destino' }
        ],
        infoTag: { text: '📥 Money In', type: 'income', tooltip: 'Entrada de dinero al banco' }
    },

    beneficiary: {
        id: 'beneficiary',
        name: 'Beneficiario',
        shortName: 'Beneficiario',
        icon: '👤',
        description: 'Persona o entidad que recibe la transferencia en su cuenta bancaria.',
        color: 'cardholder',
        actions: [
            { icon: '📱', title: 'Recibe notificación', description: 'Aviso de abono' },
            { icon: '💰', title: 'Fondos disponibles', description: 'Puede usar el dinero' }
        ],
        infoTag: { text: '✅ Recibe fondos', type: 'income', tooltip: 'Dinero acreditado en cuenta' }
    }
};

// ===== CONFIGURACIÓN POR FLUJO =====
const FLOW_ACTORS = {
    'card-payment': ['cardholder', 'merchant', 'acquirer', 'network', 'issuer'],
    'atm-withdrawal': ['cardholder', 'atm', 'atmBank', 'atmNetwork', 'issuer'],
    'transfer': ['user', 'mpIssuer', 'clearingHouse', 'destinationBank', 'beneficiary']
};

// ===== POSICIONES POR FLUJO =====
const ACTOR_POSITIONS = {
    'card-payment': {
        cardholder: { top: '0', left: '8%' },
        merchant: { top: '0', right: '8%' },
        acquirer: { bottom: '8%', right: '5%' },
        network: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
        issuer: { bottom: '8%', left: '5%' }
    },
    'atm-withdrawal': {
        cardholder: { top: '0', left: '8%' },
        atm: { top: '0', right: '8%' },
        atmBank: { bottom: '8%', right: '5%' },
        atmNetwork: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
        issuer: { bottom: '8%', left: '5%' }
    },
    'transfer': {
        user: { top: '0', left: '8%' },
        mpIssuer: { top: '0', right: '8%' },
        clearingHouse: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
        destinationBank: { bottom: '8%', right: '5%' },
        beneficiary: { bottom: '8%', left: '5%' }
    }
};

// Función para obtener actores del flujo actual
function getFlowActors() {
    const flowId = window.CURRENT_FLOW?.id || 'card-payment';
    return FLOW_ACTORS[flowId] || FLOW_ACTORS['card-payment'];
}

// Función para obtener posiciones del flujo actual
function getActorPosition(actorId) {
    const flowId = window.CURRENT_FLOW?.id || 'card-payment';
    const positions = ACTOR_POSITIONS[flowId] || ACTOR_POSITIONS['card-payment'];
    return positions[actorId] || {};
}

// Función para obtener actor con override por flujo
function getActor(actorId) {
    const flowId = window.CURRENT_FLOW?.id || 'card-payment';
    
    // Override específico para ATM
    if (flowId === 'atm-withdrawal' && actorId === 'issuer') {
        return ACTORS.issuerAtm || ACTORS.issuer;
    }
    
    return ACTORS[actorId];
}

// Exportar para uso global
window.ACTORS = ACTORS;
window.FLOW_ACTORS = FLOW_ACTORS;
window.ACTOR_POSITIONS = ACTOR_POSITIONS;
window.getFlowActors = getFlowActors;
window.getActorPosition = getActorPosition;
window.getActor = getActor;
