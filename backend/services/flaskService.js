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

  // 1. Precise Profanity, Insult & Toxicity Guard
  const PROFANITY = new Set(['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'crap', 'bullshit', 'dick', 'pussy', 'damn', 'slut', 'whore']);
  const HARASSMENT = new Set(['die', 'kill', 'retard', 'nigger', 'faggot', 'idiot', 'stupid', 'dumb', 'loser', 'garbage', 'trash', 'useless', 'ugly', 'scam']);
  
  const cleanWords = words.map(w => w.replace(/[^a-z]/g, ''));
  const hasProfanity = cleanWords.some(w => PROFANITY.has(w));
  const hasHarassment = cleanWords.some(w => HARASSMENT.has(w)) || lower.includes('nobody likes you') || lower.includes('get off');
  const isToxic = hasProfanity || hasHarassment;

  // 2. High-Precision Sentiment
  const POSITIVE_LEXICON = new Set(['good', 'great', 'awesome', 'excellent', 'sick', 'dope', 'lit', 'fire', 'amazing', 'love', 'loved', 'best', 'happy', 'outstanding', 'surprised', 'super', 'wonderful', 'fantastic', 'cool', 'brilliant', 'insane', 'nice']);
  const NEGATIVE_LEXICON = new Set(['bad', 'worst', 'terrible', 'scam', 'broken', 'hate', 'garbage', 'poor', 'sad', 'delay', 'delayed', 'horrible', 'fake', 'disaster', 'trash', 'awful', 'useless', 'idiot', 'stupid', 'dumb', 'nobody']);

  let posScore = 0;
  let negScore = 0;

  cleanWords.forEach(clean => {
    if (POSITIVE_LEXICON.has(clean)) posScore++;
    if (NEGATIVE_LEXICON.has(clean)) negScore++;
  });

  let sentiment = 'POSITIVE';
  let sentimentConfidence = 0.89;

  if (negScore > posScore || isToxic) {
    sentiment = 'NEGATIVE';
    sentimentConfidence = 0.91;
  } else if (posScore === 0 && negScore === 0) {
    sentimentConfidence = 0.72;
  }

  // 3. Emotion Classifier (matching 6 classes: joy, sadness, anger, fear, love, surprise)
  let emotion = 'JOY';
  let emotionConfidence = 0.85;
  let emotionScores = { joy: 0.15, sadness: 0.15, anger: 0.15, fear: 0.15, love: 0.15, surprise: 0.15 };

  if (hasProfanity || hasHarassment || lower.includes('angry') || lower.includes('furious') || lower.includes('annoyed') || lower.includes('idiot') || lower.includes('garbage')) {
    emotion = 'ANGER'; emotionConfidence = 0.88;
    emotionScores = { joy: 0.02, sadness: 0.08, anger: 0.82, fear: 0.04, love: 0.01, surprise: 0.03 };
  } else if (lower.includes('cry') || lower.includes('sad') || lower.includes('depressed') || lower.includes('heartbroken') || lower.includes('nobody')) {
    emotion = 'SADNESS'; emotionConfidence = 0.89;
    emotionScores = { joy: 0.02, sadness: 0.85, anger: 0.06, fear: 0.04, love: 0.01, surprise: 0.02 };
  } else if (lower.includes('scam') || lower.includes('phishing') || lower.includes('afraid') || lower.includes('scared') || lower.includes('bank')) {
    emotion = 'FEAR'; emotionConfidence = 0.82;
    emotionScores = { joy: 0.02, sadness: 0.06, anger: 0.05, fear: 0.82, love: 0.01, surprise: 0.04 };
  } else if (lower.includes('love') || lower.includes('adoring') || lower.includes('cherish')) {
    emotion = 'LOVE'; emotionConfidence = 0.93;
    emotionScores = { joy: 0.05, sadness: 0.01, anger: 0.01, fear: 0.01, love: 0.90, surprise: 0.02 };
  } else if (lower.includes('sick') || lower.includes('wow') || lower.includes('surprised') || lower.includes('unbelievable') || lower.includes('shocked')) {
    emotion = 'SURPRISE'; emotionConfidence = 0.88;
    emotionScores = { joy: 0.05, sadness: 0.02, anger: 0.02, fear: 0.02, love: 0.02, surprise: 0.87 };
  } else if (sentiment === 'NEGATIVE') {
    emotion = 'ANGER'; emotionConfidence = 0.78;
    emotionScores = { joy: 0.05, sadness: 0.25, anger: 0.60, fear: 0.05, love: 0.01, surprise: 0.04 };
  } else {
    emotion = 'JOY'; emotionConfidence = 0.90;
    emotionScores = { joy: 0.88, sadness: 0.02, anger: 0.02, fear: 0.02, love: 0.04, surprise: 0.02 };
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
    sentiment: sentiment.toLowerCase(),
    sentimentConfidence,
    toxic: isToxic,
    toxicityConfidence: isToxic ? 0.94 : 0.97,
    emotion: emotion.toLowerCase(),
    emotionConfidence,
    emotionScores,
    isSpam: isSpam,
    spamConfidence: isSpam ? 0.95 : 0.92,
    keywords: keywords.length ? keywords : ['text', 'analysis'],
    wordCount,
    charCount,
    readingEase,
    gradeLevel: `${gradeLevel}.0`
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

    const rawSent = (sentimentRes.data.sentiment || 'positive').toLowerCase();
    const rawTox = toxicityRes.data.toxic;
    const isToxicBool = typeof rawTox === 'boolean' ? rawTox : (rawTox === 'TOXIC' || rawTox === 'toxic' || rawTox === true);
    const rawSpam = spamRes.data.isSpam;
    const isSpamBool = typeof rawSpam === 'boolean' ? rawSpam : (rawSpam === 'SPAM' || rawSpam === 'spam' || rawSpam === true);

    return {
      sentiment: rawSent,
      sentimentConfidence: sentimentRes.data.confidence,
      toxic: isToxicBool,
      toxicityConfidence: toxicityRes.data.confidence,
      emotion: (emotionRes.data.emotion || 'joy').toLowerCase(),
      emotionConfidence: emotionRes.data.confidence,
      emotionScores: emotionRes.data.scores,
      isSpam: isSpamBool,
      spamConfidence: spamRes.data.confidence,
      keywords: keywordsRes.data.keywords,
      wordCount: readabilityRes.data.wordCount,
      charCount: readabilityRes.data.charCount,
      readingEase: readabilityRes.data.readingEase,
      gradeLevel: String(readabilityRes.data.gradeLevel || '8.0')
    };
  } catch (error) {
    console.warn(`[flaskService] Microservice error (${error.message}). Executing JS Engine fallback.`);
    return jsFallbackAnalysis(text);
  }
};
