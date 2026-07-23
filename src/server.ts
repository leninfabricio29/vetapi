import app from './app';
import { env } from './config/env';
import { connectDB } from './database/connection';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`Api running at: http://localhost:${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
