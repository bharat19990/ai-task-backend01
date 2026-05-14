import express from 'express';
import { generateContent, getSuggestions } from './ai.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateContent);
router.get('/suggestions', protect, getSuggestions);

export default router;
