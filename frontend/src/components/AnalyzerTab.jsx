import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap } from 'lucide-react';

const SAMPLES = {
  positive: "This movie was absolutely fantastic! The acting was superb, and I enjoyed every single minute of it.",
  negative: "Terrible experience. The software keeps crashing and customer support completely ignored my tickets.",
  emotionJoy: "I feel so happy, thrilled, and full of life today! Everything is going wonderfully!",
  emotionFear: "I am terrified and scared of what might happen next. I sit here digging out my fears.",
  toxic: "You are a complete idiot and your work is garbage. Get off this platform, nobody likes you!",
  spam: "URGENT! You have won a $1000 Walmart Gift Card. Claim now at http://bit.ly/claim123",
};

const EMOTION_MAP = {
  joy:      { emoji: '😊', label: 'Joy',      color: 'var(--joy)' },
  anger:    { emoji: '😡', label: 'Anger',    color: 'var(--anger)' },
  fear:     { emoji: '😨', label: 'Fear',     color: 'var(--fear)' },
  sadness:  { emoji: '😢', label: 'Sadness',  color: 'var(--sadness)' },
  surprise: { emoji: '😲', label: 'Surprise', color: 'var(--surprise)' },
  love:     { emoji: '❤️', label: 'Love',     color: 'var(--love)' },
};

const getEmo = (key) => EMOTION_MAP[(key || '').toLowerCase()] || { emoji: '🎭', label: key, color: 'var(--accent)' };

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

export default function AnalyzerTab() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post('/api/analyze', { text });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-eyebrow">Multi-Service AI</div>
        <h1 className="page-title">Text Intelligence Analyzer</h1>
        <p className="page-desc">
          Run sentiment, toxicity, emotion, spam, and readability analysis in parallel via 6 AI microservices.
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleAnalyze}>
        <div className="input-card">
          <textarea
            className="input-area"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste any review, comment, tweet, or message here..."
            maxLength={2000}
          />
          <div className="input-footer">
            <div className="presets">
              <span className="preset-label">Try:</span>
              {Object.entries(SAMPLES).map(([key, val]) => (
                <button key={key} type="button" className="preset-chip" onClick={() => setText(val)}>
                  {key === 'positive' && '✨ Positive'}
                  {key === 'negative' && '❌ Negative'}
                  {key === 'emotionJoy' && '😊 Joy'}
                  {key === 'emotionFear' && '😨 Fear'}
                  {key === 'toxic' && '⚠️ Toxic'}
                  {key === 'spam' && '🚨 Spam'}
                </button>
              ))}
            </div>
            <div className="input-actions">
              <span className="char-count">{text.length}/2000</span>
              <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
                {loading ? (
                  <><div className="spinner" /> Analyzing…</>
                ) : (
                  <><Zap size={13} /> Run Analysis</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Row 1 — Sentiment + Toxicity + Spam */}
            <motion.div variants={fadeUp} className="report-grid" style={{ marginBottom: '1rem' }}>

              {/* Sentiment */}
              <div className="report-cell">
                <div className="report-cell-label">1. Sentiment</div>
                <div className={`badge ${result.sentiment === 'positive' ? 'badge-positive' : 'badge-negative'}`}>
                  {result.sentiment === 'positive' ? '😊 Positive' : '😞 Negative'}
                </div>
                <div className="meter">
                  <div className="meter-row">
                    <span>Confidence</span>
                    <strong>{Math.round(result.sentimentConfidence * 100)}%</strong>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{
                      width: `${Math.round(result.sentimentConfidence * 100)}%`,
                      background: result.sentiment === 'positive' ? 'var(--success)' : 'var(--danger)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Toxicity */}
              <div className="report-cell">
                <div className="report-cell-label">2. Toxicity</div>
                <div className={`badge ${result.toxic ? 'badge-toxic' : 'badge-safe'}`}>
                  {result.toxic ? '⚠️ Toxic' : '🛡️ Safe'}
                </div>
                <div className="meter">
                  <div className="meter-row">
                    <span>Confidence</span>
                    <strong>{Math.round(result.toxicityConfidence * 100)}%</strong>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{
                      width: `${Math.round(result.toxicityConfidence * 100)}%`,
                      background: result.toxic ? 'var(--danger)' : 'var(--info)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Spam */}
              <div className="report-cell">
                <div className="report-cell-label">4. Spam Risk</div>
                <div className={`badge ${result.isSpam ? 'badge-toxic' : 'badge-safe'}`}>
                  {result.isSpam ? '🚨 Spam / Phishing' : '✅ Legitimate'}
                </div>
                <div className="meter">
                  <div className="meter-row">
                    <span>Confidence</span>
                    <strong>{Math.round((result.spamConfidence || 0.95) * 100)}%</strong>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{
                      width: `${Math.round((result.spamConfidence || 0.95) * 100)}%`,
                      background: result.isSpam ? 'var(--danger)' : 'var(--success)'
                    }} />
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Row 2 — Emotion Full Breakdown */}
            {(() => {
              const emo = getEmo(result.emotion);
              const scores = result.emotionScores || {};
              const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
              return (
                <motion.div variants={fadeUp} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="card-header">
                    <span className="card-title">3. Emotion Engine — 6-Class Probability Distribution</span>
                    <div className="badge" style={{
                      background: `${emo.color}18`,
                      color: emo.color,
                      borderColor: `${emo.color}33`
                    }}>
                      {emo.emoji} {emo.label} — Top Prediction
                    </div>
                  </div>
                  <div className="card-body">
                    {sorted.length > 0 ? (
                      <div className="emotion-breakdown">
                        {sorted.map(([emotion, prob]) => {
                          const eInfo = getEmo(emotion);
                          const pct = Math.round(prob * 100);
                          return (
                            <div className="emotion-row" key={emotion}>
                              <span className="emotion-label" style={{ color: eInfo.color }}>
                                {eInfo.emoji} {eInfo.label}
                              </span>
                              <div className="meter-track" style={{ height: '4px' }}>
                                <motion.div
                                  className="meter-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                                  style={{ background: eInfo.color }}
                                />
                              </div>
                              <span className="emotion-pct">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="meter">
                        <div className="meter-row">
                          <span>Confidence</span>
                          <strong>{Math.round((result.emotionConfidence || 0.85) * 100)}%</strong>
                        </div>
                        <div className="meter-track">
                          <div className="meter-fill" style={{ width: `${Math.round((result.emotionConfidence || 0.85) * 100)}%`, background: emo.color }} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })()}

            {/* Row 3 — Readability + Keywords */}
            <motion.div variants={fadeUp} className="report-grid">

              {/* Readability */}
              <div className="report-cell">
                <div className="report-cell-label">5. Readability</div>
                <div className="readability-value">📖 {result.gradeLevel || 'Standard'}</div>
                <div className="readability-meta">
                  <span>Words: {result.wordCount || 0}</span>
                  <span>Ease: {result.readingEase || 70}/100</span>
                </div>
              </div>

              {/* Keywords */}
              <div className="report-cell" style={{ gridColumn: 'span 2' }}>
                <div className="report-cell-label">6. Key Terms</div>
                <div className="tags">
                  {result.keywords && result.keywords.length > 0 ? (
                    result.keywords.map((kw, i) => <span key={i} className="tag">{kw}</span>)
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>No keywords extracted.</span>
                  )}
                </div>
              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
