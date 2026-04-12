# Dashboard Agents - Sprint 1: Arquitectura y Definición

**Autor:** PM Dashboard (El Orquestador - Subagente)
**Proyecto:** Dashboard Agents MVP (Uso Interno: Dante y Nico)
**Objetivo:** Monitoreo de agentes OpenClaw en localhost.

---

## 1. Stack Tecnológico

Para cumplir con los criterios de ser simple, rápido de levantar y fácil de escalar, propongo el siguiente stack:

*   **Frontend Framework:** **React con Vite + TypeScript**.
    *   *Justificación:* Vite es extremadamente rápido para desarrollo local. React es estándar de la industria, fácil de iterar y hay abundancia de componentes pre-hechos. TypeScript asegura tipado estricto para evitar errores con los datos de los agentes.
*   **Estilos y UI:** **Tailwind CSS + shadcn/ui**.
    *   *Justificación:* Tailwind permite prototipado rápido sin salir del HTML/JSX. `shadcn/ui` provee componentes accesibles y de aspecto profesional (tablas, tarjetas, menús) copiando y pegando el código, sin atarnos a una librería pesada.
*   **Visualización de Datos:** **Recharts**.
    *   *Justificación:* Componentes de gráficos limpios, declarativos y nativos para React. Fáciles de integrar con Tailwind.
*   **Iconografía:** **Lucide React**.
    *   *Justificación:* Ligero, moderno y es el estándar que usa shadcn/ui por defecto.
*   **Enrutamiento:** **React Router v6**.
    *   *Justificación:* Simple y directo para manejar las 3 vistas principales (Dashboard, Agentes, Costos) en una Single Page Application (SPA).

---

## 2. Modelo de Datos Mock (TypeScript)

Los siguientes tipos e interfaces definen la estructura de datos para el MVP.

```typescript
// types/index.ts

export type AgentStatus = 'active' | 'idle' | 'offline' | 'error';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  modelId: string;
  totalTokens: number;
  totalCost: number; // En USD
  lastActive: string; // ISO 8601 Date string
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  inputCostPer1k: number;
  outputCostPer1k: number;
  assignedAgents: string[]; // Array de Agent IDs
}

export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalCost: number;
  totalTokens: number;
  lastUpdated: string;
}

export interface CostTimelinePoint {
  date: string;
  cost: number;
}
```

### Datos Mock Representativos (JSON snapshot)

```json
{
  "system": {
    "totalAgents": 5,
    "activeAgents": 2,
    "totalCost": 8.32,
    "totalTokens": 1245000,
    "lastUpdated": "2026-04-12T22:30:00Z"
  },
  "models": [
    {
      "id": "glm-5.1",
      "name": "GLM-5.1",
      "provider": "Ollama Cloud",
      "inputCostPer1k": 0.0,
      "outputCostPer1k": 0.0,
      "assignedAgents": ["agent-1"]
    },
    {
      "id": "llama3.1-8b",
      "name": "Llama 3.1 8B",
      "provider": "Ollama Cloud",
      "inputCostPer1k": 0.0,
      "outputCostPer1k": 0.0,
      "assignedAgents": ["agent-2", "agent-4"]
    },
    {
      "id": "qwen2.5-coder-32b",
      "name": "Qwen 2.5 Coder 32B",
      "provider": "Ollama Cloud",
      "inputCostPer1k": 0.0,
      "outputCostPer1k": 0.0,
      "assignedAgents": ["agent-3", "agent-5"]
    },
    {
      "id": "gemini-3.1-pro",
      "name": "Gemini 3.1 Pro",
      "provider": "Google",
      "inputCostPer1k": 0.00125,
      "outputCostPer1k": 0.005,
      "assignedAgents": []
    }
  ],
  "agents": [
    {
      "id": "agent-1",
      "name": "El Orquestador",
      "status": "active",
      "modelId": "glm-5.1",
      "totalTokens": 450000,
      "totalCost": 0.0,
      "lastActive": "2026-04-12T22:29:00Z"
    },
    {
      "id": "agent-2",
      "name": "PM Dashboard",
      "status": "idle",
      "modelId": "llama3.1-8b",
      "totalTokens": 85000,
      "totalCost": 0.0,
      "lastActive": "2026-04-12T22:05:00Z"
    },
    {
      "id": "agent-3",
      "name": "SE Dashboard",
      "status": "idle",
      "modelId": "qwen2.5-coder-32b",
      "totalTokens": 320000,
      "totalCost": 0.0,
      "lastActive": "2026-04-12T21:45:00Z"
    },
    {
      "id": "agent-4",
      "name": "PM Ventas",
      "status": "offline",
      "modelId": "llama3.1-8b",
      "totalTokens": 150000,
      "totalCost": 0.0,
      "lastActive": "2026-04-11T14:30:00Z"
    },
    {
      "id": "agent-5",
      "name": "SE Ventas",
      "status": "error",
      "modelId": "qwen2.5-coder-32b",
      "totalTokens": 240000,
      "totalCost": 0.0,
      "lastActive": "2026-04-12T19:00:00Z"
    }
  ]
}
```

> **Nota:** Los costos por modelo están en $0 para Ollama Cloud Pro (costo fijo $20/mes). Los modelos de API de pago por uso (ej. Gemini) tienen costo por token. El campo `totalCost` se calcula para tracking futuro cuando se integren APIs de pago.

---

## 3. Estructura de Vistas (Wireframes en Texto)

