import { Request, Response, NextFunction } from 'express';

interface PostValidationSchema {
  body?: Record<string, FieldValidator>;
}

interface FieldValidator {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  message?: string;
}

const validate = (schema: PostValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];

        if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          errors.push(rules.message || `${field} is required`);
          continue;
        }

        if (value) {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} cannot exceed ${rules.maxLength} characters`);
          }

          if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
};

export const createPostValidation = validate({
  body: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 200,
      message: 'Title is required',
    },
    content: {
      required: true,
      minLength: 10,
      message: 'Content is required (min 10 characters)',
    },
  },
});

export const updatePostValidation = validate({
  body: {
    title: {
      minLength: 3,
      maxLength: 200,
    },
    content: {
      minLength: 10,
    },
    status: {
      enum: ['active', 'removed'],
    },
  },
});
