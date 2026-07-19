import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BarChart2, Smile, ShieldAlert, BookOpen, Tag, ArrowRight, CheckCircle2, Shield, Activity, Sparkles, LayoutDashboard } from 'lucide-react';
import sentinelLogo from '../assets/sentinel.png';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

const FEATURES = [
  {
    icon: Smile,
    color: '#10b981',
    title: '6-Class Emotion Engine',
    desc: 'Multi-class classification predicting Joy, Sadness, Anger, Fear, Love, and Surprise with full Softmax probability breakdown bars.'
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

export default function LandingPage({ onLaunch }) {
  return (
    <div className="landing-root" style={{ minHeight: '100vh', background: '#000000', color: '#ededed', overflowX: 'hidden' }}>
      
      {/* ── Top Header Bar ── */}
      <header style={{
        height: '64px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={sentinelLogo} alt="SENTINEL Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '18px', fontWeight: '800', letterSpacing: '0.04em', color: '#ffffff' }}>
            SENTINEL
          </span>
        </div>

        <button className="btn-primary" onClick={() => onLaunch('analyzer')} style={{ padding: '0.55rem 1.25rem', fontSize: '13px' }}>
          <Sparkles size={14} /> Launch App <ArrowRight size={14} />
        </button>
      </header>

      {/* ── Main Hero Section ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem 6rem 1.5rem' }}>
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Hero Banner */}
          <motion.div variants={fadeUp} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 5rem auto' }}>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontSize: '12px', fontWeight: '600', marginBottom: '1.5rem' }}>
              <Zap size={13} /> Enterprise Multi-Service NLP Engine
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '800',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '1.25rem'
            }}>
              Real-Time Text Intelligence & Security Platform
            </h1>

            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.25rem'
            }}>
              SENTINEL orchestrates 6 parallel Python AI microservices, 416,800-record NLP models, and MongoDB Aggregation Pipelines into a unified workspace.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => onLaunch('analyzer')}
                style={{ padding: '0.85rem 1.85rem', fontSize: '15px', fontWeight: '700', borderRadius: 'var(--radius-lg)' }}
              >
                <Zap size={17} /> Use It Now — Run Analyzer <ArrowRight size={16} />
              </button>
              <button
                className="btn-ghost"
                onClick={() => onLaunch('dashboard')}
                style={{ padding: '0.85rem 1.85rem', fontSize: '15px', fontWeight: '600', borderRadius: 'var(--radius-lg)' }}
              >
                <LayoutDashboard size={17} /> View Analytics Dashboard
              </button>
            </div>

          </motion.div>

          {/* Feature Grid Section */}
          <motion.div variants={fadeUp} style={{ marginBottom: '5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="page-eyebrow">Capabilities</div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                6 Parallel Microservice Engines
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div className="card" key={i} style={{ padding: '1.5rem', background: '#0a0a0a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                        <Icon size={18} />
                      </div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{f.title}</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Architecture Flow Section */}
          <motion.div variants={fadeUp} className="card" style={{ padding: '2.5rem', background: '#0a0a0a', marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div className="page-eyebrow">System Architecture</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Microservice Dataflow Pipeline
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {ARCHITECTURE_STEPS.map((s, i) => (
                <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: '700' }}>{s.step}</span>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.35rem', marginBottom: '0.35rem' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Call to Action Banner */}
          <motion.div variants={fadeUp} className="card" style={{ padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)', borderColor: 'var(--border-strong)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#ffffff', marginBottom: '0.75rem' }}>
              Ready to test SENTINEL text intelligence?
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Analyze sentiment, emotions, safety, spam risk, and readability in real-time.
            </p>
            <button
              className="btn-primary"
              onClick={() => onLaunch('analyzer')}
              style={{ padding: '0.85rem 2rem', fontSize: '15px', fontWeight: '700', borderRadius: 'var(--radius-lg)', margin: '0 auto' }}
            >
              <Zap size={17} /> Use It Now <ArrowRight size={16} />
            </button>
          </motion.div>

        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12.5px' }}>
        SENTINEL Multi-Service Text Intelligence Platform • Built with React, Express, Python Flask & MongoDB
      </footer>

    </div>
  );
}
