import { Router } from 'express';
import postController from './post.controller.js';
import { createPostValidation, updatePostValidation } from './post.validation.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { authorize } from '../../middlewares/roleMiddleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createPostValidation, postController.createPost);
router.get('/my-posts', postController.getMyPosts);

// Admin routes
router.get('/', authorize('admin'), postController.getAllPosts);
router.put('/:id', updatePostValidation, postController.updatePost);
router.delete('/:id', authorize('admin'), postController.deletePost);

export default router;
