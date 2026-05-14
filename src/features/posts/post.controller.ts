import { Request, Response, NextFunction } from 'express';
import postService from './post.service.js';

/**
 * Post controller handles HTTP request/response for posts.
 */
class PostController {
  /**
   * POST /api/posts
   * Create a new post.
   */
  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, content } = req.body;
      const post = await postService.createPost({
        title,
        content,
        author: String(req.user!._id),
      });

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts
   * Get all posts (admin only).
   */
  async getAllPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await postService.getAllPosts();

      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/my-posts
   * Get current user's posts.
   */
  async getMyPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await postService.getPostsByAuthor(String(req.user!._id));

      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/posts/:id
   * Update a post.
   */
  async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id as string;
      const post = await postService.updatePost(
        postId,
        req.body,
        String(req.user!._id),
        req.user!.role === 'admin'
      );

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/posts/:id
   * Delete (soft-delete) a post (admin only).
   */
  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id as string;
      const post = await postService.deletePost(postId);

      res.status(200).json({
        success: true,
        message: 'Post removed successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
