import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import User from './features/users/user.model.js';

const PORT = process.env.PORT || 5000;

/**
 * Seeds an initial admin user if none exists.
 */
const seedAdmin = async (): Promise<void> => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin user created: admin@example.com / admin123');
    }

    const userExists = await User.findOne({ role: 'user' });
    if (!userExists) {
      await User.create({
        name: 'John Doe',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
      });
      console.log('Default user created: user@example.com / user123');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: Connected\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
