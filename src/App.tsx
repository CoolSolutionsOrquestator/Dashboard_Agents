import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer } from './components/ui/ToastContainer';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AgentsPage } from './pages/Agents/AgentsPage';
import { SprintsPage } from './pages/Sprints/SprintsPage';
import { FlowPage } from './pages/Flow/FlowPage';
import { CostsPage } from './pages/Costs/CostsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/sprints" element={<SprintsPage />} />
          <Route path="/flow" element={<FlowPage />} />
          <Route path="/costs" element={<CostsPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;