import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Database, Smile, ShieldAlert, Trash2, Tag, BookOpen, RefreshCw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const CHART_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#888', font: { family: 'Inter', size: 11 }, boxWidth: 10, padding: 16 }
    }
  },
  scales: {
    x: {
      ticks: { color: '#555', font: { size: 11 } },
      grid: { color: '#1a1a1a' }
    },
    y: {
      ticks: { color: '#555', font: { size: 11 } },
      grid: { color: '#1a1a1a' },
      beginAtZero: true
    }
  }
};

const HORIZONTAL_OPTS = { ...CHART_BASE, indexAxis: 'y' };

const EMOTION_COLORS = {
  joy: '#10b981', anger: '#ef4444', fear: '#a855f7',
  sadness: '#3b82f6', surprise: '#f59e0b', love: '#ec4899'
};

export default function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/stats');
      setStats(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleDeleteSingle = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/reviews/${id}`);
      await fetchStats();
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ Clear ALL submissions? This cannot be undone.')) return;
    setLoading(true);
    try {
      await axios.delete('/api/reviews/all');
      await fetchStats();
    } catch (err) {
      alert('Failed to clear: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner-light" />
      <p>Fetching analytics from MongoDB…</p>
    </div>
  );

  if (error) return (
    <div className="error-banner">⚠️ {error}</div>
  );

  // Chart Data
  const sentimentData = {
    labels: ['Positive', 'Negative'],
    datasets: [{
      data: [stats?.sentiment?.positive || 0, stats?.sentiment?.negative || 0],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const emotionKeys = Object.keys(stats?.emotions || {});
  const emotionData = {
    labels: emotionKeys.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    datasets: [{
      label: 'Count',
      data: Object.values(stats?.emotions || {}),
      backgroundColor: emotionKeys.map(k => EMOTION_COLORS[k.toLowerCase()] || '#6366f1'),
      borderRadius: 4,
      borderWidth: 0
    }]
  };

  const securityData = {
    labels: ['Toxic', 'Spam / Phishing'],
    datasets: [
      {
        label: 'Flagged',
        data: [stats?.toxicity?.toxic || 0, stats?.spam?.spam || 0],
        backgroundColor: '#ef4444',
        borderRadius: 4,
        borderWidth: 0
      },
      {
        label: 'Safe',
        data: [stats?.toxicity?.nonToxic || 0, stats?.spam?.legit || 0],
        backgroundColor: '#22c55e',
        borderRadius: 4,
        borderWidth: 0
      }
    ]
  };

  const gradeKeys = Object.keys(stats?.grades || {});
  const gradeData = {
    labels: gradeKeys.length > 0 ? gradeKeys : ['N/A'],
    datasets: [{
      label: 'Count',
      data: Object.values(stats?.grades || { 'N/A': 0 }),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
      borderWidth: 0
    }]
  };

  const topKwWords = (stats?.topKeywords || []).map(k => k.word);
  const topKwCounts = (stats?.topKeywords || []).map(k => k.count);
  const keywordData = {
    labels: topKwWords.length > 0 ? topKwWords : ['none'],
    datasets: [{
      label: 'Occurrences',
      data: topKwCounts.length > 0 ? topKwCounts : [0],
      backgroundColor: '#8b5cf6',
      borderRadius: 4,
      borderWidth: 0
    }]
  };

  const filteredSubs = (stats?.recentSubmissions || []).filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sentiment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.emotion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.keywords || []).some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* Header */}
      <motion.div variants={fadeUp} className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-eyebrow">MongoDB Aggregation</div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-desc">Real-time multi-dimensional statistics computed via MongoDB Aggregation Pipelines.</p>
        </div>
        <button className="btn-ghost" onClick={fetchStats}>
          <RefreshCw size={13} /> Refresh
        </button>
      </motion.div>

      {/* KPI Row */}
      <motion.div variants={fadeUp} className="kpi-grid">
        <div className="kpi-cell">
          <div className="kpi-label"><Database size={12} /> Total Submissions</div>
          <div className="kpi-value">{stats?.totalReviews || 0}</div>
          <div className="kpi-sub">Stored in MongoDB</div>
        </div>
        <div className="kpi-cell">
          <div className="kpi-label"><Smile size={12} /> Positive</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{stats?.sentiment?.positive || 0}</div>
          <div className="kpi-sub">vs {stats?.sentiment?.negative || 0} negative</div>
        </div>
        <div className="kpi-cell">
          <div className="kpi-label"><ShieldAlert size={12} /> Threats Flagged</div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>
            {(stats?.toxicity?.toxic || 0) + (stats?.spam?.spam || 0)}
          </div>
          <div className="kpi-sub">Toxic + Spam combined</div>
        </div>
        <div className="kpi-cell">
          <div className="kpi-label"><Tag size={12} /> Unique Keywords</div>
          <div className="kpi-value">{stats?.topKeywords?.length || 0}</div>
          <div className="kpi-sub">Extracted by NLP engine</div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="charts-grid">

        <motion.div variants={fadeUp} className="chart-card">
          <div className="chart-card-title"><Smile size={13} style={{ color: 'var(--success)' }} /> Sentiment Ratio</div>
          <div style={{ height: 220 }}>
            <Doughnut data={sentimentData} options={{ ...CHART_BASE, plugins: { legend: CHART_BASE.plugins.legend }, scales: {} }} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="chart-card">
          <div className="chart-card-title">🎭 Emotion Distribution</div>
          <div style={{ height: 220 }}>
            <Bar data={emotionData} options={CHART_BASE} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="chart-card">
          <div className="chart-card-title"><ShieldAlert size={13} style={{ color: 'var(--danger)' }} /> Security Threats</div>
          <div style={{ height: 220 }}>
            <Bar data={securityData} options={CHART_BASE} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="chart-card">
          <div className="chart-card-title"><BookOpen size={13} style={{ color: 'var(--info)' }} /> Readability Grades</div>
          <div style={{ height: 220 }}>
            <Bar data={gradeData} options={CHART_BASE} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="chart-card wide">
          <div className="chart-card-title"><Tag size={13} style={{ color: 'var(--accent)' }} /> Top Extracted Keywords (MongoDB Aggregation)</div>
          <div style={{ height: 240 }}>
            <Bar data={keywordData} options={HORIZONTAL_OPTS} />
          </div>
        </motion.div>

      </div>

      {/* Submissions Table */}
      <motion.div variants={fadeUp} className="table-card">
        <div className="table-header">
          <div className="table-title">🕒 Submission History</div>
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {stats?.totalReviews > 0 && (
              <button type="button" className="btn-danger" onClick={handleClearAll}>
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Text</th>
                <th>Sentiment</th>
                <th>Emotion</th>
                <th>Toxicity</th>
                <th>Spam</th>
                <th>Keywords</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length > 0 ? filteredSubs.map(item => (
                <tr key={item._id}>
                  <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.text}
                  </td>
                  <td>
                    <span className={`badge ${item.sentiment === 'positive' ? 'badge-positive' : 'badge-negative'}`}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      {(item.emotion || 'joy').toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.toxic ? 'badge-toxic' : 'badge-safe'}`}>
                      {item.toxic ? 'toxic' : 'safe'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.isSpam ? 'badge-toxic' : 'badge-safe'}`}>
                      {item.isSpam ? 'spam' : 'legit'}
                    </span>
                  </td>
                  <td>
                    <div className="tags" style={{ marginTop: 0 }}>
                      {(item.keywords || []).slice(0, 3).map((kw, i) => (
                        <span key={i} className="tag">{kw}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteSingle(item._id)}
                      disabled={deletingId === item._id}
                      title="Delete"
                    >
                      {deletingId === item._id
                        ? <div className="spinner" style={{ width: 13, height: 13, borderTopColor: 'var(--danger)' }} />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem 0' }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}
