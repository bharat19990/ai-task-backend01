import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import { AppError } from '../../middlewares/errorMiddleware.js';
import Post from '../posts/post.model.js';

let _groq: Groq | null = null;
const getGroq = () => {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  }
  return _groq;
};

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      throw new AppError('Prompt is required', 400);
    }

    const completion = await getGroq().chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content creator. Generate a highly engaging title and a comprehensive, well-structured content body based on the given prompt. Return ONLY a valid JSON object in the exact format: {"title": "The Title", "content": "The content body formatted in paragraphs. You can use markdown."}'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const resultStr = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(resultStr);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Groq AI Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content'
    });
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const userPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title content');

    const existingTitles = userPosts.map((p) => p.title);

    let contextMessage = '';
    if (existingTitles.length > 0) {
      contextMessage = `The user has previously written posts with these titles:\n${existingTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nBased on their writing history, suggest 5 new and unique post ideas that complement their existing content. The suggestions should be related but not repetitive.`;
    } else {
      contextMessage = 'The user has no posts yet. Suggest 5 diverse and trending blog post ideas across popular topics like technology, productivity, lifestyle, and career growth.';
    }

    const completion = await getGroq().chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a creative content strategist. Suggest blog post ideas. Return ONLY a valid JSON object in the exact format: {"suggestions": [{"title": "Suggested Title", "description": "A brief 1-sentence description of the post idea"}]}'
        },
        {
          role: 'user',
          content: contextMessage
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      response_format: { type: 'json_object' }
    });

    const resultStr = completion.choices[0]?.message?.content || '{"suggestions":[]}';
    const result = JSON.parse(resultStr);

    res.status(200).json({
      success: true,
      data: result.suggestions || []
    });
  } catch (error: any) {
    console.error('Groq AI Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get suggestions'
    });
  }
};
