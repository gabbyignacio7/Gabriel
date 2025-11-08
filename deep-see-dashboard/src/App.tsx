import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ExecutiveSummary } from './components/views/ExecutiveSummary';
import { SalesView } from './components/views/SalesView';
import { ManagementView } from './components/views/ManagementView';
import { EngineeringView } from './components/views/EngineeringView';
import { ProductRoadmap } from './components/views/ProductRoadmap';
import { FeatureDetail } from './components/views/FeatureDetail';

const AppContent: React.FC = () => {
  const { currentUser, setCurrentUser } = useData();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentUser={currentUser} onUserChange={setCurrentUser} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ExecutiveSummary />} />
            <Route path="/sales" element={<SalesView />} />
            <Route path="/management" element={<ManagementView />} />
            <Route path="/engineering" element={<EngineeringView />} />
            <Route path="/roadmap" element={<ProductRoadmap />} />
            <Route path="/feature/:featureId" element={<FeatureDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router basename="/Gabriel">
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  );
}

export default App;
