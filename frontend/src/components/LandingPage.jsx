import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
      style={{ maxWidth: 320, display: 'block', margin: '0 auto', overflow: 'visible' }}
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
        <filter id="blur1"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Outer glow halo */}
      <circle cx="150" cy="150" r="130" fill="url(#coreGlow)" opacity="0.4" />

      {/* Ring 1 — slow clockwise */}
      <g style={{ transformOrigin: '150px 150px', animation: 'spin1 8s linear infinite' }}>
        <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth="1" />
        <circle cx="150" cy="30"  r="4"   fill="#8b5cf6" opacity="0.9" filter="url(#glow)" />
        <circle cx="150" cy="270" r="3"   fill="#8b5cf6" opacity="0.5" />
      </g>

      {/* Ring 2 — medium counter-clockwise */}
      <g style={{ transformOrigin: '150px 150px', animation: 'spin2 5s linear infinite' }}>
        <circle cx="150" cy="150" r="95"  fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="8 12" />
        <circle cx="245" cy="150" r="5"   fill="#06b6d4" opacity="0.9" filter="url(#glow)" />
        <circle cx="55"  cy="150" r="3"   fill="#06b6d4" opacity="0.5" />
      </g>

      {/* Ring 3 — fast clockwise */}
      <g style={{ transformOrigin: '150px 150px', animation: 'spin3 3s linear infinite' }}>
        <circle cx="150" cy="150" r="70"  fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" strokeDasharray="4 8" />
        <circle cx="150" cy="80"  r="4.5" fill="#a78bfa" opacity="0.8" filter="url(#glow)" />
        <circle cx="220" cy="150" r="3"   fill="#a78bfa" opacity="0.6" />
      </g>

      {/* Hex decoration ring */}
      <g style={{ transformOrigin: '150px 150px', animation: 'spin1 15s linear infinite reverse' }}>
        <circle cx="150" cy="150" r="50"  fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="1" strokeDasharray="2 6" />
      </g>

      {/* Core pulse circle */}
      <circle cx="150" cy="150" r="32"
        fill="none"
        stroke={processing ? '#06b6d4' : '#8b5cf6'}
        strokeWidth="1.5"
        style={{ animation: 'coreRing 2s ease-in-out infinite' }}
      />

      {/* Inner glow */}
      <circle cx="150" cy="150" r="20" fill="url(#pulseGlow)" />
      <circle cx="150" cy="150" r="12" fill={processing ? '#06b6d4' : '#8b5cf6'} opacity={processing ? "0.9" : "0.7"}
        style={{ animation: 'corePulse 1.5s ease-in-out infinite' }}
        filter="url(#glow)"
      />

      {/* Data arc lines */}
      <line x1="150" y1="118" x2="150" y2="95"  stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
      <line x1="180" y1="127" x2="197" y2="114" stroke="rgba(6,182,212,0.4)"   strokeWidth="1" />
      <line x1="120" y1="127" x2="103" y2="114" stroke="rgba(6,182,212,0.4)"   strokeWidth="1" />

      {/* Tick marks on outer ring */}
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
  const [tick,           setTick]           = useState(0);

  /* Cycle: show input → process → show output → repeat */
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

  /* Scanline tick */
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const outputs = OUTPUT_SETS[outputSet];

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000',
      color: '#e5e5e5',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* ═══ KEYFRAME STYLES ═══ */}
      <style>{`
        @keyframes spin1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin2 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes spin3 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes corePulse {
          0%, 100% { opacity: 0.7; r: 12; }
          50%       { opacity: 1;   r: 16; }
        }
        @keyframes coreRing {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes fadeStream {
          0%   { opacity: 0; transform: translateX(-6px); }
          15%  { opacity: 1; transform: translateX(0); }
          80%  { opacity: 1; }
          100% { opacity: 0.2; }
        }
        @keyframes scanlineMove {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes activeGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(6,182,212,0.3); }
          50%       { box-shadow: 0 0 18px rgba(6,182,212,0.7), 0 0 40px rgba(6,182,212,0.2); }
        }
        @keyframes dataFlow {
          0%   { opacity: 0; transform: translateX(-20px); }
          20%  { opacity: 1; transform: translateX(0); }
          80%  { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(20px); }
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
        padding: '0 2rem', height: '52px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}>
        {/* Left: logo + mission label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src={sentinelLogo} alt="SENTINEL" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em', color: '#fff' }}>
              SENTINEL
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['INPUT STREAM', 'ML ENGINE', 'OUTPUT ANALYSIS'].map((label, i) => (
              <span key={i} style={{
                fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'JetBrains Mono, monospace',
                color: i === 1 ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                fontWeight: 700,
              }}>{label}</span>
            ))}
          </div>
        </div>

        {/* Right: system status + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

      {/* ═══ MAIN HEADLINE (spans above the 3-panel) ═══ */}
      <div style={{
        position: 'relative', zIndex: 5,
        padding: '1.5rem 2rem 0.5rem',
        flexShrink: 0,
      }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: '#fff',
          lineHeight: 1,
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
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr 1fr',
        gap: 0,
        position: 'relative', zIndex: 5,
        overflow: 'hidden',
        minHeight: 0,
      }}>

        {/* ── LEFT: INPUT STREAM ── */}
        <div style={{
          borderRight: '1px solid rgba(139,92,246,0.15)',
          padding: '1.5rem 1.5rem 1rem',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Panel label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              RAW INPUT STREAM
            </span>
          </div>

          {/* Active input highlight */}
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

          {/* Queue */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            {INPUT_FRAGMENTS.slice(0, 8).map((text, i) => (
              <StreamLine
                key={i}
                text={text.slice(0, 48)}
                delay={i * 0.3}
                dim={i > 3}
              />
            ))}
          </div>

          {/* Gradient fade bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, #000)', pointerEvents: 'none' }} />
        </div>

        {/* ── CENTER: ENGINE ── */}
        <div style={{
          borderRight: '1px solid rgba(6,182,212,0.15)',
          padding: '1rem 1rem 0.75rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.05) 0%, transparent 70%)',
        }}>
          {/* Panel label */}
          <div style={{ position: 'absolute', top: '1.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: processing ? '#f59e0b' : '#06b6d4', boxShadow: processing ? '0 0 8px #f59e0b' : '0 0 8px #06b6d4', transition: 'all 0.3s ease' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              {processing ? 'COMPUTING...' : 'ML ENGINE ACTIVE'}
            </span>
          </div>

          {/* SVG Engine */}
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <EngineCore processing={processing} />
          </div>

          {/* Processing data flow text */}
          <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {['TF-IDF', 'N-GRAM', 'SOFTMAX'].map((label, i) => (
              <span key={i} style={{
                fontSize: '9px',
                fontFamily: 'JetBrains Mono, monospace',
                color: processing ? '#06b6d4' : 'rgba(255,255,255,0.2)',
                letterSpacing: '0.08em',
                fontWeight: 700,
                transition: 'color 0.3s ease',
                animation: processing ? `blink ${0.5 + i * 0.2}s ease-in-out infinite` : 'none',
              }}>{label}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: OUTPUT ANALYSIS ── */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Panel label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              OUTPUT ANALYSIS
            </span>
          </div>

          {/* Output rows */}
          <AnimatePresence mode="wait">
            {outputVisible && (
              <motion.div
                key={outputSet}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}
              >
                {outputs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.6rem 0.875rem',
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
                      <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: item.color, letterSpacing: '0.06em' }}>
                        {item.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Historical log */}
          <div style={{ flex: 1, marginTop: '1rem', overflow: 'hidden', position: 'relative' }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
              — PREVIOUS RESULTS —
            </div>
            {OUTPUT_SETS.map((set, si) => si !== outputSet && (
              <div key={si} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                {set.slice(0, 3).map((item, ii) => (
                  <span key={ii} style={{
                    fontSize: '9.5px', fontFamily: 'JetBrains Mono, monospace',
                    color: `${item.color}55`, padding: '0.15rem 0.4rem',
                    border: `1px solid ${item.color}15`, borderRadius: '3px',
                    letterSpacing: '0.04em',
                  }}>
                    {item.value}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Gradient fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, #000)', pointerEvents: 'none' }} />
        </div>

      </div>

      {/* ═══ BOTTOM STATUS BAR ═══ */}
      <div style={{
        position: 'relative', zIndex: 10,
        height: '40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', flexShrink: 0,
      }}>
        {/* Left: stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { label: 'RECORDS', value: '416,809' },
            { label: 'ENGINES', value: '6 ACTIVE' },
            { label: 'ACCURACY', value: '90.6%' },
            { label: 'LATENCY', value: '<100ms' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>{s.label}</span>
              <span style={{ fontSize: '9px', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Right: CTA */}
        <button
          onClick={() => onLaunch('analyzer')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#a78bfa',
            padding: '0.3rem 0.875rem',
            borderRadius: '5px',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
        >
          LAUNCH ANALYZER <ArrowRight size={10} />
        </button>
      </div>

    </div>
  );
}
