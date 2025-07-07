import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SuspectList from './pages/SuspectList';
import SuspectProfile from './pages/SuspectProfile';
import OSINTSearch from './pages/OSINTSearch';
import BotManagement from './pages/BotManagement';
import LegalAssistant from './pages/LegalAssistant';
import ReportCenter from './pages/ReportCenter';
import FIRDrafting from './pages/FIRDrafting';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/suspects" element={<SuspectList />} />
        <Route path="/suspect/:id" element={<SuspectProfile />} />
        <Route path="/osint-search" element={<OSINTSearch />} />
        <Route path="/bot-management" element={<BotManagement />} />
        <Route path="/legal-assistant" element={<LegalAssistant />} />
        <Route path="/report-center" element={<ReportCenter />} />
        <Route path="/fir-drafting" element={<FIRDrafting />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;