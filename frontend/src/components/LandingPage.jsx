import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Smile, Zap, Shield, AlertOctagon, BookOpen, Tag } from 'lucide-react';
import sentinelLogo from '../assets/sentinel.png';

/* ─── Sample input text fragments cycling left panel ─── */
const INPUT_FRAGMENTS = [
  "I absolutely loved this product, the quality was outstanding...",
  "This is a complete scam, click here for free money!!!",
  "Feeling so overwhelmed today, can't stop crying...",
  "Visit https://win-prize.biz/claim to get your reward now",
  "The customer service team went above and beyond expectations.",
  "I hate everything about this, it's completely broken garbage.",
  "Just found out I got the job! So incredibly happy right now!",
  "You're such an idiot, no one wants to hear from you.",
  "The delivery was delayed by two weeks with no communication.",
  "Surprised by how well this actually works honestly wow.",
];

/* ─── Output labels cycling right panel ─── */
const OUTPUT_SETS = [
  [
    { label: 'SENTIMENT', value: 'POSITIVE', color: '#10b981' },
    { label: 'EMOTION',   value: 'JOY',      color: '#f59e0b' },
    { label: 'TOXICITY',  value: 'SAFE',     color: '#10b981' },
    { label: 'SPAM',      value: 'LEGIT',    color: '#10b981' },
    { label: 'CONFIDENCE',value: '91.4%',    color: '#a78bfa' },
  ],
  [
    { label: 'SENTIMENT', value: 'NEGATIVE', color: '#ef4444' },
    { label: 'EMOTION',   value: 'ANGER',    color: '#ef4444' },
    { label: 'TOXICITY',  value: 'TOXIC',    color: '#ef4444' },
    { label: 'SPAM',      value: 'SPAM',     color: '#f59e0b' },
    { label: 'CONFIDENCE',value: '87.2%',    color: '#a78bfa' },
  ],
  [
    { label: 'SENTIMENT', value: 'NEGATIVE', color: '#ef4444' },
    { label: 'EMOTION',   value: 'SADNESS',  color: '#3b82f6' },
    { label: 'TOXICITY',  value: 'SAFE',     color: '#10b981' },
    { label: 'SPAM',      value: 'LEGIT',    color: '#10b981' },
    { label: 'CONFIDENCE',value: '93.8%',    color: '#a78bfa' },
  ],
  [
    { label: 'SENTIMENT', value: 'POSITIVE', color: '#10b981' },
    { label: 'EMOTION',   value: 'SURPRISE', color: '#f59e0b' },
    { label: 'TOXICITY',  value: 'SAFE',     color: '#10b981' },
    { label: 'SPAM',      value: 'LEGIT',    color: '#10b981' },
    { label: 'CONFIDENCE',value: '88.6%',    color: '#a78bfa' },
  ],
];

/* ─── Animated SVG engine rings ─── */
function EngineCore({ processing }) {
  return (
    <svg
      viewBox="0 0 300 300"
      width="100%"
      style={{ maxWidth: 280, display: 'block', margin: '0 auto', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#06b6d4" stopOpacity={processing ? "0.9" : "0.4"} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      <circle cx="150" cy="150" r="130" fill="url(#coreGlow)" opacity="0.4" />

      <g style={{ transformOrigin: '150px 150px', animation: 'spin1 8s linear infinite' }}>
        <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth="1" />
        <circle cx="150" cy="30"  r="4"   fill="#8b5cf6" opacity="0.9" filter="url(#glow)" />
        <circle cx="150" cy="270" r="3"   fill="#8b5cf6" opacity="0.5" />
      </g>

      <g style={{ transformOrigin: '150px 150px', animation: 'spin2 5s linear infinite' }}>
        <circle cx="150" cy="150" r="95"  fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="8 12" />
        <circle cx="245" cy="150" r="5"   fill="#06b6d4" opacity="0.9" filter="url(#glow)" />
        <circle cx="55"  cy="150" r="3"   fill="#06b6d4" opacity="0.5" />
      </g>

      <g style={{ transformOrigin: '150px 150px', animation: 'spin3 3s linear infinite' }}>
        <circle cx="150" cy="150" r="70"  fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" strokeDasharray="4 8" />
        <circle cx="150" cy="80"  r="4.5" fill="#a78bfa" opacity="0.8" filter="url(#glow)" />
        <circle cx="220" cy="150" r="3"   fill="#a78bfa" opacity="0.6" />
      </g>

      <g style={{ transformOrigin: '150px 150px', animation: 'spin1 15s linear infinite reverse' }}>
        <circle cx="150" cy="150" r="50"  fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="1" strokeDasharray="2 6" />
      </g>

      <circle cx="150" cy="150" r="32"
        fill="none"
        stroke={processing ? '#06b6d4' : '#8b5cf6'}
        strokeWidth="1.5"
        style={{ animation: 'coreRing 2s ease-in-out infinite' }}
      />

      <circle cx="150" cy="150" r="20" fill="url(#pulseGlow)" />
      <circle cx="150" cy="150" r="12" fill={processing ? '#06b6d4' : '#8b5cf6'} opacity={processing ? "0.9" : "0.7"}
        style={{ animation: 'corePulse 1.5s ease-in-out infinite' }}
        filter="url(#glow)"
      />

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r1 = 125, r2 = i % 6 === 0 ? 133 : 129;
        return (
          <line
            key={i}
            x1={150 + Math.cos(angle) * r1}
            y1={150 + Math.sin(angle) * r1}
            x2={150 + Math.cos(angle) * r2}
            y2={150 + Math.sin(angle) * r2}
            stroke={i % 6 === 0 ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.2)"}
            strokeWidth={i % 6 === 0 ? "2" : "1"}
          />
        );
      })}
    </svg>
  );
}

