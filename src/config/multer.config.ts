import { registerAs } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = registerAs('multer', () => ({
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(csv|pdf)$/)) {
      return callback(new Error('Apenas arquivos CSV e PDF são permitidos!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})); 