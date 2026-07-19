import Review from '../models/Review.js';
import { analyzeTextWithFlask, jsFallbackAnalysis } from '../services/flaskService.js';

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
