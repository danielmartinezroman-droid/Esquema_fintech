/* ============================================
   FLOW CONFIGURATIONS
   Configuración de cada flujo de pagos
   Paths SVG ajustados para conectar nodos
   ============================================ */

const FLOW_CONFIGS = {
    // ===== PAGO CON TARJETA =====
    'card-payment': {
        id: 'card-payment',
        name: 'Pago con Tarjeta',
        subtitle: 'Modelo 4 Partes',
        icon: '💳',
        
        nodes: [
            {
                id: 'cardholder',
                name: 'Tarjetahabiente',
                subtitle: 'Cliente',
                icon: '👤',
                color: '#F472B6',
                style: 'left: 5%; top: 8%;',
                tag: 'Inicia pago'
            },
            {
                id: 'merchant',
                name: 'Comercio',
                subtitle: 'Punto de venta',
                icon: '🏪',
                color: '#4ADE80',
                style: 'right: 5%; top: 8%;',
                tag: 'Recibe $960'
            },
            {
                id: 'acquirer',
                name: 'Adquirente',
                subtitle: 'Banco del comercio',
                icon: '🏦',
                color: '#4ADE80',
                badge: 'MP Operador',
                style: 'right: 5%; bottom: 8%;',
                tag: 'Cobra MDR'
            },
            {
                id: 'network',
                name: 'Red / Marcas',
                subtitle: 'Visa, MC, Amex',
                icon: '🌐',
                color: '#C084FC',
                style: 'left: 50%; top: 50%; transform: translate(-50%, -50%);',
                tag: 'Interconecta'
            },
            {
                id: 'issuer',
                name: 'Banco Emisor',
                subtitle: 'Banco del cliente',
                icon: '🏛️',
                color: '#60A5FA',
                badge: 'MP Emisor',
                style: 'left: 5%; bottom: 8%;',
                tag: 'Recibe Interchange'
            }
        ],
        
        // Paths dinámicos — calculados desde posición real de los nodos
        paths: [
            { id: 'path1', from: 'cardholder', to: 'merchant',  type: 'data'     },
            { id: 'path2', from: 'merchant',   to: 'acquirer',  type: 'auth'     },
            { id: 'path3', from: 'acquirer',   to: 'network',   type: 'data'     },
            { id: 'path4', from: 'network',    to: 'issuer',    type: 'auth'     },
            { id: 'path5', from: 'issuer',     to: 'network',   type: 'response' },
            { id: 'path6', from: 'network',    to: 'acquirer',  type: 'response' },
            { id: 'path7', from: 'acquirer',   to: 'merchant',  type: 'money'    }
        ],
        
        steps: [
            { 
                title: 'Cliente paga al comercio',
                subtitle: 'Presenta tarjeta',
                amount: '$1,000',
                pathId: 'path1',
                type: 'data',
                nodes: ['cardholder', 'merchant']
            },
            { 
                title: 'Comercio solicita autorización',
                subtitle: 'Envía datos al adquirente',
                amount: 'Auth',
                pathId: 'path2',
                type: 'auth',
                nodes: ['merchant', 'acquirer']
            },
            { 
                title: 'Adquirente enruta a la red',
                subtitle: 'Según BIN de tarjeta',
                amount: '→',
                pathId: 'path3',
                type: 'data',
                nodes: ['acquirer', 'network']
            },
            { 
                title: 'Red contacta al emisor',
                subtitle: 'Solicita autorización',
                amount: '$1,000',
                pathId: 'path4',
                type: 'auth',
                nodes: ['network', 'issuer']
            },
            { 
                title: 'Emisor autoriza',
                subtitle: 'Valida fondos y aprueba',
                amount: '✓ OK',
                pathId: 'path5',
                type: 'response',
                nodes: ['issuer', 'network']
            },
            { 
                title: 'Respuesta al adquirente',
                subtitle: 'Transacción aprobada',
                amount: '✓',
                pathId: 'path6',
                type: 'response',
                nodes: ['network', 'acquirer']
            },
            { 
                title: 'Liquidación al comercio',
                subtitle: 'Neto después de MDR',
                amount: '$960',
                pathId: 'path7',
                type: 'money',
                nodes: ['acquirer', 'merchant']
            }
        ],
        
        fees: [
            { label: 'Monto original', value: '$1,000', color: '#F472B6' },
            { label: 'Interchange (Emisor)', value: '-$15 (1.5%)', color: '#60A5FA' },
            { label: 'Scheme Fee (Red)', value: '-$5 (0.5%)', color: '#C084FC' },
            { label: 'MDR (Adquirente)', value: '-$20 (2%)', color: '#4ADE80' },
            { label: 'Neto comercio', value: '$960', isTotal: true }
        ],
        feesTitle: 'Desglose de Fees',
        
        footerNote: '<strong>💡 Interco:</strong> Cuando MP Operador procesa un pago de tarjeta MP Emisor, es una transacción "on-us" con fees internos.'
    },
    
    // ===== RETIRO ATM =====
    'atm-withdrawal': {
        id: 'atm-withdrawal',
        name: 'Retiro en Cajero ATM',
        subtitle: 'Money Out',
        icon: '🏧',
        
        nodes: [
            {
                id: 'cardholder',
                name: 'Cliente MP',
                subtitle: 'Tarjetahabiente',
                icon: '👤',
                color: '#F472B6',
                style: 'left: 5%; top: 8%;',
                tag: 'Inicia retiro'
            },
            {
                id: 'atm',
                name: 'Cajero ATM',
                subtitle: 'Banco externo',
                icon: '🏧',
                color: '#4ADE80',
                style: 'right: 5%; top: 8%;',
                tag: 'Cajero ajeno'
            },
            {
                id: 'atmBank',
                name: 'Banco del ATM',
                subtitle: 'Propietario cajero',
                icon: '🏦',
                color: '#4ADE80',
                badge: 'Surcharge',
                badgeColor: '#4ADE80',
                style: 'right: 5%; bottom: 8%;',
                tag: 'Cobra comisión'
            },
            {
                id: 'network',
                name: 'Red Interbancaria',
                subtitle: 'Redgiro / Cirrus',
                icon: '🌐',
                color: '#C084FC',
                style: 'left: 50%; top: 50%; transform: translate(-50%, -50%);',
                tag: 'Conecta bancos'
            },
            {
                id: 'issuer',
                name: 'MP Emisor',
                subtitle: 'Banco del cliente',
                icon: '🏛️',
                color: '#FFE600',
                badge: 'MP Emisor',
                badgeColor: '#FFE600',
                style: 'left: 5%; bottom: 8%;',
                tag: 'Autoriza & Debita'
            }
        ],
        
        // Paths dinámicos — calculados desde posición real de los nodos
        paths: [
            { id: 'path1', from: 'cardholder', to: 'atm',      type: 'data'     },
            { id: 'path2', from: 'atm',        to: 'atmBank',  type: 'auth'     },
            { id: 'path3', from: 'atmBank',    to: 'network',  type: 'data'     },
            { id: 'path4', from: 'network',    to: 'issuer',   type: 'auth'     },
            { id: 'path5', from: 'issuer',     to: 'network',  type: 'response' },
            { id: 'path6', from: 'network',    to: 'atmBank',  type: 'response' },
            { id: 'path7', from: 'atmBank',    to: 'atm',      type: 'money'    }
        ],
        
        steps: [
            { 
                title: 'Cliente inserta tarjeta',
                subtitle: 'En cajero ATM ajeno',
                amount: '💳',
                pathId: 'path1',
                type: 'data',
                nodes: ['cardholder', 'atm']
            },
            { 
                title: 'ATM solicita retiro',
                subtitle: 'Envía al banco del ATM',
                amount: '$50,000',
                pathId: 'path2',
                type: 'auth',
                nodes: ['atm', 'atmBank']
            },
            { 
                title: 'Banco enruta a red',
                subtitle: 'Vía Redgiro/Cirrus',
                amount: '→',
                pathId: 'path3',
                type: 'data',
                nodes: ['atmBank', 'network']
            },
            { 
                title: 'Red contacta MP Emisor',
                subtitle: 'Solicita autorización',
                amount: 'Auth',
                pathId: 'path4',
                type: 'auth',
                nodes: ['network', 'issuer']
            },
            { 
                title: 'MP Emisor autoriza',
                subtitle: 'Valida y debita cuenta',
                amount: '✓ OK',
                pathId: 'path5',
                type: 'response',
                nodes: ['issuer', 'network']
            },
            { 
                title: 'Respuesta viaja',
                subtitle: 'Aprobación al banco ATM',
                amount: '✓',
                pathId: 'path6',
                type: 'response',
                nodes: ['network', 'atmBank']
            },
            { 
                title: 'ATM dispensa efectivo',
                subtitle: 'Entrega billetes',
                amount: '$50,000',
                pathId: 'path7',
                type: 'money',
                nodes: ['atmBank', 'atm']
            }
        ],
        
        fees: [
            { label: 'Retiro ejemplo', value: '$50,000', color: '#F472B6' },
            { label: 'Costo trx Redgiro', value: '0.00068 UF', color: '#C084FC' },
            { label: 'Tarifa Interbancaria', value: '~0.0155 UF', color: '#4ADE80' },
            { label: 'Surcharge (banco ATM)', value: '$0 - $1,500', color: '#4ADE80' },
            { label: 'Costo aprox MP/trx', value: '~$850', isTotal: true }
        ],
        feesTitle: 'Costos ATM (MP Emisor)',
        feesBadge: 'Chile',
        feesNote: '<strong>💡 Surcharge:</strong> Comisión que el banco dueño del ATM puede cobrar al cliente por usar un cajero "ajeno".',
        
        footerNote: '<strong>💡 Not on Us:</strong> Cuando un cliente MP retira en cajero de otro banco, MP Emisor paga tarifas interbancarias.'
    },
    
    // ===== TRANSFERENCIA =====
    'transfer': {
        id: 'transfer',
        name: 'Transferencia Bancaria',
        subtitle: 'Money Out / In',
        icon: '🔄',
        
        nodes: [
            {
                id: 'user',
                name: 'Usuario MP',
                subtitle: 'Ordenante',
                icon: '👤',
                color: '#F472B6',
                style: 'left: 5%; top: 8%;',
                tag: 'Inicia transferencia'
            },
            {
                id: 'mpIssuer',
                name: 'MP Emisor',
                subtitle: 'Cuenta origen',
                icon: '🏛️',
                color: '#FFE600',
                badge: 'MP Emisor',
                style: 'right: 5%; top: 8%;',
                tag: 'Money Out'
            },
            {
                id: 'clearingHouse',
                name: 'Cámara',
                subtitle: 'ACH / SPEI / TEF',
                icon: '🔄',
                color: '#C084FC',
                style: 'left: 50%; top: 50%; transform: translate(-50%, -50%);',
                tag: 'Compensa'
            },
            {
                id: 'destBank',
                name: 'Banco Destino',
                subtitle: 'Receptor',
                icon: '🏦',
                color: '#4ADE80',
                style: 'right: 5%; bottom: 8%;',
                tag: 'Money In'
            },
            {
                id: 'beneficiary',
                name: 'Beneficiario',
                subtitle: 'Receptor final',
                icon: '👤',
                color: '#4ADE80',
                style: 'left: 5%; bottom: 8%;',
                tag: 'Recibe fondos'
            }
        ],
        
        // Paths dinámicos — calculados desde posición real de los nodos
        paths: [
            { id: 'path1', from: 'user',         to: 'mpIssuer',      type: 'data'  },
            { id: 'path2', from: 'mpIssuer',     to: 'clearingHouse', type: 'auth'  },
            { id: 'path3', from: 'clearingHouse',to: 'destBank',      type: 'money' },
            { id: 'path4', from: 'destBank',     to: 'beneficiary',   type: 'money' }
        ],
        
        steps: [
            { 
                title: 'Usuario inicia transferencia',
                subtitle: 'Ingresa datos y monto',
                amount: '$100,000',
                pathId: 'path1',
                type: 'data',
                nodes: ['user', 'mpIssuer']
            },
            { 
                title: 'MP Emisor procesa',
                subtitle: 'Valida y envía a cámara',
                amount: '→',
                pathId: 'path2',
                type: 'auth',
                nodes: ['mpIssuer', 'clearingHouse']
            },
            { 
                title: 'Cámara compensa',
                subtitle: 'Envía al banco destino',
                amount: '$100,000',
                pathId: 'path3',
                type: 'money',
                nodes: ['clearingHouse', 'destBank']
            },
            { 
                title: 'Banco acredita',
                subtitle: 'Fondos al beneficiario',
                amount: '✓',
                pathId: 'path4',
                type: 'money',
                nodes: ['destBank', 'beneficiary']
            }
        ],
        
        fees: [
            { label: 'Monto enviado', value: '$100,000', color: '#F472B6' },
            { label: 'Costo cámara', value: 'Variable', color: '#C084FC' },
            { label: 'Monto recibido', value: '$100,000', isTotal: true }
        ],
        feesTitle: 'Info Transferencia',
        
        footerNote: '<strong>💡 Tip:</strong> Las transferencias inmediatas usan sistemas como SPEI (México), Pix (Brasil) o TEF (Chile).'
    }
};

// Exportar
window.FLOW_CONFIGS = FLOW_CONFIGS;