### Layout Principal (App Shell)
*   **Sidebar/Top Navbar:** Navegación principal con links a "Dashboard", "Agentes" y "Costos". Indicador global de estado ("Sistema Online").
*   **Contenido:** Área central donde se renderizan las vistas.

### Vista 1: Dashboard (Home)
*   **Fila 1: Métricas Clave (Cards horizontales)**
    *   Card 1: Costo Total Acumulado (Ej: $12.45) | +5% esta semana
    *   Card 2: Agentes Activos (Ej: 2 / 5) | Estado general
    *   Card 3: Tokens Consumidos (Ej: 854K)
*   **Fila 2: Gráfico de Actividad**
    *   *Chart (Recharts):* Gráfico de líneas mostrando "Consumo de Tokens por Día" en los últimos 7 días.
*   **Fila 3: Top Agentes (Lista Rápida)**
    *   Lista de los 3 agentes con mayor consumo o actividad reciente. Columnas: Nombre, Estado (Punto verde/gris/rojo), Costo.

### Vista 2: Agentes
*   **Cabecera:** Título "Directorio de Agentes" y un botón (deshabilitado por ahora) "Nuevo Agente".
*   **Filtros:**
    *   Dropdown: Filtrar por Estado (Todos, Activos, Inactivos).
    *   Dropdown: Filtrar por Modelo (Todos, GPT-4, Claude, etc.).
*   **Contenido Principal: Tabla de Datos**
    *   Columnas: Nombre, Modelo, Estado (Badge visual), Tokens Usados, Costo Acumulado, Última Actividad.
    *   *Interacción:* Posibilidad de ordenar por Costo o Tokens.

### Vista 3: Costos
*   **Cabecera:** Título "Análisis de Costos" y selector de rango de tiempo (Últimos 7 días, 30 días, Todo - *mockeado*).
*   **Fila 1: Gráficos de Distribución (Side-by-side)**
    *   *Gráfico 1 (Pie Chart):* Costo dividido por Modelo (Ej: 40% GPT-4, 60% Claude).
    *   *Gráfico 2 (Bar Chart):* Top 5 Agentes por Costo.
*   **Fila 2: Tabla de Desglose**
    *   Detalle por modelo mostrando: Modelo, Provider, Llamadas estimadas, Costo Input, Costo Output, Costo Total.

---

## 4. Estructura de Carpetas del Proyecto

Estructura sugerida para el repositorio React + Vite:

```text
Dashboard_Agents/
├── docs/                     # Documentación (este archivo)
├── public/                   # Assets estáticos
├── src/
│   ├── assets/               # Imágenes, iconos locales
│   ├── components/           # Componentes UI reutilizables
│   │   ├── layout/           # Sidebar, Navbar, PageLayout
│   │   ├── ui/               # Componentes base (shadcn/ui: buttons, cards, tables)
│   │   └── charts/           # Envoltorios de Recharts
│   ├── data/                 # Archivos de datos mock (mockData.ts)
│   ├── hooks/                # Custom hooks (ej: useAgents, useMetrics)
│   ├── pages/                # Vistas principales
│   │   ├── Dashboard/        # Vista Home
│   │   ├── Agents/           # Vista Directorio
│   │   └── Costs/            # Vista de Finanzas
│   ├── types/                # Definiciones de TypeScript (index.ts)
│   ├── App.tsx               # Root component, Routing
│   └── main.tsx              # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Definición de Subagentes para Ejecución

Para transformar esta planificación en código real en el próximo sprint, recomiendo dividir el trabajo en los siguientes subagentes especialistas:

### Subagente 1: Ing. Frontend Core (Frontend_Setup)
*   **Perfil:** Experto en React, Vite, Tailwind y configuración de proyectos.
*   **Misión Sprint 2:** 
    1. Inicializar el proyecto con Vite + React + TS.
    2. Instalar y configurar Tailwind CSS y dependencias (react-router-dom, recharts, lucide-react).
    3. Crear la estructura de carpetas definida.
    4. Implementar el *App Shell* (Layout principal, navegación lateral/superior).
    5. Crear el archivo de datos mock en `src/data/mockData.ts` con los tipos definidos.

### Subagente 2: UI/UX Developer (Component_Builder)
*   **Perfil:** Especialista en diseño de interfaces y componentes React.
*   **Misión Sprint 2:**
    1. Construir las vistas consumiendo la data mock estática.
    2. *Tarea 1:* Implementar `Dashboard.tsx` (Tarjetas de resumen y gráficos básicos).
    3. *Tarea 2:* Implementar `Agents.tsx` (Tabla con diseño limpio y estados de estado).
    4. *Tarea 3:* Implementar `Costs.tsx` (Gráficos de barras y torta con Recharts).

*Nota: Una vez que el Ing. Frontend Core termine la configuración inicial, el UI/UX Developer puede tomar las riendas para construir las vistas de forma secuencial.*

---

## 6. Nota Arquitectónica: Aislamiento de Datos Mock

El archivo `src/data/mockData.ts` debe ser **la única fuente de datos** en el MVP. Sin embargo, debe diseñarse para ser reemplazado sin fricción:

1. **Patrón Adapter:** Crear un `src/services/dataService.ts` que exporte funciones asíncronas (ej: `getAgents()`, `getMetrics()`, `getCosts()`). Internamente, estas funciones leen de `mockData.ts`. Cuando se integre la API real, solo se cambia este archivo.
2. **Ningún componente** debe importar `mockData.ts` directamente. Solo consumen a través de `dataService.ts`.
3. **Hooks:** Los custom hooks (`useAgents`, `useMetrics`) llaman a `dataService.ts`, no a los datos crudos.