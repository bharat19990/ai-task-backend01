import mongoose, { Schema, Document } from 'mongoose';

export type PostStatus = 'active' | 'removed';

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    status: {
      type: String,
      enum: ['active', 'removed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
