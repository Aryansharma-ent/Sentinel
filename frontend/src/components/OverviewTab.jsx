import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart2, Smile, ShieldAlert, BookOpen, Tag, Cpu, Layers, Database, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import sentinelLogo from '../assets/sentinel.png';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const FEATURES = [
  {
    icon: Smile,
    color: '#10b981',
    title: '6-Class Emotion Engine',
    desc: 'Multi-class classification predicting Joy, Sadness, Anger, Fear, Love, and Surprise with complete Softmax probability breakdown bars.'
  },
  {
    icon: Zap,
    color: '#8b5cf6',
    title: 'N-Gram Sentiment Analysis',
    desc: 'Trained on 50,000 IMDB movie reviews using N-Gram TF-IDF (1,2) features for high-precision positive and negative detection.'
  },
  {
    icon: ShieldAlert,
    color: '#ef4444',
    title: 'Toxicity & Harassment Guard',
    desc: 'Scans text for profanity, toxic insults, and offensive speech patterns to protect online platforms in real-time.'
  },
  {
    icon: ShieldAlert,
    color: '#f59e0b',
    title: 'Spam & Phishing Detector',
    desc: 'Identifies suspicious URLs, scam presets, and phishing attempts using hybrid regex and Machine Learning models.'
  },
  {
    icon: BookOpen,
    color: '#3b82f6',
    title: 'Readability & Grade Level',
    desc: 'Computes Flesch-Kincaid readability ease scores, grade level difficulty, word counts, and sentence complexity.'
  },
  {
    icon: Tag,
    color: '#ec4899',
    title: 'Key Term Extraction',
    desc: 'Extracts core descriptive keywords while filtering conversational noise and stop-words server-side.'
  }
];

const ARCHITECTURE_STEPS = [
  { step: '01', title: 'User Input', desc: 'React SPA sends text payload via Axios' },
  { step: '02', title: 'Express Gateway', desc: 'Node.js orchestrates parallel Promise.all HTTP requests' },
  { step: '03', title: 'Python Microservice', desc: '4 Flask endpoints evaluate Scikit-Learn .pkl models' },
  { step: '04', title: 'MongoDB Storage', desc: 'Results saved & aggregated via $facet pipelines' }
];

const TEAM_ROLES = [
  { name: 'Member 1', role: 'ML Lead', task: '6-Class Emotion & Sentiment Engine (train_emotion.py)' },
  { name: 'Member 2', role: 'AI Security Lead', task: 'Toxicity & Spam Classifier (train_spam.py)' },
  { name: 'Member 3', role: 'Backend Lead', task: 'Express API Gateway & Parallel Orchestration' },
  { name: 'Member 4', role: 'Data Lead', task: 'MongoDB Schemas & Multi-Stage Aggregation' },
  { name: 'Member 5', role: 'UI/UX Lead', task: 'React Vercel Theme & Chart.js Analytics' }
];

export default function OverviewTab({ onNavigate }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      
      {/* Hero Section */}
      <motion.div variants={fadeUp} className="card" style={{ padding: '2.5rem 2rem', marginBottom: '1.5rem', background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <img src={sentinelLogo} alt="SENTINEL Logo" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'contain' }} />
          <span className="badge" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
            ⚡ Multi-Service AI Platform
          </span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '0.875rem' }}>
          Real-Time Text Intelligence & Security Engine
        </h1>

        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          SENTINEL is an enterprise-grade NLP platform combining 6 parallel Python microservices, 416,800-record training datasets, and MongoDB Aggregation Pipelines into a unified SaaS dashboard.
        </p>

        <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onNavigate('analyzer')} style={{ padding: '0.65rem 1.25rem', fontSize: '13.5px' }}>
            <Zap size={15} /> Run Live Analyzer <ArrowRight size={14} />
          </button>
          <button className="btn-ghost" onClick={() => onNavigate('dashboard')} style={{ padding: '0.65rem 1.25rem', fontSize: '13.5px' }}>
            <BarChart2 size={15} /> View Analytics Dashboard
          </button>
        </div>
      </motion.div>

      {/* Feature Grid (6 Cards) */}
      <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
        <div className="page-eyebrow">Capabilities</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '1rem' }}>
          6-in-1 Parallel Intelligence Engines
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div className="card" key={i} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                    <Icon size={16} />
                  </div>
                  <h3 style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{f.title}</h3>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Architecture Flow */}
      <motion.div variants={fadeUp} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="page-eyebrow">System Design</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '1.25rem' }}>
          Microservice Dataflow Architecture
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {ARCHITECTURE_STEPS.map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: '700' }}>{s.step}</span>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.25rem', marginBottom: '0.25rem' }}>{s.title}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5-Member Engineering Team Division */}
      <motion.div variants={fadeUp} className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Users size={16} style={{ color: 'var(--accent)' }} />
          <div className="page-eyebrow" style={{ marginBottom: 0 }}>Team Engineering Roles</div>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '1.25rem' }}>
          5-Member Capstone Division of Labor
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {TEAM_ROLES.map((t, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{t.name}</strong>
                <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '0.1rem 0.4rem' }}>{t.role}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{t.task}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
