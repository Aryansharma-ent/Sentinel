import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Sliders } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [health, setHealth] = useState({ online: false });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get('/api/health');
        setHealth({ online: true });
      } catch (err) {
        setHealth({ online: false });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setActiveTab('analyzer')}>
        <div className="brand-logo">⚡</div>
        <span>Text Intelligence</span>
      </div>

      <nav className="nav-pills">
        <button
          className={`nav-pill ${activeTab === 'analyzer' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyzer')}
        >
          <Sliders size={17} />
          Analyzer
        </button>

        <button
          className={`nav-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={17} />
          Analytics & Stats
        </button>
      </nav>

      <div className="health-status">
        <span className={`status-dot ${health.online ? 'online' : 'offline'}`}></span>
        <span>
          {health.online ? 'Services Online' : 'Service Offline'}
        </span>
      </div>
    </header>
  );
}
