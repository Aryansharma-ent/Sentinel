import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Shield, Brain, Activity, Sparkles } from 'lucide-react';
import sentinelLogo from '../assets/sentinel.png';

/* ─── Framer variants ────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay } }
});

/* ─── Feature pills row ──────────────────────────── */
const CHIPS = [
  { label: 'Sentiment Analysis',   color: '#8b5cf6' },
  { label: 'Emotion Detection',    color: '#10b981' },
  { label: 'Toxicity Guard',       color: '#ef4444' },
  { label: 'Spam & Phishing',      color: '#f59e0b' },
  { label: 'Readability Scoring',  color: '#3b82f6' },
  { label: 'Keyword Extraction',   color: '#ec4899' },
];

/* ─── Feature section items ──────────────────────── */
const FEATURES = [
  {
    icon: Brain,
    accent: '#8b5cf6',
    title: 'Multi-Class NLP Models',
    body: 'Scikit-Learn Logistic Regression trained on 416K+ real-world records with N-Gram TF-IDF feature extraction achieving 90%+ accuracy across all classes.',
  },
  {
    icon: Shield,
    accent: '#ef4444',
    title: 'Real-Time Safety Engine',
    body: 'Dual-layer toxicity and spam detection combining high-precision pattern matching with ML inference — flags threats in under 100ms.',
  },
  {
    icon: Activity,
    accent: '#10b981',
    title: 'Live Analytics Dashboard',
    body: 'MongoDB Aggregation Pipelines power real-time Chart.js dashboards with sentiment ratios, emotion distributions, and keyword frequency heatmaps.',
  },
];

/* ─── Mock terminal output ───────────────────────── */
const MOCK_RESULT = [
  { label: 'sentiment',  value: 'positive',   color: '#10b981' },
  { label: 'emotion',    value: 'joy',         color: '#f59e0b' },
  { label: 'toxicity',   value: 'safe',        color: '#10b981' },
  { label: 'spam',       value: 'legit',       color: '#10b981' },
  { label: 'readability',value: 'Standard',    color: '#3b82f6' },
  { label: 'confidence', value: '91.4%',       color: '#8b5cf6' },
];

/* ─── Stat counters ──────────────────────────────── */
const STATS = [
  { value: '416K',   label: 'Training Records' },
  { value: '6',      label: 'AI Microservices' },
  { value: '90.6%',  label: 'Model Accuracy' },
  { value: '<100ms', label: 'Response Time' },
];

