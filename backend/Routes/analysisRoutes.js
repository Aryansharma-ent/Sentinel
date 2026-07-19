import express from 'express';
import { analyzeText, deleteReview, clearAllReviews } from '../Controllers/analysisController.js';
import { validateTextInput } from '../Middlewares/validateInput.js';

const router = express.Router();

// POST /api/analyze - Accepts text, calls Flask ML, stores in MongoDB
router.post('/analyze', validateTextInput, analyzeText);

// DELETE /api/reviews/all - Clear all submissions (Must come BEFORE :id parameter!)
router.delete('/reviews/all', clearAllReviews);
router.delete('/reviews', clearAllReviews);

// DELETE /api/reviews/:id - Delete single submission
router.delete('/reviews/:id', deleteReview);

export default router;
