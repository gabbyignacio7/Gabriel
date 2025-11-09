import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { FileUpload } from './components/upload/FileUpload';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SalesPipelineView } from './components/dashboard/SalesPipelineView';
import { EngineeringView } from './components/dashboard/EngineeringView';
import { ProductRoadmapView } from './components/dashboard/ProductRoadmapView';
import { useDashboardStore } from './store/dashboardStore';

function App() {
  const hasData = useDashboardStore((state) => state.features.length > 0);

  return (
    <Router basename="/deepsee-priority-dashboard">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/upload" element={<FileUpload />} />
            <Route
              path="/"
              element={hasData ? <ExecutiveDashboard /> : <Navigate to="/upload" replace />}
            />
            <Route
              path="/sales"
              element={hasData ? <SalesPipelineView /> : <Navigate to="/upload" replace />}
            />
            <Route
              path="/engineering"
              element={hasData ? <EngineeringView /> : <Navigate to="/upload" replace />}
            />
            <Route
              path="/roadmap"
              element={hasData ? <ProductRoadmapView /> : <Navigate to="/upload" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