export default function LandingPage({ onLaunch }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#e5e5e5',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflowX: 'hidden',
    }}>

      {/* ── Grid background pattern ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* ── Radial glow ── */}
      <div style={{
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Sticky Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1.25rem, 4vw, 3rem)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src={sentinelLogo} alt="SENTINEL" style={{ width: 30, height: 30, borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '15px', letterSpacing: '0.06em', color: '#fff' }}>
            SENTINEL
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <button
            onClick={() => onLaunch('dashboard')}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', padding: '0.45rem 1rem',
              borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            Dashboard
          </button>
          <button
            onClick={() => onLaunch('analyzer')}
            style={{
              background: '#fff', border: 'none',
              color: '#000', padding: '0.45rem 1.1rem',
              borderRadius: '8px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Open App <ArrowRight size={13} />
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: '820px', margin: '0 auto',
        padding: 'clamp(5rem, 12vw, 9rem) clamp(1.25rem, 4vw, 2rem) 0',
        textAlign: 'center',
      }}>
        <motion.div variants={fadeUp(0)} initial="hidden" animate="show">
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.8rem', borderRadius: '999px',
            border: '1px solid rgba(139,92,246,0.35)',
            background: 'rgba(139,92,246,0.08)',
            color: '#a78bfa', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.04em', marginBottom: '2rem',
          }}>
            <Sparkles size={12} /> NLP Intelligence Platform
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
            fontWeight: 800,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            color: '#fff',
            marginBottom: '1.5rem',
          }}>
            Understand any text in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              milliseconds
            </span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.65,
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
          }}>
            SENTINEL runs 6 parallel AI engines — emotion, sentiment, toxicity, spam, readability, and keyword extraction — against any piece of text, simultaneously.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onLaunch('analyzer')}
              style={{
                background: '#fff', border: 'none', color: '#000',
                padding: '0.8rem 1.75rem', borderRadius: '10px',
                fontSize: '14.5px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.15s ease',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 4px 24px rgba(139,92,246,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Zap size={15} /> Try it now — it&apos;s free
            </button>
            <button
              onClick={() => onLaunch('dashboard')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.75)',
                padding: '0.8rem 1.75rem', borderRadius: '10px',
                fontSize: '14.5px', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            >
              View live dashboard
            </button>
          </div>
        </motion.div>

        {/* ── Feature chips strip ── */}
        <motion.div variants={fadeUp(0.15)} initial="hidden" animate="show"
          style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
          {CHIPS.map((c, i) => (
            <span key={i} style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: c.color,
              background: `${c.color}14`,
              border: `1px solid ${c.color}30`,
              letterSpacing: '0.02em',
            }}>{c.label}</span>
          ))}
        </motion.div>
      </section>

      {/* ── Mock Demo Panel ── */}
      <motion.section
        variants={fadeUp(0.2)} initial="hidden" animate="show"
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: '760px', margin: '4rem auto 0',
          padding: '0 clamp(1.25rem, 4vw, 2rem)',
        }}
      >
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#0a0a0a',
          boxShadow: '0 0 0 1px rgba(139,92,246,0.1), 0 24px 80px rgba(0,0,0,0.6)',
        }}>
          {/* Window chrome */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#0e0e0e',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
            <span style={{ marginLeft: '0.5rem', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
              SENTINEL Analyzer — Live Result
            </span>
          </div>
          {/* Input preview */}
          <div style={{ padding: '1.25rem 1.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.75rem' }}>
              &gt; input text
            </p>
            <p style={{
              fontSize: '14px', color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.5, marginBottom: '1.25rem',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              fontStyle: 'italic',
            }}>
              "I absolutely loved this product! The quality exceeded my expectations and the team was incredibly helpful throughout."
            </p>
          </div>
          {/* Results grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
          }}>
            {MOCK_RESULT.map((r, i) => (
              <div key={i} style={{
                padding: '1rem 1.25rem',
                borderRight: i % 3 !== 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: r.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Stats bar ── */}
      <motion.section
        variants={fadeUp(0.25)} initial="hidden" animate="show"
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: '760px', margin: '4rem auto',
          padding: '0 clamp(1.25rem, 4vw, 2rem)',
        }}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '1.75rem 1.25rem',
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem', letterSpacing: '0.03em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Features ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: '900px', margin: '0 auto',
        padding: '0 clamp(1.25rem, 4vw, 2rem) 6rem',
      }}>
        <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>
            Built for Analysis
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em', color: '#fff' }}>
            Everything you need to understand text
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp(0.1 * i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{ background: '#000', padding: '2rem 1.75rem' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${f.accent}15`,
                  border: `1px solid ${f.accent}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.accent, marginBottom: '1.25rem',
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '0.625rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        padding: '0 clamp(1.25rem, 4vw, 2rem) 7rem',
      }}>
        <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{
            maxWidth: '580px', margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '3.5rem 2rem',
            background: 'linear-gradient(180deg, #0d0d0d 0%, #000 100%)',
          }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.875rem' }}>
              Start analyzing text now
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '2rem' }}>
              No setup required. Paste any text and get instant multi-dimensional AI analysis.
            </p>
            <button
              onClick={() => onLaunch('analyzer')}
              style={{
                background: '#fff', border: 'none', color: '#000',
                padding: '0.9rem 2rem', borderRadius: '10px',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 0 30px rgba(139,92,246,0.2)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Zap size={16} /> Use It Now <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '1.75rem clamp(1.25rem, 4vw, 3rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={sentinelLogo} alt="SENTINEL" style={{ width: 22, height: 22, borderRadius: 5, objectFit: 'contain' }} />
          <span style={{ fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SENTINEL</span>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          Built with React · Flask · Express · MongoDB
        </span>
      </footer>

    </div>
  );
}
