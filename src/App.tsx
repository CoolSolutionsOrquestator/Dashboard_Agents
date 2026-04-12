import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AgentsPage } from './pages/Agents/AgentsPage';
import { CostsPage } from './pages/Costs/CostsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/costs" element={<CostsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;