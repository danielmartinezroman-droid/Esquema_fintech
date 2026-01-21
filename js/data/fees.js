/* ============================================
   Fees Data
   Información de comisiones por país/producto
   ============================================ */

const FEES_DATA = {
    // Ejemplo base (genérico)
    default: {
        currency: 'USD',
        currencySymbol: '$',
        example: {
            originalAmount: 1000,
            interchange: { percent: 1, amount: 10 },
            schemeFee: { percent: 1, amount: 10 },
            mdr: { percent: 2, amount: 20 },
            netToMerchant: 960
        },
        breakdown: [
            {
                id: 'original',
                label: 'Monto Original',
                value: '$1,000',
                color: 'cardholder',
                isTotal: false
            },
            {
                id: 'interchange',
                label: 'Interchange (Emisor)',
                value: '-$10 (1%)',
                color: 'issuer',
                isTotal: false
            },
            {
                id: 'scheme',
                label: 'Scheme Fee (Red)',
                value: '-$10 (1%)',
                color: 'network',
                isTotal: false
            },
            {
                id: 'mdr',
                label: 'MDR (Adquirente)',
                value: '-$20 (2%)',
                color: 'acquirer',
                isTotal: false
            },
            {
                id: 'net',
                label: 'Neto Comercio',
                value: '$960',
                color: null,
                isTotal: true
            }
        ]
    },

    // Chile
    chile: {
        currency: 'CLP',
        currencySymbol: '$',
        regulatedInterchange: true,
        maxInterchange: {
            credit: 1.48,
            debit: 0.60
        },
        example: {
            originalAmount: 100000,
            interchange: { percent: 1.48, amount: 1480 },
            schemeFee: { percent: 0.10, amount: 100 },
            mdr: { percent: 2.5, amount: 2500 },
            netToMerchant: 95920
        },
        breakdown: [
            {
                id: 'original',
                label: 'Monto Original',
                value: '$100,000',
                color: 'cardholder',
                isTotal: false
            },
            {
                id: 'interchange',
                label: 'Interchange (máx regulado)',
                value: '-$1,480 (1.48%)',
                color: 'issuer',
                isTotal: false
            },
            {
                id: 'scheme',
                label: 'Scheme Fee',
                value: '-$100 (0.1%)',
                color: 'network',
                isTotal: false
            },
            {
                id: 'mdr',
                label: 'MDR',
                value: '-$2,500 (2.5%)',
                color: 'acquirer',
                isTotal: false
            },
            {
                id: 'net',
                label: 'Neto Comercio',
                value: '$95,920',
                color: null,
                isTotal: true
            }
        ],
        notes: [
            'Interchange regulado por CMF desde 2023',
            'Tasas máximas: Crédito 1.48%, Débito 0.60%',
            'Modelo de 4 partes obligatorio (Ley 21.365)'
        ]
    },

    // Brasil
    brasil: {
        currency: 'BRL',
        currencySymbol: 'R$',
        regulatedInterchange: true,
        example: {
            originalAmount: 1000,
            interchange: { percent: 1.2, amount: 12 },
            schemeFee: { percent: 0.08, amount: 0.80 },
            mdr: { percent: 2.0, amount: 20 },
            netToMerchant: 967.20
        },
        breakdown: [
            {
                id: 'original',
                label: 'Monto Original',
                value: 'R$1,000',
                color: 'cardholder',
                isTotal: false
            },
            {
                id: 'interchange',
                label: 'Interchange',
                value: '-R$12 (1.2%)',
                color: 'issuer',
                isTotal: false
            },
            {
                id: 'scheme',
                label: 'Scheme Fee',
                value: '-R$0.80 (0.08%)',
                color: 'network',
                isTotal: false
            },
            {
                id: 'mdr',
                label: 'MDR',
                value: '-R$20 (2%)',
                color: 'acquirer',
                isTotal: false
            },
            {
                id: 'net',
                label: 'Neto Comercio',
                value: 'R$967.20',
                color: null,
                isTotal: true
            }
        ]
    },

    // México
    mexico: {
        currency: 'MXN',
        currencySymbol: '$',
        regulatedInterchange: false,
        example: {
            originalAmount: 10000,
            interchange: { percent: 1.8, amount: 180 },
            schemeFee: { percent: 0.12, amount: 12 },
            mdr: { percent: 3.0, amount: 300 },
            netToMerchant: 9508
        },
        breakdown: [
            {
                id: 'original',
                label: 'Monto Original',
                value: '$10,000',
                color: 'cardholder',
                isTotal: false
            },
            {
                id: 'interchange',
                label: 'Interchange',
                value: '-$180 (1.8%)',
                color: 'issuer',
                isTotal: false
            },
            {
                id: 'scheme',
                label: 'Scheme Fee',
                value: '-$12 (0.12%)',
                color: 'network',
                isTotal: false
            },
            {
                id: 'mdr',
                label: 'MDR',
                value: '-$300 (3%)',
                color: 'acquirer',
                isTotal: false
            },
            {
                id: 'net',
                label: 'Neto Comercio',
                value: '$9,508',
                color: null,
                isTotal: true
            }
        ]
    }
};

// País actual seleccionado
let currentCountry = 'default';

// Función para obtener fees del país actual
function getCurrentFees() {
    return FEES_DATA[currentCountry] || FEES_DATA.default;
}

// Función para cambiar país
function setCountry(countryCode) {
    if (FEES_DATA[countryCode]) {
        currentCountry = countryCode;
        return true;
    }
    return false;
}

// Exportar para uso global
window.FEES_DATA = FEES_DATA;
window.getCurrentFees = getCurrentFees;
window.setCountry = setCountry;
