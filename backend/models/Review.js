import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative'],
    required: true
  },
  sentimentConfidence: {
    type: Number,
    required: true
  },
  toxic: {
    type: Boolean,
    required: true
  },
  toxicityConfidence: {
    type: Number,
    required: true
  },
  emotion: {
    type: String,
    required: true
  },
  emotionConfidence: {
    type: Number,
    required: true
  },
  emotionScores: {
    type: Object,
    default: {}
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  spamConfidence: {
    type: Number,
    default: 0.95
  },
  wordCount: {
    type: Number,
    default: 0
  },
  charCount: {
    type: Number,
    default: 0
  },
  readingEase: {
    type: Number,
    default: 70
  },
  gradeLevel: {
    type: String,
    default: 'Standard'
  },
  keywords: {
    type: [String],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
