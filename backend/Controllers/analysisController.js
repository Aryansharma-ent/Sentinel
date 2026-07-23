import Review from '../models/Review.js';
import { analyzeTextWithFlask, jsFallbackAnalysis } from '../services/flaskService.js';

function normalizePredictions(text, res) {
  const lower = text.toLowerCase();
  const words = new Set(lower.match(/\b\w+\b/g) || []);
  
  // 1. Detect Negation
  const hasNegation = /\b(not|no|never|n't|don't|doesn't|didn't|won't|can't|couldn't|shouldn't|wouldn't|isn't|aren't|wasn't|weren't)\b/i.test(lower);

  // 2. Detect Positive Slang / Praise
  const slangPositive = new Set(['sick', 'dope', 'lit', 'fire', 'insane', 'awesome', 'cool', 'amazing', 'great', 'fantastic', 'wonderful', 'excellent', 'superb', 'outstanding', 'best', 'love', 'loved', 'good', 'nice']);
  const containsPositiveSlang = Array.from(words).some(w => slangPositive.has(w));

  // 3. Detect Negative Distress / Threat / Harm
  const distressWords = new Set(['terrified', 'scared', 'fear', 'fears', 'scary', 'anxious', 'afraid', 'panic', 'worried', 'crying', 'depressed', 'sad', 'heartbroken', 'angry', 'furious', 'annoyed', 'hate', 'garbage', 'idiot', 'stupid', 'dumb', 'die', 'kill', 'scam', 'horrible', 'terrible', 'awful', 'bad', 'worst']);
  const containsDistress = Array.from(words).some(w => distressWords.has(w));

  // 4. Force Emotion & Toxicity Harmony
  let emotion = (res.emotion || 'joy').toLowerCase();
  let toxic = Boolean(res.toxic);
  let isSpam = Boolean(res.isSpam);
  let sentiment = (res.sentiment || 'positive').toLowerCase();

  // Enforce Distress Emotion
  if (containsDistress || toxic) {
    if (lower.includes('terrified') || lower.includes('scared') || lower.includes('fear') || lower.includes('afraid') || lower.includes('panic')) {
      emotion = 'fear';
    } else if (lower.includes('cry') || lower.includes('sad') || lower.includes('depressed') || lower.includes('heartbroken')) {
      emotion = 'sadness';
    } else if (toxic || lower.includes('angry') || lower.includes('idiot') || lower.includes('garbage') || lower.includes('hate')) {
      emotion = 'anger';
    }
  }

  // Cross-Model Sentiment Conflict Resolution:
  // If Emotion is fear, sadness, anger OR toxic OR spam OR contains distress OR negated positive -> Sentiment MUST be negative!
  if (['fear', 'sadness', 'anger'].includes(emotion) || toxic || isSpam || (hasNegation && containsPositiveSlang) || containsDistress) {
    sentiment = 'negative';
  } else if (['joy', 'love', 'surprise'].includes(emotion) && !hasNegation) {
    sentiment = 'positive';
  }

  return {
    ...res,
    sentiment,
    emotion,
    toxic,
    isSpam
  };
}

export const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'text' field is required and must be a non-empty string."
      });
    }

    console.log(`[POST /api/analyze] Processing request...`);
    let mlResults;
    try {
      mlResults = await analyzeTextWithFlask(text);
    } catch (mlErr) {
      console.warn(`[ML Error] Exception during analysis: ${mlErr.message}. Executing fallback.`);
      mlResults = jsFallbackAnalysis(text);
    }

    mlResults = normalizePredictions(text, mlResults);

    let savedData;
    try {
      const newReview = new Review({
        text,
        sentiment: mlResults.sentiment,
        sentimentConfidence: mlResults.sentimentConfidence,
        toxic: mlResults.toxic,
        toxicityConfidence: mlResults.toxicityConfidence,
        emotion: mlResults.emotion,
        emotionConfidence: mlResults.emotionConfidence,
        emotionScores: mlResults.emotionScores,
        isSpam: mlResults.isSpam,
        spamConfidence: mlResults.spamConfidence,
        keywords: mlResults.keywords,
        wordCount: mlResults.wordCount,
        charCount: mlResults.charCount,
        readingEase: mlResults.readingEase,
        gradeLevel: mlResults.gradeLevel
      });

      savedData = await newReview.save();
      console.log(`✓ Review document persisted to MongoDB (ID: ${savedData._id})`);
    } catch (dbErr) {
      console.warn(`[MongoDB Warning] Could not persist review: ${dbErr.message}`);
      savedData = {
        _id: Date.now().toString(),
        text,
        createdAt: new Date().toISOString(),
        ...mlResults
      };
    }

    return res.status(201).json({
      success: true,
      data: savedData
    });

  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Submission entry not found in database."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission deleted successfully.",
      id
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllReviews = async (req, res, next) => {
  try {
    await Review.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All submissions deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};
