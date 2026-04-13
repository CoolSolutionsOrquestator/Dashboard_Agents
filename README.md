# Dashboard Agents

Dashboard de monitoreo de agentes IA para **Cool Solutions**. Permite visualizar en tiempo real el estado, consumo de tokens y costos de los agentes OpenClaw.

## Vistas

| Vista | Ruta | Descripción |
|-------|------|-------------|
| **Dashboard** | `/` | Resumen general: métricas clave, actividad de tokens, top agentes y alertas del sistema |
| **Agentes** | `/agents` | Directorio completo de agentes con filtros por estado, modelo y búsqueda por nombre |
| **Costos** | `/costs` | Análisis de costos: distribución por modelo, top agentes por costo, desglose detallado con filtros |

## Stack

- **React 19** + **Vite 8** + **TypeScript 6**
- **Tailwind CSS 4** para estilos
- **Recharts 3** para gráficos (área, pie, barras)
- **Lucide React** para iconografía
- **React Router 7** para navegación SPA

## Cómo correr

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

El servidor de desarrollo se levanta en `http://localhost:5173` por defecto.

## Estructura del proyecto

```
src/
├── components/
│   ├── charts/        # Componentes de Recharts (TokenActivity, PieChart, BarChart)
│   ├── layout/        # AppShell con sidebar y navegación
│   └── ui/            # MetricCard, StatusBadge, CostBreakdownTable
├── data/              # Datos mock (mockData.ts)
├── hooks/             # Custom hooks (useAgents, useCosts, useMetrics, etc.)
├── pages/             # Vistas principales (Dashboard, Agents, Costs)
├── services/          # Capa de datos (dataService.ts) — reemplazar para conectar API real
├── types/             # Definiciones TypeScript
└── utils/             # Utilidades de formateo
```

## Datos

El MVP usa datos mock en `src/data/mockData.ts`. Toda la data se consume a través de `src/services/dataService.ts` (patrón Adapter), por lo que para conectar una API real solo se necesita modificar ese archivo.

## Funcionalidades

- **Métricas en tiempo real**: Costo total, agentes activos, tokens consumidos
- **Gráficos interactivos**: Consumo de tokens por día, distribución por modelo, top agentes
- **Alertas dinámicas**: Agentes en estado error o sin actividad por +24h
- **Filtros**: Por estado, modelo, nombre de agente y rango de tiempo
- **Ordenamiento**: Por tokens y costo en la vista de agentes
- **Responsive**: Sidebar colapsa en mobile, tablas con scroll horizontal
- **Loading skeletons**: Estados de carga animados en todas las vistas