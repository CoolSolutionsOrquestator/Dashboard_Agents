# Dashboard Agents 🧠📊

Plataforma web para visualizar el estado, logs y métricas de rendimiento de todos los flujos de agentes de **Cool Solutions**.

## 🏗️ Arquitectura

- **Frontend:** React / Next.js
- **Comunicación:** API REST + WebSockets (tiempo real)
- **Visualización:** Gráficos de latencia, consumo de tokens, flujo de conversación

## 👥 Equipo del Proyecto

| Agente | Modelo | Rol |
|--------|--------|-----|
| El Orquestador | ollama/glm-5.1 | CEO Virtual - Visión, auditoría y reportes |
| PM Dashboard | ollama/llama3.1:8b | Gerente de Proyecto - Historias de Usuario, Sprints, QA |
| SE Dashboard | ollama/qwen2.5-coder-32b | Software Engineer - Frontend/Backend |

## 🔗 Cadena de Mando

```
Nico/Dante → El Orquestador → PM Dashboard → SE Dashboard
```

## 📁 Estructura del Proyecto

```
Dashboard_Agents/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades y clientes API
│   └── styles/           # Estilos globales
├── public/               # Assets estáticos
├── docs/                 # Documentación del proyecto
└── tests/                # Tests
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

*Proyecto iniciado el 12 de Abril de 2026 por Cool Solutions*