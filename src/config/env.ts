import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/vet_db',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_veterinary_management_system',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ADMIN_INITIAL_USER: process.env.ADMIN_INITIAL_USER || 'admin',
  ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || 'Admin123!',
  ADMIN_INITIAL_EMAIL: process.env.ADMIN_INITIAL_EMAIL || 'admin@veterinaria.com',
  TAX_VALOR: parseFloat(process.env.TAX_VALOR || '15'),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE ,
  EMAIL_HOST: process.env.EMAIL_HOST ,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '465', 10),
  EMAIL_USER_NOTICES: process.env.EMAIL_USER_NOTICES ,
  EMAIL_PASSWORD_NOTICES: process.env.EMAIL_PASSWORD_NOTICES ,
  EMAIL_FROM_NOTICES: process.env.EMAIL_FROM_NOTICES ,
};

