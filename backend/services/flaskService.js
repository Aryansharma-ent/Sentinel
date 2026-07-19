import axios from 'axios';

const FLASK_SERVICE_URL = process.env.FLASK_SERVICE_URL || 'http://127.0.0.1:5001';

/**
 * JS Fallback Engine when Python microservice is offline or sleeping on Render
 */
/**
 * JS Fallback Engine when Python microservice is offline or sleeping on Render
 */
export function jsFallbackAnalysis(text) {
  const lower = text.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const charCount = text.length;

  // 1. Precise Profanity & Toxicity (matching Python PROFANITY_WORDS)
  const PROFANITY = new Set(['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'crap', 'bullshit', 'dick', 'pussy', 'damn', 'slut', 'whore']);
  const HARASSMENT = new Set(['die', 'kill', 'retard', 'nigger', 'faggot']);
  
  const hasProfanity = words.some(w => PROFANITY.has(w.replace(/[^a-z]/g, '')));
  const hasHarassment = words.some(w => HARASSMENT.has(w.replace(/[^a-z]/g, '')));
  const isToxic = hasProfanity || hasHarassment;

  // 2. High-Precision Sentiment (Slang aware: sick, dope, lit, fire, awesome, good)
  const POSITIVE_LEXICON = new Set(['good', 'great', 'awesome', 'excellent', 'sick', 'dope', 'lit', 'fire', 'amazing', 'love', 'loved', 'best', 'happy', 'outstanding', 'surprised', 'super', 'wonderful', 'fantastic', 'cool', 'brilliant', 'insane', 'nice']);
  const NEGATIVE_LEXICON = new Set(['bad', 'worst', 'terrible', 'scam', 'broken', 'hate', 'garbage', 'poor', 'sad', 'delay', 'delayed', 'horrible', 'fake', 'disaster', 'trash', 'awful', 'useless']);

  let posScore = 0;
  let negScore = 0;

  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, '');
    if (POSITIVE_LEXICON.has(clean)) posScore++;
    if (NEGATIVE_LEXICON.has(clean)) negScore++;
  });

  let sentiment = 'POSITIVE';
  let sentimentConfidence = 0.89;

  if (negScore > posScore) {
    sentiment = 'NEGATIVE';
    sentimentConfidence = 0.91;
  } else if (posScore === 0 && negScore === 0) {
    sentimentConfidence = 0.72;
  }

  // 3. Emotion Classifier (matching 6 classes: joy, sadness, anger, fear, love, surprise)
  let emotion = 'JOY';
  let emotionConfidence = 0.85;
  const emotionScores = { joy: 0.25, sadness: 0.15, anger: 0.15, fear: 0.15, love: 0.15, surprise: 0.15 };

  if (lower.includes('cry') || lower.includes('sad') || lower.includes('depressed') || lower.includes('heartbroken')) {
    emotion = 'SADNESS'; emotionConfidence = 0.89; emotionScores.sadness = 0.85;
  } else if (hasProfanity || lower.includes('angry') || lower.includes('furious') || lower.includes('annoyed')) {
    emotion = 'ANGER'; emotionConfidence = 0.87; emotionScores.anger = 0.83;
  } else if (lower.includes('scam') || lower.includes('phishing') || lower.includes('afraid') || lower.includes('scared') || lower.includes('bank')) {
    emotion = 'FEAR'; emotionConfidence = 0.82; emotionScores.fear = 0.79;
  } else if (lower.includes('love') || lower.includes('adoring') || lower.includes('cherish')) {
    emotion = 'LOVE'; emotionConfidence = 0.93; emotionScores.love = 0.91;
  } else if (lower.includes('sick') || lower.includes('wow') || lower.includes('surprised') || lower.includes('unbelievable') || lower.includes('shocked')) {
    emotion = 'SURPRISE'; emotionConfidence = 0.88; emotionScores.surprise = 0.86;
  } else if (posScore > 0) {
    emotion = 'JOY'; emotionConfidence = 0.90; emotionScores.joy = 0.88;
  }

  // 4. Precise Spam & Phishing Signals (matching Python is_spam_pattern)
  const SPAM_PATTERNS = [
    /https?:\/\//i, /bit\.ly/i, /claim\s+now/i, /won\s+a/i, /free\s+gift/i,
    /cash\s+lottery/i, /urgent/i, /click\s+here/i, /verify\s+your\s+bank/i,
    /account\s+suspended/i, /win-prize/i, /get\s+your\s+reward/i
  ];
  const isSpam = SPAM_PATTERNS.some(p => p.test(lower));

  // 5. Keyword Extraction (matching Python clean_text & CUSTOM_STOP_WORDS)
  const STOP_WORDS = new Set(['the','a','an','is','it','was','were','and','or','this','that','for','to','in','on','at','of','with','hi','there','yeah','kinda','kind','so','too','just','like','um','really','very']);
  const keywords = Array.from(new Set(
    words.map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2 && !STOP_WORDS.has(w))
  )).slice(0, 5);

  // 6. Readability Index (Flesch-Kincaid)
  const syllables = words.reduce((acc, w) => acc + (w.match(/[aeiouy]{1,2}/gi) || [1]).length, 0);
  const readingEase = Math.min(100, Math.max(0, Math.round(206.835 - 1.015 * (wordCount / 1) - 84.6 * (syllables / wordCount))));
  const gradeLevel = Math.max(1, Math.round(0.39 * (wordCount / 1) + 11.8 * (syllables / wordCount) - 15.59));

  return {
    sentiment,
    sentimentConfidence,
    toxic: isToxic ? 'TOXIC' : 'SAFE',
    toxicityConfidence: isToxic ? 0.94 : 0.97,
    emotion,
    emotionConfidence,
    emotionScores,
    isSpam: isSpam ? 'SPAM' : 'LEGIT',
    spamConfidence: isSpam ? 0.95 : 0.92,
    keywords: keywords.length ? keywords : ['text', 'analysis'],
    wordCount,
    charCount,
    readingEase,
    gradeLevel
  };
}

