import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export class CloudinaryService {
  async uploadReceiptImage(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
        return reject(new Error('Las credenciales de Cloudinary no están configuradas en el servidor.'));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'vet_sales_receipts',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            return resolve(result.secure_url);
          }
          return reject(new Error('Fallo al subir archivo a Cloudinary.'));
        }
      );

      uploadStream.end(fileBuffer);
    });
  }
}
