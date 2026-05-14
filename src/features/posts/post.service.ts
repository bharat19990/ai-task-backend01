import Post, { IPost } from './post.model.js';
import { AppError } from '../../middlewares/errorMiddleware.js';

/**
 * Post service contains all business logic for posts.
 */
class PostService {
  /**
   * Create a new post.
   */
  async createPost(data: { title: string; content: string; author: string }): Promise<IPost> {
    const post = await Post.create(data);
    return post.populate('author', 'name email role');
  }

  /**
   * Get all posts (admin view) - includes all statuses.
   */
  async getAllPosts(): Promise<IPost[]> {
    return Post.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  }

  /**
   * Get posts by author (user's own posts).
   */
  async getPostsByAuthor(authorId: string): Promise<IPost[]> {
    return Post.find({ author: authorId })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
  }

  /**
   * Update a post by ID.
   */
  async updatePost(
    postId: string,
    data: Partial<{ title: string; content: string; status: string }>,
    userId: string,
    isAdmin: boolean
  ): Promise<IPost> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Only admin or the author can update
    if (!isAdmin && post.author.toString() !== userId) {
      throw new AppError('Not authorized to update this post', 403);
    }

    // Only admin can change status
    if (data.status && !isAdmin) {
      throw new AppError('Only admins can change post status', 403);
    }

    Object.assign(post, data);
    await post.save();

    return post.populate('author', 'name email role');
  }

  /**
   * Delete a post by ID (admin only - soft delete by setting status to removed).
   */
  async deletePost(postId: string): Promise<IPost> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    post.status = 'removed';
    await post.save();

    return post.populate('author', 'name email role');
  }
}

export default new PostService();