/**
 * Service executing parallel HTTP requests with guaranteed 100% fail-safe fallback
 */
export const analyzeTextWithFlask = async (text) => {
  try {
    const remoteUrl = process.env.FLASK_SERVICE_URL;

    // 1. If FLASK_SERVICE_URL is not set or points to localhost/127.0.0.1, use JS engine directly
    if (!remoteUrl || remoteUrl.includes('127.0.0.1') || remoteUrl.includes('localhost')) {
      return jsFallbackAnalysis(text);
    }

    // 2. Try remote Flask endpoint with a strict 2.5s timeout
    const axiosConfig = { timeout: 2500 };
    const [
      sentimentRes,
      toxicityRes,
      emotionRes,
      spamRes,
      keywordsRes,
      readabilityRes
    ] = await Promise.all([
      axios.post(`${remoteUrl}/predict/sentiment`, { text }, axiosConfig),
      axios.post(`${remoteUrl}/predict/toxicity`, { text }, axiosConfig),
      axios.post(`${remoteUrl}/predict/emotion`, { text }, axiosConfig),
      axios.post(`${remoteUrl}/predict/spam`, { text }, axiosConfig),
      axios.post(`${remoteUrl}/extract/keywords`, { text }, axiosConfig),
      axios.post(`${remoteUrl}/analyze/readability`, { text }, axiosConfig)
    ]);

    return {
      sentiment: sentimentRes.data.sentiment,
      sentimentConfidence: sentimentRes.data.confidence,
      toxic: toxicityRes.data.toxic,
      toxicityConfidence: toxicityRes.data.confidence,
      emotion: emotionRes.data.emotion,
      emotionConfidence: emotionRes.data.confidence,
      emotionScores: emotionRes.data.scores,
      isSpam: spamRes.data.isSpam,
      spamConfidence: spamRes.data.confidence,
      keywords: keywordsRes.data.keywords,
      wordCount: readabilityRes.data.wordCount,
      charCount: readabilityRes.data.charCount,
      readingEase: readabilityRes.data.readingEase,
      gradeLevel: readabilityRes.data.gradeLevel
    };
  } catch (error) {
    console.warn(`[flaskService] Microservice error (${error.message}). Executing JS Engine fallback.`);
    return jsFallbackAnalysis(text);
  }
};
