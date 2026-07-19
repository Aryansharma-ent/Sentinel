import axios from 'axios';

const FLASK_SERVICE_URL = process.env.FLASK_SERVICE_URL || 'http://127.0.0.1:5001';

/**
 * Service executing 6 parallel HTTP requests to Python Flask ML microservice
 */
export const analyzeTextWithFlask = async (text) => {
  try {
    const [
      sentimentRes,
      toxicityRes,
      emotionRes,
      spamRes,
      keywordsRes,
      readabilityRes
    ] = await Promise.all([
      axios.post(`${FLASK_SERVICE_URL}/predict/sentiment`, { text }),
      axios.post(`${FLASK_SERVICE_URL}/predict/toxicity`, { text }),
      axios.post(`${FLASK_SERVICE_URL}/predict/emotion`, { text }),
      axios.post(`${FLASK_SERVICE_URL}/predict/spam`, { text }),
      axios.post(`${FLASK_SERVICE_URL}/extract/keywords`, { text }),
      axios.post(`${FLASK_SERVICE_URL}/analyze/readability`, { text })
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
    if (error.code === 'ECONNREFUSED' || (error.response && error.response.status === 500)) {
      throw new Error("Python Flask microservice is offline or unreachable on port 5001. Please run `python app.py`.");
    }
    throw error;
  }
};
