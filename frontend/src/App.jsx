import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Zap, BarChart2 } from 'lucide-react';
import axios from 'axios';
import OverviewTab from './components/OverviewTab.jsx';
import AnalyzerTab from './components/AnalyzerTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import sentinelLogo from './assets/sentinel.png';
import './index.css';

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',  icon: LayoutGrid, desc: 'Platform Features' },
  { id: 'analyzer',  label: 'Analyzer',  icon: Zap,        desc: 'Analyze Text'       },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2,   desc: 'View Analytics'     },
];

export default function App() {
  const [tab, setTab]       = useState('overview');
  const [health, setHealth] = useState({ flask: null, express: null });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axios.get('http://127.0.0.1:5001/', { timeout: 2000 });
        setHealth(h => ({ ...h, flask: true }));
      } catch {
        setHealth(h => ({ ...h, flask: false }));
      }
      try {
        await axios.get('/api/stats', { timeout: 2000 });
        setHealth(h => ({ ...h, express: true }));
      } catch {
        setHealth(h => ({ ...h, express: false }));
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-layout">

      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => setTab('overview')} style={{ cursor: 'pointer' }}>
          <img src={sentinelLogo} alt="SENTINEL Logo" className="logo-img" />
          <div>
            <div className="logo-text">SENTINEL</div>
            <div className="logo-sub">NLP Intelligence</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Platform</div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${tab === item.id ? 'active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                <Icon size={15} className="nav-icon" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="service-status-title">Service Status</div>
          <div className="service-item">
            <span className="service-name">Flask ML</span>
            <span className={`status-dot ${health.flask === true ? 'online' : health.flask === false ? 'offline' : ''}`} />
          </div>
          <div className="service-item">
            <span className="service-name">MongoDB</span>
            <span className={`status-dot ${health.express === true ? 'online' : health.express === false ? 'offline' : ''}`} />
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">

        {/* Top Bar */}
        <div className="top-bar">
          {/* Mobile Logo */}
          <div className="mobile-logo" onClick={() => setTab('overview')}>
            <img src={sentinelLogo} alt="SENTINEL Logo" className="logo-img-mobile" />
            <span className="logo-text">SENTINEL</span>
          </div>

          <span className="top-bar-title">
            SENTINEL <span className="top-bar-sep">/</span>{' '}
            <strong>{tab === 'overview' ? 'Overview' : tab === 'analyzer' ? 'Analyzer' : 'Dashboard'}</strong>
          </span>

          {/* Mobile status dots */}
          <div className="mobile-status">
            <span
              title="Flask ML"
              className={`status-dot ${health.flask === true ? 'online' : health.flask === false ? 'offline' : ''}`}
            />
            <span
              title="MongoDB"
              className={`status-dot ${health.express === true ? 'online' : health.express === false ? 'offline' : ''}`}
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">
          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <OverviewTab onNavigate={setTab} />
              </motion.div>
            )}
            {tab === 'analyzer' && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <AnalyzerTab />
              </motion.div>
            )}
            {tab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <DashboardTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile Bottom Nav Bar ── */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${active ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