/* ─── Streaming text line ─── */
function StreamLine({ text, delay, dim }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      color: dim ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
      lineHeight: 1.8,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      animation: `fadeStream ${2 + delay}s ease-in-out infinite`,
      animationDelay: `${delay * 0.4}s`,
    }}>
      <span style={{ color: dim ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.7)', marginRight: '0.5rem' }}>›</span>
      {text}
    </div>
  );
}

/* ─── Main Component ─── */
export default function LandingPage({ onLaunch }) {
  const [activeInput,    setActiveInput]    = useState(0);
  const [outputSet,      setOutputSet]      = useState(0);
  const [processing,     setProcessing]     = useState(false);
  const [outputVisible,  setOutputVisible]  = useState(true);

  useEffect(() => {
    const cycle = () => {
      setOutputVisible(false);
      setProcessing(true);
      setTimeout(() => {
        setActiveInput(i => (i + 1) % INPUT_FRAGMENTS.length);
        setProcessing(false);
      }, 900);
      setTimeout(() => {
        setOutputSet(o => (o + 1) % OUTPUT_SETS.length);
        setOutputVisible(true);
      }, 1100);
    };
    const id = setInterval(cycle, 3200);
    return () => clearInterval(id);
  }, []);

  const outputs = OUTPUT_SETS[outputSet];

  return (
    <div className="sci-fi-landing">

      {/* ═══ KEYFRAME & RESPONSIVE STYLES ═══ */}
      <style>{`
        .sci-fi-landing {
          min-height: 100vh;
          width: 100%;
          background: #000;
          color: #e5e5e5;
          font-family: 'Inter', -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        .control-hero-section {
          min-height: calc(100vh - 52px);
          display: flex;
          flex-direction: column;
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .control-room-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1.1fr 1fr;
          position: relative;
          z-index: 5;
          min-height: 0;
        }

        .control-header-nav {
          display: flex;
          gap: 1.25rem;
        }

        .control-status-bar {
          position: relative;
          z-index: 10;
          min-height: 44px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .status-items-group {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        @keyframes spin1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spin3 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes corePulse { 0%, 100% { opacity: 0.7; r: 12; } 50% { opacity: 1; r: 16; } }
        @keyframes coreRing { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes fadeStream { 0% { opacity: 0; transform: translateX(-6px); } 15% { opacity: 1; transform: translateX(0); } 80% { opacity: 1; } 100% { opacity: 0.2; } }
        @keyframes scanlineMove { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes activeGlow { 0%, 100% { box-shadow: 0 0 6px rgba(6,182,212,0.3); } 50% { box-shadow: 0 0 18px rgba(6,182,212,0.7), 0 0 40px rgba(6,182,212,0.2); } }

        /* ── Mobile & Tablet Responsiveness ── */
        @media (max-width: 900px) {
          .control-room-grid {
            grid-template-columns: 1fr;
          }

          .control-header-nav {
            display: none;
          }

          .panel-left, .panel-center, .panel-right {
            border-right: none !important;
            border-bottom: 1px solid rgba(139,92,246,0.15);
            padding: 1.25rem 1rem !important;
          }

          .control-status-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .status-items-group {
            justify-content: center;
            gap: 1rem;
          }
        }
      `}</style>

      {/* ═══ SCANLINE OVERLAY ═══ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 41, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)',
        animation: 'scanlineMove 6s linear infinite',
      }} />

      {/* ═══ GRID BACKGROUND ═══ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* ═══ TOP HEADER ═══ */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem', height: '52px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}>
        {/* Left: logo + mission label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src={sentinelLogo} alt="SENTINEL" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em', color: '#fff' }}>
              SENTINEL
            </span>
          </div>
          <div className="control-header-nav">
            {['INPUT STREAM', 'ML ENGINE', 'OUTPUT ANALYSIS'].map((label, i) => (
              <span key={i} style={{
                fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'JetBrains Mono, monospace',
                color: i === 1 ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                fontWeight: 700,
              }}>{label}</span>
            ))}
          </div>
        </div>

        {/* Right: status + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: processing ? '#f59e0b' : '#10b981',
              boxShadow: processing ? '0 0 8px #f59e0b' : '0 0 8px #10b981',
              transition: 'all 0.3s ease',
            }} />
            <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.3)' }}>
              {processing ? 'PROCESSING' : 'ONLINE'}
            </span>
          </div>
          <button
            onClick={() => onLaunch('analyzer')}
            style={{
              background: '#fff', border: 'none', color: '#000',
              padding: '0.4rem 0.9rem', borderRadius: '6px',
              fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.03em',
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Open App <ArrowRight size={11} />
          </button>
        </div>
      </header>

      {/* ═══ MAIN HEADLINE ═══ */}
      <div style={{
        position: 'relative', zIndex: 5,
        padding: '1.25rem 1.25rem 0.5rem',
        flexShrink: 0,
      }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(1.35rem, 3.5vw, 2.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#fff',
          lineHeight: 1.1,
          margin: 0,
        }}>
          UNDERSTANDING LANGUAGE{' '}
          <span style={{
            background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AT MACHINE SPEED
          </span>
        </h1>
      </div>

      {/* ═══ THREE-PANEL CONTROL ROOM ═══ */}
      <div className="control-room-grid">

        {/* ── LEFT: INPUT STREAM ── */}
        <div className="panel-left" style={{
          borderRight: '1px solid rgba(139,92,246,0.15)',
          padding: '1.25rem 1.25rem 1rem',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              RAW INPUT STREAM
            </span>
          </div>

          <div style={{
            background: 'rgba(139,92,246,0.07)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '1rem',
            flexShrink: 0,
            animation: 'activeGlow 2s ease-in-out infinite',
          }}>
            <div style={{ fontSize: '9px', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.4rem', letterSpacing: '0.1em' }}>
              ANALYZING ›
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontFamily: 'JetBrains Mono, monospace' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeInput}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  "{INPUT_FRAGMENTS[activeInput].slice(0, 60)}{INPUT_FRAGMENTS[activeInput].length > 60 ? '...' : ''}"
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            {INPUT_FRAGMENTS.slice(0, 6).map((text, i) => (
              <StreamLine
                key={i}
                text={text.slice(0, 48)}
                delay={i * 0.3}
                dim={i > 3}
              />
            ))}
          </div>
        </div>

        {/* ── CENTER: ENGINE ── */}
        <div className="panel-center" style={{
          borderRight: '1px solid rgba(6,182,212,0.15)',
          padding: '1rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.05) 0%, transparent 70%)',
          minHeight: '260px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: processing ? '#f59e0b' : '#06b6d4', boxShadow: processing ? '0 0 8px #f59e0b' : '0 0 8px #06b6d4', transition: 'all 0.3s ease' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              {processing ? 'COMPUTING...' : 'ML ENGINE ACTIVE'}
            </span>
          </div>

          <div style={{ width: '100%', maxWidth: '260px' }}>
            <EngineCore processing={processing} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '0.75rem' }}>
            {['TF-IDF', 'N-GRAM', 'SOFTMAX'].map((label, i) => (
              <span key={i} style={{
                fontSize: '9px',
                fontFamily: 'JetBrains Mono, monospace',
                color: processing ? '#06b6d4' : 'rgba(255,255,255,0.3)',
                letterSpacing: '0.08em',
                fontWeight: 700,
                transition: 'color 0.3s ease',
              }}>{label}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: OUTPUT ANALYSIS ── */}
        <div className="panel-right" style={{
          padding: '1.25rem 1.25rem 1rem',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
          minHeight: '260px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              OUTPUT ANALYSIS
            </span>
          </div>

          <div style={{ height: '215px', minHeight: '215px', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {outputVisible && (
                <motion.div
                  key={outputSet}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
                >
                  {outputs.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        background: `${item.color}08`,
                        border: `1px solid ${item.color}22`,
                        borderLeft: `2px solid ${item.color}`,
                        borderRadius: '6px',
                      }}
                    >
                      <span style={{ fontSize: '9.5px', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                        {item.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                        <span style={{ fontSize: '11.5px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: item.color, letterSpacing: '0.06em' }}>
                          {item.value}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ═══ BOTTOM STATUS BAR ═══ */}
      <div className="control-status-bar">
        <div className="status-items-group">
          {[
            { label: 'RECORDS', value: '416,809' },
            { label: 'ENGINES', value: '6 ACTIVE' },
            { label: 'ACCURACY', value: '90.6%' },
            { label: 'LATENCY', value: '<100ms' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>{s.label}</span>
              <span style={{ fontSize: '9.5px', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onLaunch('analyzer')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#a78bfa',
            padding: '0.35rem 0.875rem',
            borderRadius: '5px',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.1em',
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
        >
          LAUNCH ANALYZER <ArrowRight size={10} />
        </button>
      </div>

      {/* ═══ SECTION 2: SCROLL DOWN FEATURES SHOWCASE ═══ */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem', position: 'relative', zIndex: 5 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>
            // PARALLEL ENGINE CAPABILITIES
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            6 Microservices Working in Parallel
          </h2>
          <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Every raw text input is processed concurrently across 6 distinct Machine Learning models to deliver full multi-dimensional intelligence.
          </p>
        </div>

        {/* Feature Cards Grid (Clean Monochrome SaaS with Hollow White Outline Icons) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '5rem' }}>
          {[
            {
              icon: Smile,
              tag: '416K DATASET',
              title: '6-Class Emotion Engine',
              desc: 'Multi-class Logistic Regression trained on 416,809 records. Evaluates Joy, Sadness, Anger, Fear, Love, and Surprise with full Softmax confidence probability distributions.'
            },
            {
              icon: Zap,
              tag: '50K IMDB · TF-IDF',
              title: 'N-Gram Sentiment Classifier',
              desc: 'TF-IDF (1,2) N-gram model trained on 50,000 IMDB movie reviews achieving 89.67% accuracy for ultra-fast binary positive and negative classification.'
            },
            {
              icon: Shield,
              tag: 'REAL-TIME MODERATION',
              title: 'Toxicity & Threat Guard',
              desc: 'Real-time moderation engine that scans text for insults, profanity, harassment patterns, and offensive speech to protect digital communities.'
            },
            {
              icon: AlertOctagon,
              tag: 'HYBRID REGEX + ML',
              title: 'Spam & Phishing Detector',
              desc: 'Hybrid pattern-matching and ML pipeline identifying scam presets, phishing URLs, malicious links, and suspicious text patterns.'
            },
            {
              icon: BookOpen,
              tag: 'FLESCH-KINCAID INDEX',
              title: 'Readability & Grade Assessor',
              desc: 'Calculates Flesch-Kincaid reading ease scores, grade level difficulty, word density, and sentence complexity metrics.'
            },
            {
              icon: Tag,
              tag: 'NLP MINING ENGINE',
              title: 'Key Term Extraction',
              desc: 'Server-side NLP keyword mining engine that strips stop-words and isolates dominant descriptive concepts from raw text.'
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{
                background: 'rgba(10, 10, 10, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.background = 'rgba(14, 14, 14, 0.95)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)'; e.currentTarget.style.background = 'rgba(10, 10, 10, 0.9)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} strokeWidth={1.75} style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 600, letterSpacing: '0.08em' }}>
                    {f.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ═══ SECTION 3: SYSTEM ARCHITECTURE & DATAFLOW ═══ */}
        <div style={{ background: 'rgba(10, 10, 10, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '2.5rem 2rem', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              // ARCHITECTURE & INFRASTRUCTURE
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#ffffff' }}>
              Microservice Dataflow Pipeline
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { step: '01', title: 'React Client SPA', desc: 'Vite-powered single page interface with Framer Motion animations' },
              { step: '02', title: 'Express Gateway', desc: 'Node.js backend orchestrates parallel Promise.all HTTP microservices' },
              { step: '03', title: 'Python Flask ML', desc: '4 Flask endpoints evaluate Scikit-Learn .pkl models in parallel' },
              { step: '04', title: 'MongoDB Atlas', desc: 'Persists evaluations and runs multi-stage $facet aggregation pipelines' }
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '1.25rem' }}>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#a78bfa', fontWeight: 700 }}>{s.step}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '0.35rem', marginBottom: '0.35rem' }}>{s.title}</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 4: CALL TO ACTION BANNER ═══ */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: '3.5rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#ffffff', marginBottom: '0.75rem' }}>
            Ready to test SENTINEL text intelligence?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '540px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Run real-time multi-service predictions across sentiment, emotions, safety, and spam detection.
          </p>
          <button
            onClick={() => onLaunch('analyzer')}
            style={{ background: '#ffffff', border: 'none', color: '#000000', padding: '0.85rem 2.25rem', borderRadius: 8, fontSize: '14.5px', fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 24px rgba(139,92,246,0.3)', transition: 'all 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <ArrowRight size={16} /> Open Analyzer App
          </button>
        </div>

      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
        SENTINEL Multi-Service Text Intelligence Platform • Python Flask · Express API Gateway · MongoDB Atlas
      </footer>

    </div>
  );
}
