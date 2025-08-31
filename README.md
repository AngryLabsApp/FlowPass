# FlowPass

FlowPass es una aplicación web moderna diseñada específicamente para academias de baile, gimnasios y centros deportivos que necesitan gestionar la asistencia y membresías de sus alumnos de manera eficiente. Esta herramienta facilita el seguimiento de asistencias, control de pagos y gestión de membresías en un solo lugar.

## 🎯 ¿Para quién está diseñado?

- Academias de baile
- Gimnasios
- Centros deportivos
- Estudios de yoga
- Cualquier negocio basado en membresías y clases

## 💪 Beneficios principales

- Control de asistencia en tiempo real
- Seguimiento de membresías y pagos
- Gestión de clases y horarios
- Monitoreo de vencimientos de membresías
- Reportes de asistencia y participación
- Interface intuitiva para administradores y personal

## 🎨 Características técnicas

- Diseño moderno y responsive adaptado a cualquier dispositivo
- Arquitectura CSS en capas usando `@layer`
- Enfoque mobile-first para uso en tablets y móviles
- Componentes personalizados que incluyen:
  - Tarjetas de usuario con estado de membresía
  - Tablas de control de asistencia
  - Badges para estados de pago y membresía
  - Búsqueda rápida de alumnos
  - Sistema de botones intuitivo
  - Identidad visual personalizable

## 🏗️ Project Structure

```
public/
├── css/
│   ├── index.css                 # Main CSS aggregator
│   ├── 1_foundations/           
│   │   ├── globals.css          # Global styles
│   │   ├── reset.css           # CSS reset
│   │   ├── tokens.css          # Design tokens
│   │   └── typography.css      # Typography system
│   ├── 2_layouts/
│   │   └── app.css             # Layout styles
│   ├── 3_components/           # Individual components
│   │   ├── component.badge.css
│   │   ├── component.button.css
│   │   ├── component.card.css
│   │   ├── component.logo.css
│   │   ├── component.search.css
│   │   ├── component.table.css
│   │   └── component.user.css
│   └── 4_utilities/
│       └── utilities.css       # Utility classes
└── images/                     # Image assets
```

## 🎯 CSS Architecture

The project uses a layered CSS architecture with `@layer` for better specificity control:

1. `reset` - Basic CSS reset
2. `tokens` - Design tokens and variables
3. `base` - Typography and global styles
4. `layouts` - Layout components
5. `components` - UI components
6. `utilities` - Utility classes

## 🎨 Color Palette

- Primary colors: A mix of greens and grays
- Accent color: `#EE4266`
- Background: `#F6F7FB`
- Text colors: Dark gray (`#2A2B2E`) with muted variant

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- 1100px (table column adjustments)
- 900px (simplified table view)
- 640px (mobile-optimized view)

## 🔤 Typography

Uses modern font stack:
- Text: "Inter" (400, 500, 600)
- Headings: "Plus Jakarta Sans" (700, 800)

## 🚀 Implementación

1. Clona el repositorio
2. Personaliza los colores y marca en `tokens.css`
3. Configura la URL del formulario de registro en `index.html`
4. Despliega en tu servidor web favorito

## 💡 Casos de uso

- **Academias de baile**: Control de asistencia a diferentes clases y niveles
- **Gimnasios**: Seguimiento de membresías y accesos
- **Estudios de yoga**: Gestión de clases y paquetes
- **Centros deportivos**: Control de acceso y pagos
- **Escuelas de artes marciales**: Seguimiento de progreso y asistencia

## 🌐 Compatibilidad

El proyecto utiliza características modernas de CSS y está optimizado para navegadores actuales:
- Variables CSS para personalización
- Diseño Grid y Flexbox para layouts robustos
- Selectores y pseudo-clases modernas
- Totalmente responsive para uso en tablets y móviles en recepción
