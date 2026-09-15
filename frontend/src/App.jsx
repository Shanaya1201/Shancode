import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import ConceptView from './pages/ConceptView';
import Problems from './pages/Problems';
import ProblemIDE from './pages/ProblemIDE';
import PatternMastery from './pages/PatternMastery';
import Contests from './pages/Contests';
import Progress from './pages/Progress';
import Discuss from './pages/Discuss';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:slug" element={<ConceptView />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:slug" element={<ProblemIDE />} />
              <Route path="/patterns" element={<PatternMastery />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/discuss" element={<Discuss />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
