import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Ensure the database is connected before handling any requests
let isConnected = false;

export default async (req: any, res: any) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};
