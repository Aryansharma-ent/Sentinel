import mongoose from 'mongoose';
import Review from '../models/Review.js';

export const getStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: "MongoDB is not connected. Unable to fetch stats."
      });
    }

    const statsResult = await Review.aggregate([
      {
        $facet: {
          totalCount: [ { $count: "count" } ],
          sentimentCounts: [ { $group: { _id: "$sentiment", count: { $sum: 1 } } } ],
          toxicityCounts: [ { $group: { _id: "$toxic", count: { $sum: 1 } } } ],
          emotionCounts: [ { $group: { _id: "$emotion", count: { $sum: 1 } } } ],
          spamCounts: [ { $group: { _id: "$isSpam", count: { $sum: 1 } } } ],
          gradeCounts: [ { $group: { _id: "$gradeLevel", count: { $sum: 1 } } } ],
          topKeywords: [
            { $unwind: "$keywords" },
            { $group: { _id: "$keywords", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
          ],
          recentSubmissions: [ { $sort: { timestamp: -1 } }, { $limit: 15 } ]
        }
      }
    ]);

    const result = statsResult[0];
    const totalReviews = result.totalCount[0] ? result.totalCount[0].count : 0;

    const sentimentSummary = { positive: 0, negative: 0 };
    result.sentimentCounts.forEach(item => {
      if (item._id === 'positive') sentimentSummary.positive = item.count;
      if (item._id === 'negative') sentimentSummary.negative = item.count;
    });

    const toxicitySummary = { toxic: 0, nonToxic: 0 };
    result.toxicityCounts.forEach(item => {
      if (item._id === true) toxicitySummary.toxic = item.count;
      if (item._id === false) toxicitySummary.nonToxic = item.count;
    });

    const spamSummary = { spam: 0, legit: 0 };
    result.spamCounts.forEach(item => {
      if (item._id === true) spamSummary.spam = item.count;
      if (item._id === false) spamSummary.legit = item.count;
    });

    const emotionSummary = {};
    result.emotionCounts.forEach(item => {
      if (item._id) emotionSummary[item._id] = item.count;
    });

    const gradeSummary = {};
    result.gradeCounts.forEach(item => {
      if (item._id) gradeSummary[item._id] = item.count;
    });

    const keywordsSummary = result.topKeywords.map(k => ({ word: k._id, count: k.count }));

    return res.status(200).json({
      success: true,
      stats: {
        totalReviews,
        sentiment: sentimentSummary,
        toxicity: toxicitySummary,
        spam: spamSummary,
        emotions: emotionSummary,
        grades: gradeSummary,
        topKeywords: keywordsSummary,
        recentSubmissions: result.recentSubmissions
      }
    });

  } catch (error) {
    next(error);
  }
};
