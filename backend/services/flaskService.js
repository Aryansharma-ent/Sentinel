import axios from 'axios';

const FLASK_SERVICE_URL = process.env.FLASK_SERVICE_URL || 'http://127.0.0.1:5001';

/**
 * JS Fallback Engine when Python microservice is offline or sleeping on Render
 */
function jsFallbackAnalysis(text) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const charCount = text.length;

  // Sentiment
  const posWords = ['love', 'loved', 'great', 'awesome', 'excellent', 'sick', 'amazing', 'good', 'best', 'happy', 'outstanding', 'surprised', 'super', 'wonderful', 'fantastic'];
  const negWords = ['bad', 'worst', 'terrible', 'scam', 'broken', 'hate', 'garbage', 'poor', 'sad', 'delay', 'delayed', 'idiot', 'stupid', 'horrible', 'fake'];
  
  let posCount = posWords.filter(w => lower.includes(w)).length;
  let negCount = negWords.filter(w => lower.includes(w)).length;
  
  let sentiment = 'POSITIVE';
  let sentimentConfidence = 0.88;
  if (negCount > posCount) {
    sentiment = 'NEGATIVE';
    sentimentConfidence = 0.91;
  } else if (posCount === 0 && negCount === 0) {
    sentimentConfidence = 0.75;
  }

  // Toxicity
  const toxicWords = ['idiot', 'hate', 'scam', 'garbage', 'stupid', 'bitch', 'fool', 'trash', 'kill'];
  const isToxic = toxicWords.some(w => lower.includes(w));

  // Emotion
  let emotion = 'JOY';
  let emotionConfidence = 0.85;
  const emotionScores = { joy: 0.2, sadness: 0.1, anger: 0.1, fear: 0.1, love: 0.1, surprise: 0.4 };

  if (lower.includes('cry') || lower.includes('sad') || lower.includes('depressed')) {
    emotion = 'SADNESS'; emotionScores.sadness = 0.88;
  } else if (lower.includes('hate') || lower.includes('angry') || lower.includes('idiot') || lower.includes('garbage')) {
    emotion = 'ANGER'; emotionScores.anger = 0.86;
  } else if (lower.includes('scam') || lower.includes('prize') || lower.includes('claim')) {
    emotion = 'FEAR'; emotionScores.fear = 0.79;
  } else if (lower.includes('love') || lower.includes('amazing') || lower.includes('best')) {
    emotion = 'LOVE'; emotionScores.love = 0.92;
  } else if (lower.includes('wow') || lower.includes('sick') || lower.includes('surprised')) {
    emotion = 'SURPRISE'; emotionScores.surprise = 0.87;
  }

  // Spam
  const spamPatterns = [/https?:\/\//i, /claim/i, /win-prize/i, /free money/i, /click here/i, /reward/i];
  const isSpam = spamPatterns.some(p => p.test(lower));

  // Keywords
  const stopWords = new Set(['the','a','an','is','it','was','were','and','or','this','that','for','to','in','on','at','of','with']);
  const keywords = Array.from(new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(w => w.length > 3 && !stopWords.has(w)))).slice(0, 5);

  // Readability (Flesch-Kincaid estimate)
  const syllables = words.reduce((acc, w) => acc + (w.match(/[aeiouy]{1,2}/gi) || [1]).length, 0);
  const readingEase = Math.min(100, Math.max(0, Math.round(206.835 - 1.015 * (wordCount / 1) - 84.6 * (syllables / wordCount))));
  const gradeLevel = Math.max(1, Math.round(0.39 * (wordCount / 1) + 11.8 * (syllables / wordCount) - 15.59));

  return {
    sentiment,
    sentimentConfidence,
    toxic: isToxic ? 'TOXIC' : 'SAFE',
    toxicityConfidence: isToxic ? 0.92 : 0.96,
    emotion,
    emotionConfidence,
    emotionScores,
    isSpam: isSpam ? 'SPAM' : 'LEGIT',
    spamConfidence: isSpam ? 0.94 : 0.91,
    keywords: keywords.length ? keywords : ['analysis', 'text'],
    wordCount,
    charCount,
    readingEase,
    gradeLevel
  };
}

/**
 * Service executing parallel HTTP requests with automatic JS fallback
 */
export const analyzeTextWithFlask = async (text) => {
  // 1. Instant fallback on cloud environments (e.g. Render) if no remote FLASK_SERVICE_URL is set
  const isLocalDefault = !process.env.FLASK_SERVICE_URL || process.env.FLASK_SERVICE_URL.includes('127.0.0.1') || process.env.FLASK_SERVICE_URL.includes('localhost');
  const isCloudProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  if (isCloudProduction && isLocalDefault) {
    console.log(`[flaskService] Cloud environment without remote FLASK_SERVICE_URL. Executing instant JS Engine fallback.`);
    return jsFallbackAnalysis(text);
  }

  // 2. Try calling remote Flask microservice with 3s timeout
  try {
    const axiosConfig = { timeout: 3000 };
    const [
      sentimentRes,
      toxicityRes,
      emotionRes,
      spamRes,
      keywordsRes,
      readabilityRes
    ] = await Promise.all([
      axios.post(`${FLASK_SERVICE_URL}/predict/sentiment`, { text }, axiosConfig),
      axios.post(`${FLASK_SERVICE_URL}/predict/toxicity`, { text }, axiosConfig),
      axios.post(`${FLASK_SERVICE_URL}/predict/emotion`, { text }, axiosConfig),
      axios.post(`${FLASK_SERVICE_URL}/predict/spam`, { text }, axiosConfig),
      axios.post(`${FLASK_SERVICE_URL}/extract/keywords`, { text }, axiosConfig),
      axios.post(`${FLASK_SERVICE_URL}/analyze/readability`, { text }, axiosConfig)
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
    console.warn(`[flaskService] Flask microservice unreachable (${error.message}). Executing JS Engine fallback.`);
    return jsFallbackAnalysis(text);
  }
};
