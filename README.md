# Modelo de 4 Partes — Ecosistema de Pagos 💳

Diagrama interactivo del modelo de 4 partes para pagos con tarjeta. Herramienta educativa y de presentación para entender el flujo de transacciones.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Demo

[Ver Demo en Vivo](https://TU-USUARIO.github.io/modelo-4-partes/)

## 📸 Preview


👤 Tarjetahabiente ──────────────► 🏪 Comercio
       │                              │
       │                              │
       │         🌐 Marcas            │
       │        Visa/MC/Amex          │
       │                              │
       ▼                              ▼
🏛️ Banco Emisor ◄────────────── 🏦 Adquirente
   (MP Emisor)                  (MP Operador)


   ## ✨ Características

- **🎬 Animación paso a paso** - Visualiza el flujo completo de una transacción
- **🖱️ Interactivo** - Click en actores para ver detalles
- **👁️ Múltiples vistas** - Flujo completo, MP Operador, MP Emisor, Interco
- **💰 Desglose de fees** - Interchange, Scheme Fee, MDR
- **⌨️ Keyboard shortcuts** - SPACE para play/pause, ESC para reset
- **📱 Responsive** - Funciona en desktop y mobile

## 🏗️ Estructura del Proyecto

modelo-4-partes/
├── index.html              # HTML principal
├── css/
│   ├── variables.css       # Variables de diseño (colores, espacios)
│   ├── base.css            # Estilos base y reset
│   ├── header.css          # Estilos del header
│   ├── actors.css          # Estilos de las tarjetas de actores
│   ├── connections.css     # Estilos de conexiones SVG
│   ├── sidebar.css         # Estilos del panel lateral
│   └── animations.css      # Animaciones CSS
├── js/
│   ├── data/
│   │   ├── actors.js       # Datos de los actores
│   │   ├── steps.js        # Pasos del flujo
│   │   └── fees.js         # Información de fees por país
│   ├── components/
│   │   ├── header.js       # Componente header
│   │   ├── diagram.js      # Componente diagrama
│   │   └── sidebar.js      # Componente sidebar
│   ├── core/
│   │   ├── state.js        # Manejo de estado global
│   │   └── animation.js    # Controlador de animaciones
│   └── app.js              # Inicialización principal
└── README.md

## 🚀 Cómo usar

### Opción 1: GitHub Pages (Recomendado)
1. Fork este repositorio
2. Ve a Settings → Pages
3. En "Source", selecciona "main" branch
4. Tu sitio estará en `https://tu-usuario.github.io/modelo-4-partes/`

### Opción 2: Local
1. Clona el repositorio
2. Abre `index.html` en tu navegador

## ⌨️ Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `SPACE` | Play/Pause animación |
| `ESC` | Detener y resetear |

## 🎨 Personalización

### Cambiar colores
Edita `css/variables.css` para modificar los colores del tema.

### Agregar nuevo país (fees)
Agrega una nueva entrada en `js/data/fees.js`:

```javascript
FEES_DATA.argentina = {
    currency: 'ARS',
    currencySymbol: '$',
    // ... resto de la configuración
};

